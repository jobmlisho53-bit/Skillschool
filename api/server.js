const express = require('express');
const cors = require('cors');
const path = require('path');
const supabaseDB = require('../utils/database');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Admin credentials from environment variables
const ADMIN_USER = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'changeme123';

// FIXED: Vercel-compatible authentication middleware
function protectAdmin(req, res, next) {
    // Check if this is an admin route
    const isAdminRoute = req.path.startsWith('/admin') || req.path.startsWith('/api/admin');
    
    if (isAdminRoute) {
        const authHeader = req.headers.authorization;
        
        // No auth header provided
        if (!authHeader || !authHeader.startsWith('Basic ')) {
            res.statusCode = 401;
            res.setHeader('WWW-Authenticate', 'Basic realm="Income School Admin"');
            res.setHeader('Content-Type', 'text/html');
            return res.send(`
                <!DOCTYPE html>
                <html>
                <head><title>Admin Login</title></head>
                <body style="font-family: Arial; text-align: center; padding: 50px;">
                    <h1>🔐 Admin Access Required</h1>
                    <p>This area is protected. Please enter your credentials.</p>
                </body>
                </html>
            `);
        }
        
        // Decode credentials
        try {
            const base64Credentials = authHeader.split(' ')[1];
            const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
            const [username, password] = credentials.split(':');
            
            if (username !== ADMIN_USER || password !== ADMIN_PASS) {
                // Wrong credentials
                res.statusCode = 401;
                res.setHeader('WWW-Authenticate', 'Basic realm="Income School Admin"');
                return res.send('Invalid credentials. Access denied.');
            }
        } catch (err) {
            res.statusCode = 401;
            return res.send('Authentication error.');
        }
    }
    next();
}

// Apply admin protection
app.use(protectAdmin);

// Serve static files
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Helper function for YouTube URL
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

// API Routes
app.get('/api/modules', async (req, res) => {
    try {
        const modules = await supabaseDB.getAllModules();
        res.json(modules);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/modules/:moduleId/lessons', async (req, res) => {
    try {
        const lessons = await supabaseDB.getLessonsByModule(req.params.moduleId);
        res.json(lessons);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/admin/modules', async (req, res) => {
    try {
        const { moduleId, title, description, estimatedTime, category } = req.body;
        const newModule = await supabaseDB.createModule({
            moduleId, title, description, estimatedTime, category
        });
        res.status(201).json(newModule);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/api/admin/youtube-lesson', async (req, res) => {
    try {
        const { moduleId, lessonTitle, youtubeUrl, duration, order } = req.body;
        
        const cleanUrl = cleanYouTubeUrl(youtubeUrl);
        const videoId = extractYouTubeId(cleanUrl);
        
        if (!videoId) {
            return res.status(400).json({ error: 'Invalid YouTube URL' });
        }
        
        const lesson = await supabaseDB.addLesson(moduleId, {
            title: lessonTitle,
            contentType: 'youtube',
            youtubeUrl: `https://youtu.be/${videoId}`,
            youtubeId: videoId,
            fileUrl: `https://www.youtube.com/embed/${videoId}`,
            duration: duration,
            order: order
        });
        
        res.status(201).json(lesson);
    } catch (error) {
        res.status(400).json({ error: error.message });
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
        res.status(500).json({ error: error.message });
    }
});

// Serve HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/admin/index.html'));
});

module.exports = app;
