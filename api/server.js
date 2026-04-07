const express = require('express');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');
const supabaseDB = require('../utils/database');
require('dotenv').config();

const app = express();

// ============ SECURITY MIDDLEWARE ============

const allowedOrigins = [
    'https://skillschool-dbc1.vercel.app',
    'http://localhost:5000',
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: function(origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            return callback(new Error('CORS policy blocked this request'), false);
        }
        return callback(null, true);
    },
    credentials: true
}));

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: 'Too many requests, please try again later.' }
});

const adminLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: { error: 'Rate limit exceeded for admin operations.' }
});

app.use('/api/', apiLimiter);
app.use('/api/admin/', adminLimiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============ ADMIN AUTHENTICATION ============
const ADMIN_USER = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'changeme123';

function protectAdmin(req, res, next) {
    const isAdminRoute = req.path.startsWith('/admin') || req.path.startsWith('/api/admin');
    
    if (isAdminRoute) {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Basic ')) {
            res.statusCode = 401;
            res.setHeader('WWW-Authenticate', 'Basic realm="Income School Admin"');
            return res.end('Access denied. Admin area requires authentication.');
        }
        
        try {
            const base64Credentials = authHeader.split(' ')[1];
            const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
            const [username, password] = credentials.split(':');
            
            if (username !== ADMIN_USER || password !== ADMIN_PASS) {
                res.statusCode = 401;
                return res.end('Invalid credentials. Access denied.');
            }
        } catch (err) {
            res.statusCode = 401;
            return res.end('Authentication error.');
        }
    }
    next();
}

app.use(protectAdmin);
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// ============ HELPER FUNCTIONS ============
function sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    return input.replace(/[<>]/g, '').replace(/javascript:/gi, '').trim();
}

function cleanYouTubeUrl(url) {
    if (!url) return null;
    return url.split('?')[0];
}

function extractYouTubeId(url) {
    if (!url) return null;
    const cleanUrl = cleanYouTubeUrl(url);
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/,
        /youtube\.com\/embed\/([^/?]+)/
    ];
    for (const pattern of patterns) {
        const match = cleanUrl.match(pattern);
        if (match) return match[1];
    }
    return null;
}

// ============ API ROUTES ============

app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString(), uptime: process.uptime() });
});

app.get('/api/modules', async (req, res) => {
    try {
        const modules = await supabaseDB.getAllModules();
        res.json(modules);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch modules' });
    }
});

app.get('/api/modules/:moduleId/lessons', async (req, res) => {
    try {
        const lessons = await supabaseDB.getLessonsByModule(req.params.moduleId);
        res.json(lessons);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch lessons' });
    }
});

app.post('/api/admin/modules', async (req, res) => {
    try {
        const { moduleId, title, description, estimatedTime, category } = req.body;
        if (!moduleId || !title) {
            return res.status(400).json({ error: 'Module ID and Title are required' });
        }
        const newModule = await supabaseDB.createModule({
            moduleId: sanitizeInput(moduleId),
            title: sanitizeInput(title),
            description: sanitizeInput(description),
            estimatedTime: sanitizeInput(estimatedTime),
            category: sanitizeInput(category)
        });
        res.status(201).json(newModule);
    } catch (error) {
        res.status(400).json({ error: error.message || 'Failed to create module' });
    }
});

app.post('/api/admin/youtube-lesson', async (req, res) => {
    try {
        const { moduleId, lessonTitle, youtubeUrl, duration, order } = req.body;
        if (!moduleId || !lessonTitle || !youtubeUrl) {
            return res.status(400).json({ error: 'Module ID, Lesson Title, and YouTube URL are required' });
        }
        const videoId = extractYouTubeId(cleanYouTubeUrl(youtubeUrl));
        if (!videoId) {
            return res.status(400).json({ error: 'Invalid YouTube URL' });
        }
        const lesson = await supabaseDB.addLesson(moduleId, {
            title: sanitizeInput(lessonTitle),
            contentType: 'youtube',
            youtubeUrl: `https://youtu.be/${videoId}`,
            youtubeId: videoId,
            fileUrl: `https://www.youtube.com/embed/${videoId}`,
            duration: sanitizeInput(duration) || 'N/A',
            order: order || 1
        });
        res.status(201).json(lesson);
    } catch (error) {
        res.status(400).json({ error: error.message || 'Failed to add lesson' });
    }
});

app.get('/api/skills', async (req, res) => {
    try {
        const modules = await supabaseDB.getAllModules();
        const skills = modules.map(m => ({
            id: m.module_id,
            name: m.title,
            description: m.description,
            estimatedTime: m.estimated_time
        }));
        res.json(skills);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch skills' });
    }
});

app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, subject, message, timestamp } = req.body;
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email address' });
        }
        const supabase = require('../lib/supabase');
        const { error } = await supabase.from('contacts').insert([{
            name, email, subject, message,
            created_at: timestamp || new Date().toISOString(),
            status: 'unread'
        }]);
        if (error) throw error;
        res.json({ success: true, message: 'Message sent successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to send message' });
    }
});

app.get('/api/admin/contacts', async (req, res) => {
    try {
        const supabase = require('../lib/supabase');
        const { data, error } = await supabase.from('contacts').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============ FRONTEND ROUTES ============
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/admin/index.html'));
});

app.get('/admin/messages', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/admin/messages.html'));
});

app.get('/privacy', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/privacy.html'));
});

app.get('/terms', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/terms.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/contact.html'));
});

// ============ ERROR HANDLER ============
app.use((err, req, res, next) => {
    console.error('Server error:', err.message);
    res.status(err.status || 500).json({ 
        error: process.env.NODE_ENV === 'production' 
            ? 'Something went wrong. Please try again later.' 
            : err.message 
    });
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Rejection:', reason);
});

module.exports = app;

// Delete a lesson
app.delete('/api/admin/lessons/:lessonId', async (req, res) => {
    try {
        const { lessonId } = req.params;
        const supabase = require('../lib/supabase');
        
        // First, get the lesson to know which module it belongs to
        const { data: lesson, error: fetchError } = await supabase
            .from('lessons')
            .select('module_id')
            .eq('id', lessonId)
            .single();
        
        if (fetchError) throw fetchError;
        
        // Delete the lesson
        const { error: deleteError } = await supabase
            .from('lessons')
            .delete()
            .eq('id', lessonId);
        
        if (deleteError) throw deleteError;
        
        // Optional: Reorder remaining lessons
        if (lesson && lesson.module_id) {
            const { data: remainingLessons } = await supabase
                .from('lessons')
                .select('id')
                .eq('module_id', lesson.module_id)
                .order('lesson_order', { ascending: true });
            
            // Renumber lessons sequentially
            for (let i = 0; i < remainingLessons.length; i++) {
                await supabase
                    .from('lessons')
                    .update({ lesson_order: i + 1 })
                    .eq('id', remainingLessons[i].id);
            }
        }
        
        res.json({ success: true, message: 'Lesson deleted successfully' });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ error: error.message });
    }
});

// ============ PROGRESS TRACKING API ============

// Get user progress for a module
app.get('/api/progress/:userId/:moduleId', async (req, res) => {
    try {
        const { userId, moduleId } = req.params;
        const supabase = require('../lib/supabase');
        
        // Get all lessons for this module
        const { data: lessons, error: lessonsError } = await supabase
            .from('lessons')
            .select('id')
            .eq('module_id', moduleId);
        
        if (lessonsError) throw lessonsError;
        
        // Get completed lessons for this user
        const { data: completed, error: progressError } = await supabase
            .from('user_progress')
            .select('lesson_id')
            .eq('user_id', userId)
            .eq('module_id', moduleId)
            .eq('completed', true);
        
        if (progressError) throw progressError;
        
        const completedIds = completed?.map(c => c.lesson_id) || [];
        const total = lessons?.length || 0;
        const completedCount = completedIds.length;
        const percentage = total > 0 ? Math.round((completedCount / total) * 100) : 0;
        
        res.json({
            total,
            completed: completedCount,
            percentage,
            completedLessons: completedIds
        });
    } catch (error) {
        console.error('Progress error:', error);
        res.json({ total: 0, completed: 0, percentage: 0, completedLessons: [] });
    }
});

// Mark lesson as complete
app.post('/api/progress/mark-complete', async (req, res) => {
    try {
        const { userId, lessonId, moduleId } = req.body;
        const supabase = require('../lib/supabase');
        
        // Check if already exists
        const { data: existing } = await supabase
            .from('user_progress')
            .select('id')
            .eq('user_id', userId)
            .eq('lesson_id', lessonId)
            .single();
        
        if (existing) {
            // Update existing
            const { error } = await supabase
                .from('user_progress')
                .update({ completed: true, completed_at: new Date().toISOString() })
                .eq('id', existing.id);
            
            if (error) throw error;
        } else {
            // Insert new
            const { error } = await supabase
                .from('user_progress')
                .insert([{
                    user_id: userId,
                    lesson_id: lessonId,
                    module_id: moduleId,
                    completed: true,
                    completed_at: new Date().toISOString()
                }]);
            
            if (error) throw error;
        }
        
        res.json({ success: true });
    } catch (error) {
        console.error('Mark complete error:', error);
        res.status(500).json({ error: error.message });
    }
});

// ============ FEEDBACK API ============

// Submit module feedback
app.post('/api/feedback', async (req, res) => {
    try {
        const { userId, moduleId, rating, confusion, suggestions } = req.body;
        const supabase = require('../lib/supabase');
        
        const { error } = await supabase
            .from('module_feedback')
            .insert([{
                user_id: userId,
                module_id: moduleId,
                rating: rating || null,
                helpful: rating ? (rating >= 4) : null,
                confusion: confusion || null,
                suggestions: suggestions || null,
                created_at: new Date().toISOString()
            }]);
        
        if (error) throw error;
        
        res.json({ success: true });
    } catch (error) {
        console.error('Feedback error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get feedback for a module (admin only)
app.get('/api/admin/feedback/:moduleId', async (req, res) => {
    try {
        const { moduleId } = req.params;
        const supabase = require('../lib/supabase');
        
        const { data, error } = await supabase
            .from('module_feedback')
            .select('*')
            .eq('module_id', moduleId)
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        // Calculate average rating
        const ratings = data.filter(f => f.rating).map(f => f.rating);
        const avgRating = ratings.length > 0 
            ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
            : null;
        
        res.json({
            total: data.length,
            averageRating: avgRating,
            feedback: data
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
