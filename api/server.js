const express = require('express');
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
const cors = require('cors');
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
const path = require('path');
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
const rateLimit = require('express-rate-limit');
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
const supabaseDB = require('../utils/database');
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
require('dotenv').config();
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});

pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
const app = express();
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});

pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
// ============ SECURITY MIDDLEWARE ============
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});

pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
const allowedOrigins = [
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    'https://skillschool-dbc1.vercel.app',
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    'http://localhost:5000',
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    process.env.FRONTEND_URL
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
].filter(Boolean);
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});

pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
app.use(cors({
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    origin: function(origin, callback) {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        if (!origin) return callback(null, true);
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        if (allowedOrigins.indexOf(origin) === -1) {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            return callback(new Error('CORS policy blocked this request'), false);
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        }
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        return callback(null, true);
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    },
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    credentials: true
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
}));
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});

pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
const apiLimiter = rateLimit({
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    windowMs: 15 * 60 * 1000,
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    max: 100,
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    message: { error: 'Too many requests, please try again later.' }
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
});
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});

pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
const adminLimiter = rateLimit({
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    windowMs: 15 * 60 * 1000,
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    max: 20,
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    message: { error: 'Rate limit exceeded for admin operations.' }
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
});
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});

pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
app.use('/api/', apiLimiter);
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
app.use('/api/admin/', adminLimiter);
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
app.use(express.json({ limit: '10mb' }));
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});

pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
// ============ ADMIN AUTHENTICATION ============
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
const ADMIN_USER = process.env.ADMIN_USERNAME || 'admin';
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'changeme123';
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});

pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
function protectAdmin(req, res, next) {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    const isAdminRoute = req.path.startsWith('/admin') || req.path.startsWith('/api/admin');
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    if (isAdminRoute) {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        const authHeader = req.headers.authorization;
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        if (!authHeader || !authHeader.startsWith('Basic ')) {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            res.statusCode = 401;
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            res.setHeader('WWW-Authenticate', 'Basic realm="Income School Admin"');
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            return res.end('Access denied. Admin area requires authentication.');
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        }
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        try {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            const base64Credentials = authHeader.split(' ')[1];
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            const [username, password] = credentials.split(':');
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            if (username !== ADMIN_USER || password !== ADMIN_PASS) {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
                res.statusCode = 401;
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
                return res.end('Invalid credentials. Access denied.');
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            }
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        } catch (err) {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            res.statusCode = 401;
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            return res.end('Authentication error.');
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        }
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    }
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    next();
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
}
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});

pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
app.use(protectAdmin);
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
app.use(express.static('public'));
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
app.use('/uploads', express.static('uploads'));
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});

pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
// ============ HELPER FUNCTIONS ============
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
function sanitizeInput(input) {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    if (typeof input !== 'string') return input;
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    return input.replace(/[<>]/g, '').replace(/javascript:/gi, '').trim();
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
}
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});

pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
function cleanYouTubeUrl(url) {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    if (!url) return null;
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    return url.split('?')[0];
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
}
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});

pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
function extractYouTubeId(url) {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    if (!url) return null;
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    const cleanUrl = cleanYouTubeUrl(url);
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    const patterns = [
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/,
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        /youtube\.com\/embed\/([^/?]+)/
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    ];
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    for (const pattern of patterns) {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        const match = cleanUrl.match(pattern);
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        if (match) return match[1];
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    }
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    return null;
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
}
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});

pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
// ============ PUBLIC API ROUTES ============
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});

pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
app.get('/api/health', (req, res) => {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    res.json({ status: 'healthy', timestamp: new Date().toISOString(), uptime: process.uptime() });
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
});
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});

pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
app.get('/api/modules', async (req, res) => {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    try {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        const modules = await supabaseDB.getAllModules();
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        res.json(modules);
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    } catch (error) {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        console.error('Error fetching modules:', error);
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        res.status(500).json({ error: 'Failed to fetch modules' });
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    }
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
});
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});

pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
app.get('/api/modules/:moduleId/lessons', async (req, res) => {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    try {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        const lessons = await supabaseDB.getLessonsByModule(req.params.moduleId);
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        res.json(lessons);
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    } catch (error) {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        console.error('Error fetching lessons:', error);
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        res.status(500).json({ error: 'Failed to fetch lessons' });
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    }
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
});
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});

pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
app.get('/api/progress/:userId/:moduleId', async (req, res) => {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    try {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        const { userId, moduleId } = req.params;
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        const progress = await supabaseDB.getUserProgress(userId, moduleId);
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        res.json(progress);
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    } catch (error) {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        console.error('Progress error:', error);
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        res.json({ total: 0, completed: 0, percentage: 0, completedLessons: [] });
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    }
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
});
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});

pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
app.post('/api/progress/mark-complete', async (req, res) => {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    try {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        const { userId, lessonId, moduleId } = req.body;
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        await supabaseDB.saveProgress(userId, lessonId, moduleId);
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        res.json({ success: true });
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    } catch (error) {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        console.error('Mark complete error:', error);
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        res.status(500).json({ error: error.message });
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    }
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
});
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});

pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
app.post('/api/feedback', async (req, res) => {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    try {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        const { userId, moduleId, rating, confusion, suggestions } = req.body;
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        await supabaseDB.saveFeedback(userId, moduleId, rating, confusion, suggestions);
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        res.json({ success: true });
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    } catch (error) {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        console.error('Feedback error:', error);
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        res.status(500).json({ error: error.message });
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    }
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
});
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});

pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
app.post('/api/contact', async (req, res) => {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    try {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        const { name, email, subject, message } = req.body;
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        if (!name || !email || !subject || !message) {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            return res.status(400).json({ error: 'All fields are required' });
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        }
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        if (!emailRegex.test(email)) {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            return res.status(400).json({ error: 'Invalid email address' });
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        }
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        await supabaseDB.saveContact(name, email, subject, message);
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        res.json({ success: true, message: 'Message sent successfully' });
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    } catch (error) {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        console.error('Contact error:', error);
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        res.status(500).json({ error: 'Failed to send message' });
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    }
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
});
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});

pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
app.post('/api/subscribe', async (req, res) => {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    try {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        const { email } = req.body;
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        if (!email || !email.includes('@')) {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            return res.status(400).json({ error: 'Valid email is required' });
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        }
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        const supabase = require('../lib/supabase-admin');
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        const { data: existing } = await supabase
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            .from('subscribers')
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            .select('email')
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            .eq('email', email)
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            .single();
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        if (existing) {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            return res.json({ success: true, message: 'Already subscribed!' });
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        }
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        const { error } = await supabase
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            .from('subscribers')
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            .insert([{
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
                email: email,
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
                subscribed_at: new Date().toISOString(),
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
                source: 'landing_page'
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            }]);
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        if (error) throw error;
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        res.json({ success: true, message: 'Subscribed successfully!' });
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    } catch (error) {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        console.error('Subscribe error:', error);
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        res.status(500).json({ error: 'Failed to subscribe' });
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    }
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
});
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});

pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
// ============ ADMIN API ROUTES (Protected) ============
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});

pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
app.post('/api/admin/modules', async (req, res) => {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    try {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        const { moduleId, title, description, estimatedTime, category } = req.body;
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        if (!moduleId || !title) {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            return res.status(400).json({ error: 'Module ID and Title are required' });
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        }
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        const newModule = await supabaseDB.createModule({
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            moduleId: sanitizeInput(moduleId),
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            title: sanitizeInput(title),
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            description: sanitizeInput(description),
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            estimatedTime: sanitizeInput(estimatedTime),
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            category: sanitizeInput(category)
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        });
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        res.status(201).json(newModule);
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    } catch (error) {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        console.error('Error creating module:', error);
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        res.status(400).json({ error: error.message || 'Failed to create module' });
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    }
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
});
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});

pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
app.post('/api/admin/youtube-lesson', async (req, res) => {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    try {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        const { moduleId, lessonTitle, youtubeUrl, duration, order } = req.body;
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        if (!moduleId || !lessonTitle || !youtubeUrl) {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            return res.status(400).json({ error: 'Module ID, Lesson Title, and YouTube URL are required' });
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        }
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        const videoId = extractYouTubeId(cleanYouTubeUrl(youtubeUrl));
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        if (!videoId) {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            return res.status(400).json({ error: 'Invalid YouTube URL' });
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        }
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        const lesson = await supabaseDB.addLesson(moduleId, {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            title: sanitizeInput(lessonTitle),
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            contentType: 'youtube',
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            youtubeUrl: `https://youtu.be/${videoId}`,
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            youtubeId: videoId,
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            fileUrl: `https://www.youtube.com/embed/${videoId}`,
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            duration: sanitizeInput(duration) || 'N/A',
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            order: order || 1
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        });
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        res.status(201).json(lesson);
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    } catch (error) {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        console.error('Error adding YouTube lesson:', error);
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        res.status(400).json({ error: error.message || 'Failed to add lesson' });
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    }
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
});
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});

pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
app.delete('/api/admin/lessons/:lessonId', async (req, res) => {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    try {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        const { lessonId } = req.params;
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        await supabaseDB.deleteLesson(lessonId);
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        res.json({ success: true, message: 'Lesson deleted successfully' });
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    } catch (error) {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        console.error('Delete error:', error);
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        res.status(500).json({ error: error.message });
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    }
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
});
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});

pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
app.get('/api/admin/contacts', async (req, res) => {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    try {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        const contacts = await supabaseDB.getContacts();
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        res.json(contacts);
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    } catch (error) {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        console.error('Error fetching contacts:', error);
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        res.status(500).json({ error: error.message });
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    }
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
});
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});

pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
app.get('/api/admin/feedback/:moduleId', async (req, res) => {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    try {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        const { moduleId } = req.params;
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        const feedback = await supabaseDB.getFeedback(moduleId);
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        res.json(feedback);
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    } catch (error) {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        console.error('Error fetching feedback:', error);
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        res.status(500).json({ error: error.message });
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    }
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
});
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});

pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
app.get('/api/skills', async (req, res) => {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    try {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        const modules = await supabaseDB.getAllModules();
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        const skills = modules.map(m => ({
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            id: m.module_id,
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            name: m.title,
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            description: m.description,
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            estimatedTime: m.estimated_time
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        }));
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        res.json(skills);
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    } catch (error) {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        console.error('Error fetching skills:', error);
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        res.status(500).json({ error: 'Failed to fetch skills' });
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    }
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
});
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});

pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
// ============ FRONTEND ROUTES ============
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});

pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
// MAIN ROUTE - Landing page (now index.html)
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
app.get('/', (req, res) => {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    res.sendFile(path.join(__dirname, '../public/index.html'));
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
});
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});

pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
// Original course dashboard (now at /courses)
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
app.get('/courses', (req, res) => {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    res.sendFile(path.join(__dirname, '../public/courses.html'));
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
});
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});

pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
app.get('/admin', (req, res) => {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    res.sendFile(path.join(__dirname, '../public/admin/index.html'));
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
});
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});

pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
app.get('/admin/messages', (req, res) => {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    res.sendFile(path.join(__dirname, '../public/admin/messages.html'));
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
});
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});

pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
app.get('/privacy', (req, res) => {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    res.sendFile(path.join(__dirname, '../public/privacy.html'));
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
});
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});

pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
app.get('/terms', (req, res) => {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    res.sendFile(path.join(__dirname, '../public/terms.html'));
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
});
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});

pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
app.get('/contact', (req, res) => {

pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    res.sendFile(path.join(__dirname, '../public/contact.html'));
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
});
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});

pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
app.get('/landing', (req, res) => {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    res.sendFile(path.join(__dirname, '../public/index.html'));
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
});
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});

pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
// ============ GLOBAL ERROR HANDLER ============
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
app.use((err, req, res, next) => {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    console.error('Server error:', {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        message: err.message,
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        path: req.path,
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        method: req.method,
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        ip: req.ip
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    });
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    res.status(err.status || 500).json({ 
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        error: process.env.NODE_ENV === 'production' 
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            ? 'Something went wrong. Please try again later.' 
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            : err.message 
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    });
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
});
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});

pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
process.on('uncaughtException', (error) => {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    console.error('Uncaught Exception:', error);
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    process.exit(1);
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
});
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});

pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
process.on('unhandledRejection', (reason) => {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    console.error('Unhandled Rejection:', reason);
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
});
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});

pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
module.exports = app;
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});

pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
// ============ SOLUTION 2: Completion Path Validation ============
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});

pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
// Add this function to check lesson order
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
async function validateLessonOrder(userId, moduleId, lessonId, lessonOrder) {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    // First lesson (order 1) has no prerequisite
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    if (lessonOrder === 1) {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        return { valid: true };
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    }
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    // Get the previous lesson ID (order - 1)
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    const { data: previousLesson, error: prevLessonError } = await supabase
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        .from('lessons')
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        .select('id')
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        .eq('module_id', moduleId)
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        .eq('lesson_order', lessonOrder - 1)
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        .single();
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    if (prevLessonError || !previousLesson) {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        return { valid: false, error: 'Previous lesson not found' };
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    }
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    // Check if previous lesson is completed
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    const { data: progress, error: progressError } = await supabase
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        .from('user_progress')
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        .select('completed, completed_at')
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        .eq('user_id', userId)
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        .eq('lesson_id', previousLesson.id)
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        .eq('completed', true)
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        .single();
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    if (progressError || !progress) {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        return { 
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            valid: false, 
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            error: `Please complete Lesson ${lessonOrder - 1} first before moving to Lesson ${lessonOrder}.` 
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        };
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    }
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    // Also check minimum time between completions (anti-cheat)
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    if (progress.completed_at) {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        const completedTime = new Date(progress.completed_at).getTime();
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        const currentTime = Date.now();
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        const timeDiffMinutes = (currentTime - completedTime) / 1000 / 60;
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        // Require at least 1 minute between lesson completions
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        if (timeDiffMinutes < 1 && lessonOrder > 1) {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            return { 
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
                valid: false, 
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
                error: 'Please wait a moment before continuing to the next lesson.' 
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            };
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        }
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    }
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    return { valid: true };
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
}
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});

pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
// Replace the mark-complete endpoint with this enhanced version
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
app.post('/api/progress/mark-complete', async (req, res) => {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    try {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        const { userId, lessonId, moduleId, timeSpent, watchPercentage } = req.body;
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        if (!userId || !lessonId || !moduleId) {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            return res.status(400).json({ error: 'Missing required fields' });
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        }
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        // Get lesson details
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        const { data: lesson, error: lessonError } = await supabase
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            .from('lessons')
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            .select('duration, content_type, lesson_order')
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            .eq('id', lessonId)
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            .single();
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        if (lessonError) throw lessonError;
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        // SOLUTION 1: Watch time validation (for YouTube videos)
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        if (lesson.content_type === 'youtube') {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            if (!timeSpent || !watchPercentage) {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
                return res.status(400).json({ error: 'Watch time data required' });
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            }
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            let requiredSeconds = 300;
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            if (lesson.duration) {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
                const match = lesson.duration.match(/(\d+)/);
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
                if (match) {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
                    requiredSeconds = parseInt(match[1]) * 60;
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
                }
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            }
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            const minRequiredSeconds = requiredSeconds * 0.85;
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            if (timeSpent < minRequiredSeconds && watchPercentage < 90) {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
                return res.status(400).json({ 
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
                    error: `Please watch at least 90% of the video. You watched ${Math.floor(watchPercentage)}%.` 
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
                });
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            }
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        }
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        // SOLUTION 2: Path validation (check previous lesson completed)
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        const orderValidation = await validateLessonOrder(userId, moduleId, lessonId, lesson.lesson_order);
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        if (!orderValidation.valid) {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            return res.status(400).json({ error: orderValidation.error });
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        }
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        // Check if already completed
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        const { data: existing } = await supabase
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            .from('user_progress')
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            .select('id')
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            .eq('user_id', userId)
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            .eq('lesson_id', lessonId)
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            .single();
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        if (existing) {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            const { error } = await supabase
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
                .from('user_progress')
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
                .update({ 
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
                    completed: true, 
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
                    completed_at: new Date().toISOString(),
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
                    time_spent_seconds: timeSpent || 0,
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
                    watch_percentage: watchPercentage || 100
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
                })
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
                .eq('id', existing.id);
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            if (error) throw error;
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        } else {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            const { error } = await supabase
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
                .from('user_progress')
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
                .insert([{
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
                    user_id: userId,
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
                    lesson_id: lessonId,
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
                    module_id: moduleId,
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
                    completed: true,
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
                    completed_at: new Date().toISOString(),
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
                    time_spent_seconds: timeSpent || 0,
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
                    watch_percentage: watchPercentage || 100
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
                }]);
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            if (error) throw error;
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        }
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        res.json({ success: true });
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    } catch (error) {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        console.error('Mark complete error:', error);
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        res.status(500).json({ error: error.message });
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    }
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
});
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});

pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
// ============ SOLUTION 3: Rate Limiting & Anomaly Detection ============
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});

pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
// Track completion attempts per user/IP
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
const completionAttempts = new Map(); // userId -> { count, firstAttempt, timestamps[] }
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});

pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
// Clean up old entries every hour
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
setInterval(() => {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    for (const [key, data] of completionAttempts.entries()) {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        if (data.firstAttempt < oneHourAgo) {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            completionAttempts.delete(key);
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        }
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    }
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
}, 60 * 60 * 1000);
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});

pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
// Anomaly detection function
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
async function detectAnomaly(userId, ipAddress, moduleId) {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    const now = Date.now();
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    const oneHourAgo = now - 60 * 60 * 1000;
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    const fiveMinutesAgo = now - 5 * 60 * 1000;
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    // Get user's completion history from database (last hour)
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    const { data: recentCompletions, error } = await supabase
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        .from('user_progress')
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        .select('created_at, lesson_id')
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        .eq('user_id', userId)
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        .gte('created_at', new Date(oneHourAgo).toISOString())
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        .order('created_at', { ascending: false });
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    if (error) throw error;
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    // Check 1: Too many completions in an hour (max 15)
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    if (recentCompletions && recentCompletions.length >= 15) {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        return { 
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            isAnomaly: true, 
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            reason: 'Too many lessons completed in a short period. Please slow down.' 
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        };
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    }
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    // Check 2: Completions happening too fast (less than 60 seconds apart)
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    if (recentCompletions && recentCompletions.length >= 2) {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        const lastCompletion = new Date(recentCompletions[0].created_at).getTime();
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        const secondLastCompletion = new Date(recentCompletions[1].created_at).getTime();
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        const timeDiffSeconds = (lastCompletion - secondLastCompletion) / 1000;
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        if (timeDiffSeconds < 60 && timeDiffSeconds > 0) {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            return { 
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
                isAnomaly: true, 
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
                reason: 'Lessons are being completed too quickly. Please take your time with each lesson.' 
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            };
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        }
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    }
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    // Check 3: Track in-memory attempts (for very rapid requests)
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    const key = `${userId}:${ipAddress}`;
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    const attempts = completionAttempts.get(key);
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    if (attempts) {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        // More than 10 completion attempts in 5 minutes
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        const recentAttempts = attempts.timestamps.filter(t => t > fiveMinutesAgo);
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        if (recentAttempts.length > 10) {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            return { 
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
                isAnomaly: true, 
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
                reason: 'Suspicious activity detected. Please contact support if this is an error.' 
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            };
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        }
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        // Update attempts
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        attempts.timestamps.push(now);
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        attempts.count++;
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        completionAttempts.set(key, attempts);
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    } else {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        completionAttempts.set(key, {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            count: 1,
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            firstAttempt: now,
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            timestamps: [now]
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        });
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    }
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    return { isAnomaly: false };
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
}
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});

pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
// Enhanced mark-complete endpoint with rate limiting
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
// (Replace the existing mark-complete endpoint)
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
app.post('/api/progress/mark-complete', async (req, res) => {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    try {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        const { userId, lessonId, moduleId, timeSpent, watchPercentage } = req.body;
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        if (!userId || !lessonId || !moduleId) {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            return res.status(400).json({ error: 'Missing required fields' });
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        }
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        // Get client IP address
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        // SOLUTION 3: Anomaly detection
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        const anomaly = await detectAnomaly(userId, ipAddress, moduleId);
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        if (anomaly.isAnomaly) {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            console.warn(`Anomaly detected for user ${userId}: ${anomaly.reason}`);
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            return res.status(429).json({ error: anomaly.reason });
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        }
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        // Get lesson details
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        const { data: lesson, error: lessonError } = await supabase
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            .from('lessons')
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            .select('duration, content_type, lesson_order')
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            .eq('id', lessonId)
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            .single();
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        if (lessonError) throw lessonError;
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        // SOLUTION 1: Watch time validation (for YouTube videos)
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        if (lesson.content_type === 'youtube') {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            if (!timeSpent || !watchPercentage) {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
                return res.status(400).json({ error: 'Watch time data required' });
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            }
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            let requiredSeconds = 300;
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            if (lesson.duration) {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
                const match = lesson.duration.match(/(\d+)/);
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
                if (match) {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
                    requiredSeconds = parseInt(match[1]) * 60;
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
                }
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            }
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            const minRequiredSeconds = requiredSeconds * 0.85;
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            if (timeSpent < minRequiredSeconds && watchPercentage < 90) {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
                return res.status(400).json({ 
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
                    error: `Please watch at least 90% of the video. You watched ${Math.floor(watchPercentage)}%.` 
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
                });
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            }
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        }
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        // SOLUTION 2: Path validation (check previous lesson completed)
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        const orderValidation = await validateLessonOrder(userId, moduleId, lessonId, lesson.lesson_order);
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        if (!orderValidation.valid) {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            return res.status(400).json({ error: orderValidation.error });
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        }
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        // Check if already completed
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        const { data: existing } = await supabase
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            .from('user_progress')
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            .select('id')
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            .eq('user_id', userId)
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            .eq('lesson_id', lessonId)
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            .single();
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        if (existing) {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            const { error } = await supabase
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
                .from('user_progress')
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
                .update({ 
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
                    completed: true, 
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
                    completed_at: new Date().toISOString(),
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
                    time_spent_seconds: timeSpent || 0,
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
                    watch_percentage: watchPercentage || 100,
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
                    ip_address: ipAddress
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
                })
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
                .eq('id', existing.id);
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            if (error) throw error;
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        } else {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            const { error } = await supabase
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
                .from('user_progress')
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
                .insert([{
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
                    user_id: userId,
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
                    lesson_id: lessonId,
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
                    module_id: moduleId,
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
                    completed: true,
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
                    completed_at: new Date().toISOString(),
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
                    time_spent_seconds: timeSpent || 0,
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
                    watch_percentage: watchPercentage || 100,
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
                    ip_address: ipAddress
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
                }]);
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            if (error) throw error;
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        }
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        res.json({ success: true });
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    } catch (error) {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        console.error('Mark complete error:', error);
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        res.status(500).json({ error: error.message });
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    }
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
});
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});

pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
// ============ SOLUTION 5: Tamper-Proof Certificates ============
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});

pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
const crypto = require('crypto');
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});

pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
// Secret key for certificate signing (store in environment variables)
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
const CERT_SECRET = process.env.CERT_SECRET || 'your-super-secret-certificate-key-change-this';
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});

pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
// Generate a unique certificate ID with signature
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
function generateCertificateId(userId, moduleId, completedAt) {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    const data = `${userId}:${moduleId}:${completedAt}`;
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    const signature = crypto
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        .createHmac('sha256', CERT_SECRET)
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        .update(data)
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        .digest('hex')
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        .substring(0, 16);
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    // Format: CERT-YYYYMMDD-XXXX-XXXX
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    const date = new Date(completedAt).toISOString().slice(0, 10).replace(/-/g, '');
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    const shortUserId = userId.substring(userId.length - 6);
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    return `CERT-${date}-${shortUserId}-${signature}`;
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
}
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});

pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
// Verify certificate authenticity
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
function verifyCertificateId(certificateId, userId, moduleId, completedAt) {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    const expectedSignature = generateCertificateId(userId, moduleId, completedAt);
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    return certificateId === expectedSignature;
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
}
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});

pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
// Check if user completed all lessons in a module
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
async function checkModuleCompletion(userId, moduleId) {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    // Get all lessons in module
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    const { data: lessons, error: lessonsError } = await supabase
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        .from('lessons')
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        .select('id')
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        .eq('module_id', moduleId);
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    if (lessonsError) throw lessonsError;
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    if (lessons.length === 0) return false;
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    // Get user's completed lessons
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    const { data: completed, error: progressError } = await supabase
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        .from('user_progress')
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        .select('lesson_id')
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        .eq('user_id', userId)
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        .eq('module_id', moduleId)
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        .eq('completed', true);
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    if (progressError) throw progressError;
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    const completedIds = new Set(completed.map(c => c.lesson_id));
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    const allCompleted = lessons.every(lesson => completedIds.has(lesson.id));
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    return allCompleted;
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
}
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});

pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
// Generate certificate endpoint
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
app.post('/api/certificate/generate', async (req, res) => {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    try {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        const { userId, moduleId, name } = req.body;
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        if (!userId || !moduleId) {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            return res.status(400).json({ error: 'Missing required fields' });
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        }
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        // Check if user completed all lessons
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        const isComplete = await checkModuleCompletion(userId, moduleId);
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        if (!isComplete) {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            return res.status(400).json({ error: 'Complete all lessons in this module first' });
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        }
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        // Check if certificate already issued
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        const { data: existingCert } = await supabase
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            .from('certificates')
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            .select('id, certificate_id')
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            .eq('user_id', userId)
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            .eq('module_id', moduleId)
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            .single();
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        if (existingCert) {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            return res.json({ 
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
                success: true, 
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
                certificateId: existingCert.certificate_id,
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
                message: 'Certificate already issued' 
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            });
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        }
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        // Get module details
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        const { data: module, error: moduleError } = await supabase
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            .from('modules')
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            .select('title, module_id')
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            .eq('module_id', moduleId)
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            .single();
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        if (moduleError) throw moduleError;
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        // Get completion date (last lesson completion)
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        const { data: lastCompletion } = await supabase
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            .from('user_progress')
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            .select('completed_at')
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            .eq('user_id', userId)
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            .eq('module_id', moduleId)
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            .eq('completed', true)
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            .order('completed_at', { ascending: false })
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            .limit(1)
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            .single();
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        const completedAt = lastCompletion?.completed_at || new Date().toISOString();
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        const certificateId = generateCertificateId(userId, moduleId, completedAt);
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        // Store certificate in database
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        const { data: certificate, error: insertError } = await supabase
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            .from('certificates')
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            .insert([{
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
                user_id: userId,
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
                module_id: moduleId,
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
                module_title: module.title,
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
                certificate_id: certificateId,
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
                issued_at: new Date().toISOString(),
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
                completed_at: completedAt,
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
                user_name: name || 'Anonymous Learner',
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
                verification_count: 0
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            }])
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            .select()
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            .single();
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        if (insertError) throw insertError;
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        res.json({ 
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            success: true, 
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            certificateId: certificateId,
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            issuedAt: certificate.issued_at,
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            moduleTitle: module.title
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        });
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    } catch (error) {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        console.error('Certificate generation error:', error);
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        res.status(500).json({ error: error.message });
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    }
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
});
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});

pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
// Verify certificate endpoint (public - no auth required)
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
app.get('/api/certificate/verify/:certificateId', async (req, res) => {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    try {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        const { certificateId } = req.params;
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        const { data: certificate, error } = await supabase
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            .from('certificates')
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            .select('*')
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            .eq('certificate_id', certificateId)
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            .single();
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        if (error || !certificate) {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            return res.json({ 
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
                valid: false, 
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
                message: 'Certificate not found or invalid' 
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            });
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        }
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        // Increment verification count
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        await supabase
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            .from('certificates')
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            .update({ verification_count: certificate.verification_count + 1 })
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            .eq('id', certificate.id);
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        res.json({
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            valid: true,
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            certificateId: certificate.certificate_id,
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            userName: certificate.user_name,
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            courseName: certificate.module_title,
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            issuedAt: certificate.issued_at,
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            completedAt: certificate.completed_at,
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            verifications: certificate.verification_count + 1
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        });
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    } catch (error) {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        console.error('Certificate verification error:', error);
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        res.json({ valid: false, message: 'Verification failed' });
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    }
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
});
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});

pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
// Get user's certificates
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
app.get('/api/certificates/:userId', async (req, res) => {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    try {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        const { userId } = req.params;
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        const { data: certificates, error } = await supabase
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            .from('certificates')
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            .select('*')
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            .eq('user_id', userId)
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
            .order('issued_at', { ascending: false });
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        if (error) throw error;
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        res.json(certificates);
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    } catch (error) {
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        console.error('Error fetching certificates:', error);
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
        res.status(500).json({ error: error.message });
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
    }
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
});
pp.get('/verify', (req, res) => {    res.sendFile(path.join(__dirname, '../public/verify.html'));});
