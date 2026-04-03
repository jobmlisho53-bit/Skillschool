const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const supabaseDB = require('../utils/database');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Admin authentication
const auth = require('basic-auth');
const ADMIN_USER = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'changeme123';

function protectAdmin(req, res, next) {
    if (req.path.startsWith('/admin') || req.path.startsWith('/api/admin')) {
        const user = auth(req);
        if (!user || user.name !== ADMIN_USER || user.pass !== ADMIN_PASS) {
            res.statusCode = 401;
            res.setHeader('WWW-Authenticate', 'Basic realm="Admin Access"');
            res.send('Access denied');
            return;
        }
    }
    next();
}

app.use(protectAdmin);

// Serve static files
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

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
        
        function extractYouTubeId(url) {
            const patterns = [
                /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/,
                /youtube\.com\/embed\/([^/?]+)/
            ];
            for (const pattern of patterns) {
                const match = url.match(pattern);
                if (match) return match[1];
            }
            return null;
        }
        
        const videoId = extractYouTubeId(youtubeUrl);
        if (!videoId) {
            return res.status(400).json({ error: 'Invalid YouTube URL' });
        }
        
        const lesson = await supabaseDB.addLesson(moduleId, {
            title: lessonTitle,
            contentType: 'youtube',
            youtubeUrl: youtubeUrl,
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

// Export for Vercel
module.exports = app;
