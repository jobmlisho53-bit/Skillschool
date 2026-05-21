const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const ADMIN_USER = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'changeme123';

function protectAdmin(req, res, next) {
    if (req.path.startsWith('/admin') || req.path.startsWith('/api/admin')) {
        const auth = req.headers.authorization;
        if (!auth) {
            res.setHeader('WWW-Authenticate', 'Basic realm="Admin Access"');
            return res.status(401).send('Authentication required');
        }
        const base64 = auth.split(' ')[1];
        const [user, pass] = Buffer.from(base64, 'base64').toString().split(':');
        if (user !== ADMIN_USER || pass !== ADMIN_PASS) {
            res.setHeader('WWW-Authenticate', 'Basic realm="Admin Access"');
            return res.status(401).send('Invalid credentials');
        }
    }
    next();
}

app.use(protectAdmin);

const supabase = require('../lib/supabase');

// Improved YouTube ID extraction
function extractYouTubeId(url) {
    if (!url) return null;
    
    // Handle youtu.be format
    if (url.includes('youtu.be/')) {
        const match = url.match(/youtu\.be\/([^?&]+)/);
        if (match) return match[1];
    }
    
    // Handle youtube.com/watch?v= format
    if (url.includes('youtube.com/watch')) {
        const match = url.match(/[?&]v=([^&?]+)/);
        if (match) return match[1];
    }
    
    // Handle youtube.com/embed/ format
    if (url.includes('youtube.com/embed/')) {
        const match = url.match(/embed\/([^?&]+)/);
        if (match) return match[1];
    }
    
    return null;
}

function generateLessonId() {
    return 'lesson_' + Date.now() + '_' + Math.random().toString(36).substr(2, 8);
}

// ============ PUBLIC API ============
app.get('/api/modules', async (req, res) => {
    try {
        const { data, error } = await supabase.from('modules').select('*');
        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/modules/:moduleId/lessons', async (req, res) => {
    try {
        const { data, error } = await supabase.from('lessons').select('*').eq('module_id', req.params.moduleId);
        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/progress/:userId/:moduleId', async (req, res) => {
    try {
        const { userId, moduleId } = req.params;
        const { data: lessons } = await supabase.from('lessons').select('id').eq('module_id', moduleId);
        const { data: completed } = await supabase.from('user_progress').select('lesson_id').eq('user_id', userId).eq('module_id', moduleId).eq('completed', true);
        const completedIds = completed?.map(c => c.lesson_id) || [];
        const total = lessons?.length || 0;
        const completedCount = completedIds.length;
        const percentage = total > 0 ? Math.round((completedCount / total) * 100) : 0;
        res.json({ total, completed: completedCount, percentage, completedLessons: completedIds });
    } catch (err) {
        res.json({ total: 0, completed: 0, percentage: 0, completedLessons: [] });
    }
});

app.post('/api/progress/mark-complete', async (req, res) => {
    try {
        const { userId, lessonId, moduleId } = req.body;
        const { data: existing } = await supabase.from('user_progress').select('id').eq('user_id', userId).eq('lesson_id', lessonId).single();
        if (existing) {
            await supabase.from('user_progress').update({ completed: true, completed_at: new Date() }).eq('id', existing.id);
        } else {
            await supabase.from('user_progress').insert([{ user_id: userId, lesson_id: lessonId, module_id: moduleId, completed: true, completed_at: new Date() }]);
        }
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        await supabase.from('contacts').insert([{ name, email, subject, message, created_at: new Date() }]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============ ADMIN API ============
app.post('/api/admin/modules', async (req, res) => {
    try {
        const { moduleId, title, description, estimatedTime, category } = req.body;
        if (!moduleId || !title) {
            return res.status(400).json({ error: 'Module ID and Title are required' });
        }
        const { data, error } = await supabase.from('modules').insert([{
            module_id: moduleId, title, description: description || '', estimated_time: estimatedTime || 'TBD', category: category || 'General'
        }]).select();
        if (error) throw error;
        res.status(201).json(data[0]);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.post('/api/admin/youtube-lesson', async (req, res) => {
    try {
        const { moduleId, lessonTitle, youtubeUrl, duration, order } = req.body;
        
        if (!moduleId || !lessonTitle || !youtubeUrl) {
            return res.status(400).json({ error: 'Module ID, Lesson Title, and YouTube URL are required' });
        }
        
        const videoId = extractYouTubeId(youtubeUrl);
        console.log('Extracted video ID:', videoId, 'from URL:', youtubeUrl);
        
        if (!videoId) {
            return res.status(400).json({ error: 'Invalid YouTube URL. Could not extract video ID.' });
        }
        
        const lessonId = generateLessonId();
        
        const { data, error } = await supabase.from('lessons').insert([{
            lesson_id: lessonId,
            module_id: moduleId,
            title: lessonTitle,
            content_type: 'youtube',
            youtube_url: youtubeUrl,
            youtube_id: videoId,
            duration: duration || 'N/A',
            lesson_order: order || 1
        }]).select();
        
        if (error) {
            console.error('Supabase error:', error);
            return res.status(400).json({ error: error.message });
        }
        
        console.log('Lesson saved with youtube_id:', videoId);
        res.status(201).json(data[0]);
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ error: err.message });
    }
});

// ============ FRONTEND ROUTES ============
app.get('/', (req, res) => { res.sendFile(path.join(__dirname, '../public/index.html')); });
app.get('/courses', (req, res) => { res.sendFile(path.join(__dirname, '../public/courses.html')); });
app.get('/admin', (req, res) => { res.sendFile(path.join(__dirname, '../public/admin/index.html')); });
app.get('/privacy', (req, res) => { res.sendFile(path.join(__dirname, '../public/privacy.html')); });
app.get('/terms', (req, res) => { res.sendFile(path.join(__dirname, '../public/terms.html')); });
app.get('/contact', (req, res) => { res.sendFile(path.join(__dirname, '../public/contact.html')); });
app.get('/about', (req, res) => { res.sendFile(path.join(__dirname, '../public/about.html')); });
app.get('/faq', (req, res) => { res.sendFile(path.join(__dirname, '../public/faq.html')); });
app.get('/dmca', (req, res) => { res.sendFile(path.join(__dirname, '../public/dmca.html')); });

app.get('/robots.txt', (req, res) => { res.type('text/plain'); res.send('User-agent: *\nAllow: /\nSitemap: https://skillschool-dbc1.vercel.app/sitemap.xml'); });
app.get('/sitemap.xml', (req, res) => { res.type('application/xml'); res.send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://skillschool-dbc1.vercel.app/</loc></url><url><loc>https://skillschool-dbc1.vercel.app/courses</loc></url></urlset>`); });

app.use((req, res) => { res.status(404).send('Page not found'); });

module.exports = app;

// ============ EDIT/DELETE ENDPOINTS ============

// Update module
app.put('/api/admin/modules/:moduleId', async (req, res) => {
    try {
        const { moduleId } = req.params;
        const { title, description, estimated_time, category } = req.body;
        
        const { data, error } = await supabase
            .from('modules')
            .update({ title, description, estimated_time, category, updated_at: new Date() })
            .eq('module_id', moduleId)
            .select();
        
        if (error) throw error;
        res.json(data[0]);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Update lesson
app.put('/api/admin/lessons/:lessonId', async (req, res) => {
    try {
        const { lessonId } = req.params;
        const { title, youtube_url, youtube_id, duration, lesson_order } = req.body;
        
        const { data, error } = await supabase
            .from('lessons')
            .update({ title, youtube_url, youtube_id, duration, lesson_order, updated_at: new Date() })
            .eq('id', lessonId)
            .select();
        
        if (error) throw error;
        res.json(data[0]);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete module (and all its lessons)
app.delete('/api/admin/modules/:moduleId', async (req, res) => {
    try {
        const { moduleId } = req.params;
        
        // First delete all lessons in this module
        await supabase.from('lessons').delete().eq('module_id', moduleId);
        // Then delete the module
        await supabase.from('modules').delete().eq('module_id', moduleId);
        
        res.json({ success: true });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete single lesson
app.delete('/api/admin/lessons/:lessonId', async (req, res) => {
    try {
        const { lessonId } = req.params;
        await supabase.from('lessons').delete().eq('id', lessonId);
        res.json({ success: true });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});
