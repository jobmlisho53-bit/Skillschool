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

// ============ PUBLIC API ROUTES ============

app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString(), uptime: process.uptime() });
});

app.get('/api/modules', async (req, res) => {
    try {
        const modules = await supabaseDB.getAllModules();
        res.json(modules);
    } catch (error) {
        console.error('Error fetching modules:', error);
        res.status(500).json({ error: 'Failed to fetch modules' });
    }
});

app.get('/api/modules/:moduleId/lessons', async (req, res) => {
    try {
        const lessons = await supabaseDB.getLessonsByModule(req.params.moduleId);
        res.json(lessons);
    } catch (error) {
        console.error('Error fetching lessons:', error);
        res.status(500).json({ error: 'Failed to fetch lessons' });
    }
});

app.get('/api/progress/:userId/:moduleId', async (req, res) => {
    try {
        const { userId, moduleId } = req.params;
        const progress = await supabaseDB.getUserProgress(userId, moduleId);
        res.json(progress);
    } catch (error) {
        console.error('Progress error:', error);
        res.json({ total: 0, completed: 0, percentage: 0, completedLessons: [] });
    }
});

app.post('/api/progress/mark-complete', async (req, res) => {
    try {
        const { userId, lessonId, moduleId } = req.body;
        await supabaseDB.saveProgress(userId, lessonId, moduleId);
        res.json({ success: true });
    } catch (error) {
        console.error('Mark complete error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/feedback', async (req, res) => {
    try {
        const { userId, moduleId, rating, confusion, suggestions } = req.body;
        await supabaseDB.saveFeedback(userId, moduleId, rating, confusion, suggestions);
        res.json({ success: true });
    } catch (error) {
        console.error('Feedback error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email address' });
        }
        
        await supabaseDB.saveContact(name, email, subject, message);
        res.json({ success: true, message: 'Message sent successfully' });
    } catch (error) {
        console.error('Contact error:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
});

app.post('/api/subscribe', async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email || !email.includes('@')) {
            return res.status(400).json({ error: 'Valid email is required' });
        }
        
        const supabase = require('../lib/supabase-admin');
        
        const { data: existing } = await supabase
            .from('subscribers')
            .select('email')
            .eq('email', email)
            .single();
        
        if (existing) {
            return res.json({ success: true, message: 'Already subscribed!' });
        }
        
        const { error } = await supabase
            .from('subscribers')
            .insert([{
                email: email,
                subscribed_at: new Date().toISOString(),
                source: 'landing_page'
            }]);
        
        if (error) throw error;
        
        res.json({ success: true, message: 'Subscribed successfully!' });
    } catch (error) {
        console.error('Subscribe error:', error);
        res.status(500).json({ error: 'Failed to subscribe' });
    }
});

// ============ ADMIN API ROUTES (Protected) ============

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
        console.error('Error creating module:', error);
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
        console.error('Error adding YouTube lesson:', error);
        res.status(400).json({ error: error.message || 'Failed to add lesson' });
    }
});

app.delete('/api/admin/lessons/:lessonId', async (req, res) => {
    try {
        const { lessonId } = req.params;
        await supabaseDB.deleteLesson(lessonId);
        res.json({ success: true, message: 'Lesson deleted successfully' });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/admin/contacts', async (req, res) => {
    try {
        const contacts = await supabaseDB.getContacts();
        res.json(contacts);
    } catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/admin/feedback/:moduleId', async (req, res) => {
    try {
        const { moduleId } = req.params;
        const feedback = await supabaseDB.getFeedback(moduleId);
        res.json(feedback);
    } catch (error) {
        console.error('Error fetching feedback:', error);
        res.status(500).json({ error: error.message });
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
        console.error('Error fetching skills:', error);
        res.status(500).json({ error: 'Failed to fetch skills' });
    }
});

// ============ FRONTEND ROUTES ============

// MAIN ROUTE - Landing page (now index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Original course dashboard (now at /courses)
app.get('/courses', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/courses.html'));
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

app.get('/landing', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// ============ GLOBAL ERROR HANDLER ============
app.use((err, req, res, next) => {
    console.error('Server error:', {
        message: err.message,
        path: req.path,
        method: req.method,
        ip: req.ip
    });
    
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

// ============ SOLUTION 2: Completion Path Validation ============

// Add this function to check lesson order
async function validateLessonOrder(userId, moduleId, lessonId, lessonOrder) {
    // First lesson (order 1) has no prerequisite
    if (lessonOrder === 1) {
        return { valid: true };
    }
    
    // Get the previous lesson ID (order - 1)
    const { data: previousLesson, error: prevLessonError } = await supabase
        .from('lessons')
        .select('id')
        .eq('module_id', moduleId)
        .eq('lesson_order', lessonOrder - 1)
        .single();
    
    if (prevLessonError || !previousLesson) {
        return { valid: false, error: 'Previous lesson not found' };
    }
    
    // Check if previous lesson is completed
    const { data: progress, error: progressError } = await supabase
        .from('user_progress')
        .select('completed, completed_at')
        .eq('user_id', userId)
        .eq('lesson_id', previousLesson.id)
        .eq('completed', true)
        .single();
    
    if (progressError || !progress) {
        return { 
            valid: false, 
            error: `Please complete Lesson ${lessonOrder - 1} first before moving to Lesson ${lessonOrder}.` 
        };
    }
    
    // Also check minimum time between completions (anti-cheat)
    if (progress.completed_at) {
        const completedTime = new Date(progress.completed_at).getTime();
        const currentTime = Date.now();
        const timeDiffMinutes = (currentTime - completedTime) / 1000 / 60;
        
        // Require at least 1 minute between lesson completions
        if (timeDiffMinutes < 1 && lessonOrder > 1) {
            return { 
                valid: false, 
                error: 'Please wait a moment before continuing to the next lesson.' 
            };
        }
    }
    
    return { valid: true };
}

// Replace the mark-complete endpoint with this enhanced version
app.post('/api/progress/mark-complete', async (req, res) => {
    try {
        const { userId, lessonId, moduleId, timeSpent, watchPercentage } = req.body;
        
        if (!userId || !lessonId || !moduleId) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        // Get lesson details
        const { data: lesson, error: lessonError } = await supabase
            .from('lessons')
            .select('duration, content_type, lesson_order')
            .eq('id', lessonId)
            .single();
        
        if (lessonError) throw lessonError;
        
        // SOLUTION 1: Watch time validation (for YouTube videos)
        if (lesson.content_type === 'youtube') {
            if (!timeSpent || !watchPercentage) {
                return res.status(400).json({ error: 'Watch time data required' });
            }
            
            let requiredSeconds = 300;
            if (lesson.duration) {
                const match = lesson.duration.match(/(\d+)/);
                if (match) {
                    requiredSeconds = parseInt(match[1]) * 60;
                }
            }
            
            const minRequiredSeconds = requiredSeconds * 0.85;
            
            if (timeSpent < minRequiredSeconds && watchPercentage < 90) {
                return res.status(400).json({ 
                    error: `Please watch at least 90% of the video. You watched ${Math.floor(watchPercentage)}%.` 
                });
            }
        }
        
        // SOLUTION 2: Path validation (check previous lesson completed)
        const orderValidation = await validateLessonOrder(userId, moduleId, lessonId, lesson.lesson_order);
        if (!orderValidation.valid) {
            return res.status(400).json({ error: orderValidation.error });
        }
        
        // Check if already completed
        const { data: existing } = await supabase
            .from('user_progress')
            .select('id')
            .eq('user_id', userId)
            .eq('lesson_id', lessonId)
            .single();
        
        if (existing) {
            const { error } = await supabase
                .from('user_progress')
                .update({ 
                    completed: true, 
                    completed_at: new Date().toISOString(),
                    time_spent_seconds: timeSpent || 0,
                    watch_percentage: watchPercentage || 100
                })
                .eq('id', existing.id);
            
            if (error) throw error;
        } else {
            const { error } = await supabase
                .from('user_progress')
                .insert([{
                    user_id: userId,
                    lesson_id: lessonId,
                    module_id: moduleId,
                    completed: true,
                    completed_at: new Date().toISOString(),
                    time_spent_seconds: timeSpent || 0,
                    watch_percentage: watchPercentage || 100
                }]);
            
            if (error) throw error;
        }
        
        res.json({ success: true });
    } catch (error) {
        console.error('Mark complete error:', error);
        res.status(500).json({ error: error.message });
    }
});

// ============ SOLUTION 3: Rate Limiting & Anomaly Detection ============

// Track completion attempts per user/IP
const completionAttempts = new Map(); // userId -> { count, firstAttempt, timestamps[] }

// Clean up old entries every hour
setInterval(() => {
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    for (const [key, data] of completionAttempts.entries()) {
        if (data.firstAttempt < oneHourAgo) {
            completionAttempts.delete(key);
        }
    }
}, 60 * 60 * 1000);

// Anomaly detection function
async function detectAnomaly(userId, ipAddress, moduleId) {
    const now = Date.now();
    const oneHourAgo = now - 60 * 60 * 1000;
    const fiveMinutesAgo = now - 5 * 60 * 1000;
    
    // Get user's completion history from database (last hour)
    const { data: recentCompletions, error } = await supabase
        .from('user_progress')
        .select('created_at, lesson_id')
        .eq('user_id', userId)
        .gte('created_at', new Date(oneHourAgo).toISOString())
        .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Check 1: Too many completions in an hour (max 15)
    if (recentCompletions && recentCompletions.length >= 15) {
        return { 
            isAnomaly: true, 
            reason: 'Too many lessons completed in a short period. Please slow down.' 
        };
    }
    
    // Check 2: Completions happening too fast (less than 60 seconds apart)
    if (recentCompletions && recentCompletions.length >= 2) {
        const lastCompletion = new Date(recentCompletions[0].created_at).getTime();
        const secondLastCompletion = new Date(recentCompletions[1].created_at).getTime();
        const timeDiffSeconds = (lastCompletion - secondLastCompletion) / 1000;
        
        if (timeDiffSeconds < 60 && timeDiffSeconds > 0) {
            return { 
                isAnomaly: true, 
                reason: 'Lessons are being completed too quickly. Please take your time with each lesson.' 
            };
        }
    }
    
    // Check 3: Track in-memory attempts (for very rapid requests)
    const key = `${userId}:${ipAddress}`;
    const attempts = completionAttempts.get(key);
    
    if (attempts) {
        // More than 10 completion attempts in 5 minutes
        const recentAttempts = attempts.timestamps.filter(t => t > fiveMinutesAgo);
        if (recentAttempts.length > 10) {
            return { 
                isAnomaly: true, 
                reason: 'Suspicious activity detected. Please contact support if this is an error.' 
            };
        }
        
        // Update attempts
        attempts.timestamps.push(now);
        attempts.count++;
        completionAttempts.set(key, attempts);
    } else {
        completionAttempts.set(key, {
            count: 1,
            firstAttempt: now,
            timestamps: [now]
        });
    }
    
    return { isAnomaly: false };
}

// Enhanced mark-complete endpoint with rate limiting
// (Replace the existing mark-complete endpoint)
app.post('/api/progress/mark-complete', async (req, res) => {
    try {
        const { userId, lessonId, moduleId, timeSpent, watchPercentage } = req.body;
        
        if (!userId || !lessonId || !moduleId) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        // Get client IP address
        const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
        
        // SOLUTION 3: Anomaly detection
        const anomaly = await detectAnomaly(userId, ipAddress, moduleId);
        if (anomaly.isAnomaly) {
            console.warn(`Anomaly detected for user ${userId}: ${anomaly.reason}`);
            return res.status(429).json({ error: anomaly.reason });
        }
        
        // Get lesson details
        const { data: lesson, error: lessonError } = await supabase
            .from('lessons')
            .select('duration, content_type, lesson_order')
            .eq('id', lessonId)
            .single();
        
        if (lessonError) throw lessonError;
        
        // SOLUTION 1: Watch time validation (for YouTube videos)
        if (lesson.content_type === 'youtube') {
            if (!timeSpent || !watchPercentage) {
                return res.status(400).json({ error: 'Watch time data required' });
            }
            
            let requiredSeconds = 300;
            if (lesson.duration) {
                const match = lesson.duration.match(/(\d+)/);
                if (match) {
                    requiredSeconds = parseInt(match[1]) * 60;
                }
            }
            
            const minRequiredSeconds = requiredSeconds * 0.85;
            
            if (timeSpent < minRequiredSeconds && watchPercentage < 90) {
                return res.status(400).json({ 
                    error: `Please watch at least 90% of the video. You watched ${Math.floor(watchPercentage)}%.` 
                });
            }
        }
        
        // SOLUTION 2: Path validation (check previous lesson completed)
        const orderValidation = await validateLessonOrder(userId, moduleId, lessonId, lesson.lesson_order);
        if (!orderValidation.valid) {
            return res.status(400).json({ error: orderValidation.error });
        }
        
        // Check if already completed
        const { data: existing } = await supabase
            .from('user_progress')
            .select('id')
            .eq('user_id', userId)
            .eq('lesson_id', lessonId)
            .single();
        
        if (existing) {
            const { error } = await supabase
                .from('user_progress')
                .update({ 
                    completed: true, 
                    completed_at: new Date().toISOString(),
                    time_spent_seconds: timeSpent || 0,
                    watch_percentage: watchPercentage || 100,
                    ip_address: ipAddress
                })
                .eq('id', existing.id);
            
            if (error) throw error;
        } else {
            const { error } = await supabase
                .from('user_progress')
                .insert([{
                    user_id: userId,
                    lesson_id: lessonId,
                    module_id: moduleId,
                    completed: true,
                    completed_at: new Date().toISOString(),
                    time_spent_seconds: timeSpent || 0,
                    watch_percentage: watchPercentage || 100,
                    ip_address: ipAddress
                }]);
            
            if (error) throw error;
        }
        
        res.json({ success: true });
    } catch (error) {
        console.error('Mark complete error:', error);
        res.status(500).json({ error: error.message });
    }
});
