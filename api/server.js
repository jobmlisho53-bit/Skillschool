const express = require('express');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');
const crypto = require('crypto');
require('dotenv').config();

const app = express();

// Import Supabase clients
const supabase = require('../lib/supabase');
const supabaseAdmin = require('../lib/supabase-admin');

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

// ============ PUBLIC API ROUTES ============
app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString(), uptime: process.uptime() });
});

app.get('/api/modules', async (req, res) => {
    try {
        const { data, error } = await supabase.from('modules').select('*').order('created_at', { ascending: true });
        if (error) throw error;
        res.json(data.map(m => ({ moduleId: m.module_id, module_id: m.module_id, title: m.title, description: m.description, estimatedTime: m.estimated_time, category: m.category })));
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch modules' });
    }
});

app.get('/api/modules/:moduleId/lessons', async (req, res) => {
    try {
        const { data, error } = await supabase.from('lessons').select('*').eq('module_id', req.params.moduleId).order('lesson_order', { ascending: true });
        if (error) throw error;
        res.json(data.map(l => ({ id: l.id, title: l.title, contentType: l.content_type, youtubeId: l.youtube_id, duration: l.duration, order: l.lesson_order })));
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch lessons' });
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
    } catch (error) {
        res.json({ total: 0, completed: 0, percentage: 0, completedLessons: [] });
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
app.get('/dmca', (req, res) => { res.sendFile(path.join(__dirname, '../public/dmca.html')); });
app.get('/faq', (req, res) => { res.sendFile(path.join(__dirname, '../public/faq.html')); });

// ============ GLOBAL ERROR HANDLER ============
app.use((err, req, res, next) => {
    console.error('Server error:', err.message);
    res.status(500).json({ error: 'Something went wrong. Please try again later.' });
});

module.exports = app;

// ============ SHOP API ============

    try {
        const { data, error } = await supabase
            .select('*')
            .eq('is_active', true)
            .order('sort_order', { ascending: true });
        
        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

    try {
        const { data, error } = await supabase
            .select('*')
            .eq('id', req.params.id)
            .single();
        
        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

    try {
        const { name, description, price, image_url, affiliate_link, category, course_id, sort_order } = req.body;
        
        const { data, error } = await supabaseAdmin
            .insert([{
                name, description, price, image_url, affiliate_link,
                category, course_id, sort_order: sort_order || 0
            }])
            .select()
            .single();
        
        if (error) throw error;
        res.status(201).json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

    try {
        const { id } = req.params;
        const updates = req.body;
        
        const { data, error } = await supabaseAdmin
            .update(updates)
            .eq('id', id)
            .select()
            .single();
        
        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

    try {
        const { error } = await supabaseAdmin
            .delete()
            .eq('id', req.params.id);
        
        if (error) throw error;
        res.json({ success: true });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
