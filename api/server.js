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

// ============ SOLUTION 1 & 2: Database Operations ============

async function validateLessonOrder(userId, moduleId, lessonId, lessonOrder) {
    if (lessonOrder === 1) {
        return { valid: true };
    }
    
    const { data: previousLesson, error: prevLessonError } = await supabase
        .from('lessons')
        .select('id')
        .eq('module_id', moduleId)
        .eq('lesson_order', lessonOrder - 1)
        .single();
    
    if (prevLessonError || !previousLesson) {
        return { valid: false, error: 'Previous lesson not found' };
    }
    
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
    
    if (progress.completed_at) {
        const completedTime = new Date(progress.completed_at).getTime();
        const currentTime = Date.now();
        const timeDiffMinutes = (currentTime - completedTime) / 1000 / 60;
        
        if (timeDiffMinutes < 1 && lessonOrder > 1) {
            return { 
                valid: false, 
                error: 'Please wait a moment before continuing to the next lesson.' 
            };
        }
    }
    
    return { valid: true };
}

// ============ SOLUTION 3: Rate Limiting & Anomaly Detection ============

const completionAttempts = new Map();

setInterval(() => {
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    for (const [key, data] of completionAttempts.entries()) {
        if (data.firstAttempt < oneHourAgo) {
            completionAttempts.delete(key);
        }
    }
}, 60 * 60 * 1000);

async function detectAnomaly(userId, ipAddress, moduleId) {
    const now = Date.now();
    const oneHourAgo = now - 60 * 60 * 1000;
    const fiveMinutesAgo = now - 5 * 60 * 1000;
    
    const { data: recentCompletions, error } = await supabase
        .from('user_progress')
        .select('created_at, lesson_id')
        .eq('user_id', userId)
        .gte('created_at', new Date(oneHourAgo).toISOString())
        .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    if (recentCompletions && recentCompletions.length >= 15) {
        return { isAnomaly: true, reason: 'Too many lessons completed in a short period. Please slow down.' };
    }
    
    if (recentCompletions && recentCompletions.length >= 2) {
        const lastCompletion = new Date(recentCompletions[0].created_at).getTime();
        const secondLastCompletion = new Date(recentCompletions[1].created_at).getTime();
        const timeDiffSeconds = (lastCompletion - secondLastCompletion) / 1000;
        
        if (timeDiffSeconds < 60 && timeDiffSeconds > 0) {
            return { isAnomaly: true, reason: 'Lessons are being completed too quickly. Please take your time with each lesson.' };
        }
    }
    
    const key = `${userId}:${ipAddress}`;
    const attempts = completionAttempts.get(key);
    
    if (attempts) {
        const recentAttempts = attempts.timestamps.filter(t => t > fiveMinutesAgo);
        if (recentAttempts.length > 10) {
            return { isAnomaly: true, reason: 'Suspicious activity detected. Please contact support if this is an error.' };
        }
        attempts.timestamps.push(now);
        attempts.count++;
        completionAttempts.set(key, attempts);
    } else {
        completionAttempts.set(key, { count: 1, firstAttempt: now, timestamps: [now] });
    }
    
    return { isAnomaly: false };
}

// ============ SOLUTION 4: Session & IP Tracking ============

const activeSessions = new Map();

setInterval(() => {
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    for (const [fingerprint, data] of activeSessions.entries()) {
        if (data.lastSeen < oneDayAgo) {
            activeSessions.delete(fingerprint);
        }
    }
}, 60 * 60 * 1000);

async function checkIncognitoAbuse(deviceFingerprint, userId, ipAddress) {
    const now = Date.now();
    const existingSession = activeSessions.get(deviceFingerprint);
    
    if (existingSession) {
        if (!existingSession.userIds.has(userId)) {
            existingSession.userIds.add(userId);
            
            if (existingSession.userIds.size > 3) {
                const userIdsArray = Array.from(existingSession.userIds);
                const { data: completions, error } = await supabase
                    .from('user_progress')
                    .select('user_id, module_id')
                    .in('user_id', userIdsArray)
                    .eq('completed', true)
                    .gte('created_at', new Date(now - 24 * 60 * 60 * 1000).toISOString());
                
                if (!error && completions) {
                    const uniqueModules = new Set();
                    completions.forEach(c => uniqueModules.add(c.module_id));
                    if (uniqueModules.size > 3) {
                        return { isAbuse: true, reason: 'Multiple course completions detected from same device. Please use a single account.' };
                    }
                }
            }
        }
        existingSession.lastSeen = now;
        activeSessions.set(deviceFingerprint, existingSession);
    } else {
        activeSessions.set(deviceFingerprint, { userIds: new Set([userId]), firstSeen: now, lastSeen: now });
    }
    
    return { isAbuse: false };
}

// ============ SOLUTION 5: Certificate Functions ============

const CERT_SECRET = process.env.CERT_SECRET || 'your-super-secret-certificate-key-change-this';

function generateCertificateId(userId, moduleId, completedAt) {
    const data = `${userId}:${moduleId}:${completedAt}`;
    const signature = crypto.createHmac('sha256', CERT_SECRET).update(data).digest('hex').substring(0, 16);
    const date = new Date(completedAt).toISOString().slice(0, 10).replace(/-/g, '');
    const shortUserId = userId.substring(userId.length - 6);
    return `CERT-${date}-${shortUserId}-${signature}`;
}

async function checkModuleCompletion(userId, moduleId) {
    const { data: lessons, error: lessonsError } = await supabase.from('lessons').select('id').eq('module_id', moduleId);
    if (lessonsError) throw lessonsError;
    if (lessons.length === 0) return false;
    
    const { data: completed, error: progressError } = await supabase
        .from('user_progress')
        .select('lesson_id')
        .eq('user_id', userId)
        .eq('module_id', moduleId)
        .eq('completed', true);
    
    if (progressError) throw progressError;
    
    const completedIds = new Set(completed.map(c => c.lesson_id));
    return lessons.every(lesson => completedIds.has(lesson.id));
}

// ============ SOLUTION 6: Request Token System ============

const validTokens = new Map();

setInterval(() => {
    const now = Date.now();
    for (const [token, data] of validTokens.entries()) {
        if (data.expiresAt < now || data.used) {
            validTokens.delete(token);
        }
    }
}, 5 * 60 * 1000);

function generateRequestToken(userId, lessonId) {
    const token = crypto.randomBytes(32).toString('hex');
    validTokens.set(token, { userId, lessonId, expiresAt: Date.now() + 5 * 60 * 1000, used: false });
    return token;
}

function validateRequestToken(token, userId, lessonId) {
    const tokenData = validTokens.get(token);
    if (!tokenData) return { valid: false, reason: 'Invalid or expired token' };
    if (tokenData.used) return { valid: false, reason: 'Token already used' };
    if (tokenData.expiresAt < Date.now()) return { valid: false, reason: 'Token expired' };
    if (tokenData.userId !== userId || tokenData.lessonId !== lessonId) return { valid: false, reason: 'Token user/lesson mismatch' };
    tokenData.used = true;
    validTokens.set(token, tokenData);
    return { valid: true };
}

// ============ SOLUTION 7: Multi-Device Tracking ============

const userSessions = new Map();
const completionHashes = new Map();

setInterval(() => {
    const thirtyMinutesAgo = Date.now() - 30 * 60 * 1000;
    for (const [userId, data] of userSessions.entries()) {
        if (data.lastActive < thirtyMinutesAgo) {
            userSessions.delete(userId);
        }
    }
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    for (const [hash, timestamp] of completionHashes.entries()) {
        if (timestamp < oneHourAgo) completionHashes.delete(hash);
    }
}, 15 * 60 * 1000);

async function trackUserSession(userId, sessionId, deviceFingerprint, ipAddress) {
    const now = Date.now();
    const existingSession = userSessions.get(userId);
    
    if (existingSession) {
        if (sessionId) existingSession.sessions.add(sessionId);
        if (deviceFingerprint) existingSession.devices.add(deviceFingerprint);
        existingSession.lastActive = now;
        
        if (existingSession.sessions.size > 3) {
            return { isAbuse: true, reason: 'Too many active sessions. Please close other tabs/windows.' };
        }
        
        if (existingSession.devices.size > 3) {
            const { data: completions, error } = await supabase
                .from('user_progress')
                .select('module_id')
                .eq('user_id', userId)
                .eq('completed', true)
                .gte('created_at', new Date(now - 24 * 60 * 60 * 1000).toISOString());
            
            if (!error && completions) {
                const uniqueModules = new Set(completions.map(c => c.module_id));
                if (uniqueModules.size > 2) {
                    return { isAbuse: true, reason: 'Multiple devices detected completing courses. Please use one device per course.' };
                }
            }
        }
        userSessions.set(userId, existingSession);
    } else {
        userSessions.set(userId, {
            sessions: new Set(sessionId ? [sessionId] : []),
            devices: new Set(deviceFingerprint ? [deviceFingerprint] : []),
            lastActive: now
        });
    }
    
    if (deviceFingerprint) {
        for (const [otherUserId, data] of userSessions.entries()) {
            if (otherUserId !== userId && data.devices.has(deviceFingerprint)) {
                const { data: completions, error } = await supabase
                    .from('user_progress')
                    .select('module_id')
                    .in('user_id', [userId, otherUserId])
                    .eq('completed', true)
                    .gte('created_at', new Date(now - 24 * 60 * 60 * 1000).toISOString());
                
                if (!error && completions && completions.length > 5) {
                    return { isAbuse: true, reason: 'Multiple user accounts detected from same device. Please use a single account.' };
                }
            }
        }
    }
    
    return { isAbuse: false };
}

function generateCompletionHash(userId, lessonId, moduleId, timestamp) {
    return crypto.createHash('sha256').update(`${userId}:${lessonId}:${moduleId}:${timestamp}`).digest('hex').substring(0, 32);
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

app.post('/api/progress/request-token', async (req, res) => {
    try {
        const { userId, lessonId } = req.body;
        if (!userId || !lessonId) return res.status(400).json({ error: 'Missing userId or lessonId' });
        const token = generateRequestToken(userId, lessonId);
        res.json({ token, expiresIn: 300 });
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate token' });
    }
});

app.post('/api/progress/mark-complete', async (req, res) => {
    try {
        const { userId, lessonId, moduleId, timeSpent, watchPercentage, sessionId, deviceFingerprint, requestToken } = req.body;
        
        if (!userId || !lessonId || !moduleId) return res.status(400).json({ error: 'Missing required fields' });
        if (!requestToken) return res.status(401).json({ error: 'Request token required' });
        
        const tokenValidation = validateRequestToken(requestToken, userId, lessonId);
        if (!tokenValidation.valid) return res.status(403).json({ error: tokenValidation.reason });
        
        const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
        
        if (deviceFingerprint) {
            const abuseCheck = await checkIncognitoAbuse(deviceFingerprint, userId, ipAddress);
            if (abuseCheck.isAbuse) return res.status(403).json({ error: abuseCheck.reason });
        }
        
        const sessionTracking = await trackUserSession(userId, sessionId, deviceFingerprint, ipAddress);
        if (sessionTracking.isAbuse) return res.status(403).json({ error: sessionTracking.reason });
        
        const { data: sameIpUsers } = await supabase.from('user_progress').select('user_id').eq('ip_address', ipAddress).gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()).limit(10);
        if (sameIpUsers && new Set(sameIpUsers.map(u => u.user_id)).size > 5) {
            return res.status(403).json({ error: 'Too many different users from this IP address.' });
        }
        
        const anomaly = await detectAnomaly(userId, ipAddress, moduleId);
        if (anomaly.isAnomaly) return res.status(429).json({ error: anomaly.reason });
        
        const { data: lesson, error: lessonError } = await supabase.from('lessons').select('duration, content_type, lesson_order').eq('id', lessonId).single();
        if (lessonError) throw lessonError;
        
        if (lesson.content_type === 'youtube') {
            if (!timeSpent || !watchPercentage) return res.status(400).json({ error: 'Watch time data required' });
            let requiredSeconds = 300;
            if (lesson.duration) {
                const match = lesson.duration.match(/(\d+)/);
                if (match) requiredSeconds = parseInt(match[1]) * 60;
            }
            if (timeSpent < requiredSeconds * 0.85 && watchPercentage < 90) {
                return res.status(400).json({ error: `Please watch at least 90% of the video. You watched ${Math.floor(watchPercentage)}%.` });
            }
        }
        
        const orderValidation = await validateLessonOrder(userId, moduleId, lessonId, lesson.lesson_order);
        if (!orderValidation.valid) return res.status(400).json({ error: orderValidation.error });
        
        const completionHash = generateCompletionHash(userId, lessonId, moduleId, Date.now());
        if (completionHashes.has(completionHash)) return res.status(409).json({ error: 'Duplicate completion request detected.' });
        completionHashes.set(completionHash, Date.now());
        
        const { data: existing } = await supabase.from('user_progress').select('id').eq('user_id', userId).eq('lesson_id', lessonId).single();
        
        const completionData = { completed: true, completed_at: new Date().toISOString(), time_spent_seconds: timeSpent || 0, watch_percentage: watchPercentage || 100, ip_address: ipAddress, session_id: sessionId || null, device_fingerprint: deviceFingerprint || null };
        
        if (existing) {
            await supabase.from('user_progress').update(completionData).eq('id', existing.id);
        } else {
            await supabase.from('user_progress').insert([{ user_id: userId, lesson_id: lessonId, module_id: moduleId, ...completionData }]);
        }
        
        res.json({ success: true });
    } catch (error) {
        console.error('Mark complete error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/certificate/generate', async (req, res) => {
    try {
        const { userId, moduleId, name } = req.body;
        if (!userId || !moduleId) return res.status(400).json({ error: 'Missing required fields' });
        
        const isComplete = await checkModuleCompletion(userId, moduleId);
        if (!isComplete) return res.status(400).json({ error: 'Complete all lessons in this module first' });
        
        const { data: existingCert } = await supabase.from('certificates').select('certificate_id').eq('user_id', userId).eq('module_id', moduleId).single();
        if (existingCert) return res.json({ success: true, certificateId: existingCert.certificate_id, message: 'Certificate already issued' });
        
        const { data: module } = await supabase.from('modules').select('title').eq('module_id', moduleId).single();
        const { data: lastCompletion } = await supabase.from('user_progress').select('completed_at').eq('user_id', userId).eq('module_id', moduleId).eq('completed', true).order('completed_at', { ascending: false }).limit(1).single();
        
        const completedAt = lastCompletion?.completed_at || new Date().toISOString();
        const certificateId = generateCertificateId(userId, moduleId, completedAt);
        
        await supabase.from('certificates').insert([{ user_id: userId, module_id: moduleId, module_title: module.title, certificate_id: certificateId, issued_at: new Date().toISOString(), completed_at: completedAt, user_name: name || 'Anonymous Learner' }]);
        
        res.json({ success: true, certificateId, moduleTitle: module.title });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/certificate/verify/:certificateId', async (req, res) => {
    try {
        const { data: certificate } = await supabase.from('certificates').select('*').eq('certificate_id', req.params.certificateId).single();
        if (!certificate) return res.json({ valid: false, message: 'Certificate not found' });
        await supabase.from('certificates').update({ verification_count: certificate.verification_count + 1 }).eq('id', certificate.id);
        res.json({ valid: true, certificateId: certificate.certificate_id, userName: certificate.user_name, courseName: certificate.module_title, issuedAt: certificate.issued_at, completedAt: certificate.completed_at });
    } catch (error) {
        res.json({ valid: false, message: 'Verification failed' });
    }
});

app.get('/api/certificates/:userId', async (req, res) => {
    try {
        const { data } = await supabase.from('certificates').select('*').eq('user_id', req.params.userId).order('issued_at', { ascending: false });
        res.json(data || []);
    } catch (error) {
        res.json([]);
    }
});

app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        if (!name || !email || !subject || !message) return res.status(400).json({ error: 'All fields are required' });
        await supabase.from('contacts').insert([{ name, email, subject, message, status: 'unread', created_at: new Date().toISOString() }]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to send message' });
    }
});

app.post('/api/subscribe', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email || !email.includes('@')) return res.status(400).json({ error: 'Valid email required' });
        await supabase.from('subscribers').upsert([{ email, subscribed_at: new Date().toISOString() }]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to subscribe' });
    }
});

app.post('/api/admin/modules', async (req, res) => {
    try {
        const { moduleId, title, description, estimatedTime, category } = req.body;
        const { data, error } = await supabaseAdmin.from('modules').insert([{ module_id: moduleId, title, description, estimated_time: estimatedTime, category, is_active: true }]).select().single();
        if (error) throw error;
        res.status(201).json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/api/admin/youtube-lesson', async (req, res) => {
    try {
        const { moduleId, lessonTitle, youtubeUrl, duration, order } = req.body;
        const videoId = extractYouTubeId(cleanYouTubeUrl(youtubeUrl));
        if (!videoId) return res.status(400).json({ error: 'Invalid YouTube URL' });
        const { data, error } = await supabaseAdmin.from('lessons').insert([{ module_id: moduleId, title: lessonTitle, content_type: 'youtube', youtube_url: `https://youtu.be/${videoId}`, youtube_id: videoId, file_url: `https://www.youtube.com/embed/${videoId}`, duration: duration || 'N/A', lesson_order: order || 1 }]).select().single();
        if (error) throw error;
        res.status(201).json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.delete('/api/admin/lessons/:lessonId', async (req, res) => {
    try {
        await supabaseAdmin.from('lessons').delete().eq('id', req.params.lessonId);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/admin/contacts', async (req, res) => {
    try {
        const { data } = await supabaseAdmin.from('contacts').select('*').order('created_at', { ascending: false });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/admin/feedback/:moduleId', async (req, res) => {
    try {
        const { data } = await supabaseAdmin.from('module_feedback').select('*').eq('module_id', req.params.moduleId).order('created_at', { ascending: false });
        const ratings = data.filter(f => f.rating).map(f => f.rating);
        const avgRating = ratings.length > 0 ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : null;
        res.json({ total: data.length, averageRating: avgRating, feedback: data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============ FRONTEND ROUTES ============
app.get('/', (req, res) => { res.sendFile(path.join(__dirname, '../public/index.html')); });
app.get('/courses', (req, res) => { res.sendFile(path.join(__dirname, '../public/courses.html')); });
app.get('/admin', (req, res) => { res.sendFile(path.join(__dirname, '../public/admin/index.html')); });
app.get('/privacy', (req, res) => { res.sendFile(path.join(__dirname, '../public/privacy.html')); });
app.get('/terms', (req, res) => { res.sendFile(path.join(__dirname, '../public/terms.html')); });
app.get('/contact', (req, res) => { res.sendFile(path.join(__dirname, '../public/contact.html')); });
app.get('/verify', (req, res) => { res.sendFile(path.join(__dirname, '../public/verify.html')); });

app.use((err, req, res, next) => {
    console.error('Server error:', err.message);
    res.status(500).json({ error: 'Something went wrong. Please try again later.' });
});

module.exports = app;

// ============ QUIZ SYSTEM API ============

const { generateQuizFromMetadata } = require('../utils/quiz-generator');

// Generate quiz for a lesson (admin only)
app.post('/api/admin/quiz/generate/:lessonId', async (req, res) => {
    try {
        const { lessonId } = req.params;
        
        // Get lesson details
        const { data: lesson, error: lessonError } = await supabase
            .from('lessons')
            .select('title, module_id')
            .eq('id', lessonId)
            .single();
        
        if (lessonError) throw lessonError;
        
        // Get module details for context
        const { data: module, error: moduleError } = await supabase
            .from('modules')
            .select('title')
            .eq('module_id', lesson.module_id)
            .single();
        
        // Generate quiz using AI
        const description = `Course: ${module?.title || 'Unknown'}. Lesson: ${lesson.title}`;
        const questions = await generateQuizFromMetadata(lesson.title, description);
        
        // Save questions to database
        for (const q of questions) {
            await supabase
                .from('quiz_questions')
                .insert([{
                    lesson_id: lessonId,
                    question: q.question,
                    options: q.options,
                    correct_answer: q.correct_answer,
                    explanation: q.explanation
                }]);
        }
        
        res.json({ success: true, questionsCount: questions.length });
    } catch (error) {
        console.error('Quiz generation error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get quiz for a lesson (student)
app.get('/api/quiz/:lessonId', async (req, res) => {
    try {
        const { lessonId } = req.params;
        const { userId } = req.query;
        
        // Get quiz questions
        const { data: questions, error: qError } = await supabase
            .from('quiz_questions')
            .select('*')
            .eq('lesson_id', lessonId);
        
        if (qError) throw qError;
        
        // Get user's attempts
        const { data: attempts, error: aError } = await supabase
            .from('quiz_attempts')
            .select('*')
            .eq('user_id', userId)
            .eq('lesson_id', lessonId)
            .order('attempt_number', { ascending: false });
        
        const attemptCount = attempts?.length || 0;
        const canAttempt = attemptCount < 3;
        const lastAttempt = attempts?.[0];
        
        // Shuffle questions and options for each user
        const shuffledQuestions = questions.map(q => ({
            id: q.id,
            question: q.question,
            options: shuffleArray([...q.options]),
            correct_answer: q.correct_answer,
            explanation: q.explanation
        }));
        
        res.json({
            questions: shuffleArray(shuffledQuestions),
            attemptCount,
            canAttempt,
            maxAttempts: 3,
            lastScore: lastAttempt?.score,
            lastPassed: lastAttempt?.passed
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Submit quiz answers
app.post('/api/quiz/submit', async (req, res) => {
    try {
        const { userId, lessonId, answers } = req.body;
        
        // Get correct answers
        const { data: questions, error: qError } = await supabase
            .from('quiz_questions')
            .select('id, correct_answer')
            .eq('lesson_id', lessonId);
        
        if (qError) throw qError;
        
        // Calculate score
        let correctCount = 0;
        const answerMap = new Map();
        
        for (const [questionId, userAnswer] of Object.entries(answers)) {
            const question = questions.find(q => q.id == questionId);
            if (question && userAnswer === question.correct_answer) {
                correctCount++;
            }
            answerMap.set(questionId, userAnswer);
        }
        
        const score = Math.round((correctCount / questions.length) * 100);
        const passed = score >= 70;
        
        // Get existing attempts
        const { data: existingAttempts } = await supabase
            .from('quiz_attempts')
            .select('attempt_number')
            .eq('user_id', userId)
            .eq('lesson_id', lessonId)
            .order('attempt_number', { ascending: false });
        
        const attemptNumber = (existingAttempts?.length || 0) + 1;
        
        // Save attempt
        const { error: insertError } = await supabase
            .from('quiz_attempts')
            .insert([{
                user_id: userId,
                lesson_id: lessonId,
                score: score,
                passed: passed,
                answers: Object.fromEntries(answerMap),
                attempt_number: attemptNumber
            }]);
        
        if (insertError) throw insertError;
        
        // If passed, automatically mark lesson as complete
        if (passed) {
            // Check if already completed
            const { data: existingProgress } = await supabase
                .from('user_progress')
                .select('id')
                .eq('user_id', userId)
                .eq('lesson_id', lessonId)
                .single();
            
            if (!existingProgress) {
                await supabase
                    .from('user_progress')
                    .insert([{
                        user_id: userId,
                        lesson_id: lessonId,
                        module_id: req.body.moduleId,
                        completed: true,
                        completed_at: new Date().toISOString()
                    }]);
            }
        }
        
        res.json({
            success: true,
            score: score,
            passed: passed,
            attemptNumber: attemptNumber,
            remainingAttempts: 3 - attemptNumber,
            correctCount: correctCount,
            totalQuestions: questions.length
        });
    } catch (error) {
        console.error('Quiz submit error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Helper: Shuffle array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// ============ MANDATORY RETAKE & REQUIREMENTS SYSTEM ============

// Get lesson requirements (quiz needed, passing score, etc.)
async function getLessonRequirements(lessonId) {
    const { data, error } = await supabase
        .from('lesson_requirements')
        .select('*')
        .eq('lesson_id', lessonId)
        .single();
    
    if (error || !data) {
        // Default requirements
        return {
            requires_quiz_pass: true,
            requires_min_score: 70,
            max_attempts: 3,
            cooldown_hours: 1
        };
    }
    return data;
}

// Check if user can attempt quiz
async function canAttemptQuiz(userId, lessonId) {
    const requirements = await getLessonRequirements(lessonId);
    
    // Get user's attempts
    const { data: attempts, error } = await supabase
        .from('quiz_attempts')
        .select('*')
        .eq('user_id', userId)
        .eq('lesson_id', lessonId)
        .order('attempt_number', { ascending: false });
    
    if (error) throw error;
    
    const attemptCount = attempts?.length || 0;
    const lastAttempt = attempts?.[0];
    
    // Check if already passed
    if (lastAttempt?.passed) {
        return { canAttempt: false, reason: 'already_passed', message: 'You have already passed this quiz.' };
    }
    
    // Check max attempts
    if (attemptCount >= requirements.max_attempts) {
        return { 
            canAttempt: false, 
            reason: 'max_attempts_reached', 
            message: `You have used all ${requirements.max_attempts} attempts. This lesson requires quiz completion to proceed.` 
        };
    }
    
    // Check cooldown period
    if (lastAttempt?.cooldown_until) {
        const cooldownEnd = new Date(lastAttempt.cooldown_until);
        if (cooldownEnd > new Date()) {
            const minutesLeft = Math.ceil((cooldownEnd - new Date()) / 1000 / 60);
            return { 
                canAttempt: false, 
                reason: 'cooldown_active', 
                message: `Please wait ${minutesLeft} minutes before retaking the quiz.`,
                cooldownMinutes: minutesLeft
            };
        }
    }
    
    return { 
        canAttempt: true, 
        attemptNumber: attemptCount + 1,
        maxAttempts: requirements.max_attempts,
        passingScore: requirements.requires_min_score
    };
}

// Enhanced quiz submission with mandatory retake
app.post('/api/quiz/submit', async (req, res) => {
    try {
        const { userId, lessonId, answers } = req.body;
        
        // Check if user can attempt
        const canAttempt = await canAttemptQuiz(userId, lessonId);
        if (!canAttempt.canAttempt) {
            return res.status(403).json({ 
                error: canAttempt.message,
                reason: canAttempt.reason,
                mandatoryRetake: true
            });
        }
        
        // Get correct answers
        const { data: questions, error: qError } = await supabase
            .from('quiz_questions')
            .select('id, correct_answer')
            .eq('lesson_id', lessonId);
        
        if (qError) throw qError;
        
        // Calculate score
        let correctCount = 0;
        const answerMap = new Map();
        
        for (const [questionId, userAnswer] of Object.entries(answers)) {
            const question = questions.find(q => q.id == questionId);
            if (question && userAnswer === question.correct_answer) {
                correctCount++;
            }
            answerMap.set(questionId, userAnswer);
        }
        
        const requirements = await getLessonRequirements(lessonId);
        const score = Math.round((correctCount / questions.length) * 100);
        const passed = score >= requirements.requires_min_score;
        
        // Get existing attempts
        const { data: existingAttempts } = await supabase
            .from('quiz_attempts')
            .select('attempt_number')
            .eq('user_id', userId)
            .eq('lesson_id', lessonId)
            .order('attempt_number', { ascending: false });
        
        const attemptNumber = (existingAttempts?.length || 0) + 1;
        
        // Set cooldown if failed
        let cooldownUntil = null;
        let retakeRequired = !passed;
        
        if (!passed) {
            cooldownUntil = new Date(Date.now() + requirements.cooldown_hours * 60 * 60 * 1000);
        }
        
        // Save attempt
        const { error: insertError } = await supabase
            .from('quiz_attempts')
            .insert([{
                user_id: userId,
                lesson_id: lessonId,
                score: score,
                passed: passed,
                answers: Object.fromEntries(answerMap),
                attempt_number: attemptNumber,
                retake_required: retakeRequired,
                cooldown_until: cooldownUntil
            }]);
        
        if (insertError) throw insertError;
        
        // If passed, mark lesson as complete
        if (passed) {
            // Check if already completed
            const { data: existingProgress } = await supabase
                .from('user_progress')
                .select('id')
                .eq('user_id', userId)
                .eq('lesson_id', lessonId)
                .single();
            
            if (!existingProgress) {
                await supabase
                    .from('user_progress')
                    .insert([{
                        user_id: userId,
                        lesson_id: lessonId,
                        module_id: req.body.moduleId,
                        completed: true,
                        completed_at: new Date().toISOString(),
                        quiz_passed: true,
                        quiz_score: score
                    }]);
            }
        }
        
        // Get next attempt info
        const nextAttemptNumber = attemptNumber + 1;
        const remainingAttempts = requirements.max_attempts - attemptNumber;
        
        res.json({
            success: true,
            score: score,
            passed: passed,
            attemptNumber: attemptNumber,
            totalAttempts: requirements.max_attempts,
            remainingAttempts: remainingAttempts,
            correctCount: correctCount,
            totalQuestions: questions.length,
            passingScore: requirements.requires_min_score,
            retakeRequired: !passed,
            cooldownUntil: cooldownUntil,
            mandatoryMessage: !passed ? `You must pass this quiz (${requirements.requires_min_score}%) to continue. ${remainingAttempts} attempt${remainingAttempts !== 1 ? 's' : ''} remaining.` : null
        });
        
    } catch (error) {
        console.error('Quiz submit error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get quiz status for a lesson (checks if user can access next lesson)
app.get('/api/quiz/status/:userId/:lessonId', async (req, res) => {
    try {
        const { userId, lessonId } = req.params;
        
        const canAttempt = await canAttemptQuiz(userId, lessonId);
        const requirements = await getLessonRequirements(lessonId);
        
        // Check if lesson is already completed
        const { data: progress } = await supabase
            .from('user_progress')
            .select('completed, quiz_passed, quiz_score')
            .eq('user_id', userId)
            .eq('lesson_id', lessonId)
            .single();
        
        const isCompleted = progress?.completed === true;
        const quizPassed = progress?.quiz_passed === true;
        
        res.json({
            canAttempt: canAttempt.canAttempt,
            isCompleted: isCompleted,
            quizPassed: quizPassed,
            attemptInfo: canAttempt.canAttempt ? {
                attemptNumber: canAttempt.attemptNumber,
                maxAttempts: canAttempt.maxAttempts,
                passingScore: canAttempt.passingScore
            } : null,
            blockReason: !canAttempt.canAttempt ? canAttempt.reason : null,
            blockMessage: !canAttempt.canAttempt ? canAttempt.message : null,
            requirements: {
                requiresQuizPass: requirements.requires_quiz_pass,
                passingScore: requirements.requires_min_score,
                maxAttempts: requirements.max_attempts
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============ CERTIFICATE LOCKING SYSTEM ============

// Check if user is eligible for course certificate
async function checkCertificateEligibility(userId, moduleId) {
    // Get course requirements
    const { data: requirements, error: reqError } = await supabase
        .from('course_completion_requirements')
        .select('*')
        .eq('module_id', moduleId)
        .single();
    
    if (reqError || !requirements) {
        return { eligible: false, reason: 'Course requirements not configured' };
    }
    
    // Check 1: All lessons completed
    const { data: lessons, error: lessonsError } = await supabase
        .from('lessons')
        .select('id')
        .eq('module_id', moduleId);
    
    if (lessonsError) throw lessonsError;
    
    const { data: completedLessons, error: progressError } = await supabase
        .from('user_progress')
        .select('lesson_id')
        .eq('user_id', userId)
        .eq('module_id', moduleId)
        .eq('completed', true);
    
    if (progressError) throw progressError;
    
    const allLessonsCompleted = lessons.length === completedLessons.length;
    
    if (!allLessonsCompleted && requirements.require_all_lessons) {
        return { 
            eligible: false, 
            reason: `Complete all ${lessons.length} lessons first. You have completed ${completedLessons.length}.` 
        };
    }
    
    // Check 2: All quizzes passed
    if (requirements.require_all_quizzes_passed) {
        const { data: quizAttempts, error: quizError } = await supabase
            .from('quiz_attempts')
            .select('lesson_id, passed, score')
            .eq('user_id', userId)
            .in('lesson_id', lessons.map(l => l.id));
        
        if (quizError) throw quizError;
        
        // Group by lesson to get latest attempt per lesson
        const lessonPassed = new Map();
        quizAttempts.forEach(attempt => {
            const existing = lessonPassed.get(attempt.lesson_id);
            if (!existing || (attempt.passed && !existing.passed)) {
                lessonPassed.set(attempt.lesson_id, { passed: attempt.passed, score: attempt.score });
            }
        });
        
        const allQuizzesPassed = lessons.every(lesson => {
            const passed = lessonPassed.get(lesson.id);
            return passed && passed.passed === true;
        });
        
        if (!allQuizzesPassed) {
            const failedLessons = lessons.filter(lesson => {
                const passed = lessonPassed.get(lesson.id);
                return !passed || !passed.passed;
            });
            return { 
                eligible: false, 
                reason: `Pass all quizzes. Failed lessons: ${failedLessons.length}` 
            };
        }
    }
    
    return { eligible: true };
}

// Enhanced certificate generation with lock check
app.post('/api/certificate/generate', async (req, res) => {
    try {
        const { userId, moduleId, name } = req.body;
        
        if (!userId || !moduleId) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        // Check eligibility
        const eligibility = await checkCertificateEligibility(userId, moduleId);
        if (!eligibility.eligible) {
            return res.status(403).json({ 
                error: 'Certificate locked', 
                reason: eligibility.reason,
                certificateLocked: true
            });
        }
        
        // Check if certificate already issued
        const { data: existingCert } = await supabase
            .from('certificates')
            .select('id, certificate_id, is_locked')
            .eq('user_id', userId)
            .eq('module_id', moduleId)
            .single();
        
        if (existingCert) {
            if (existingCert.is_locked) {
                return res.status(403).json({ 
                    error: 'Certificate is locked', 
                    reason: 'Previous certificate was locked due to requirement changes.' 
                });
            }
            return res.json({ 
                success: true, 
                certificateId: existingCert.certificate_id,
                message: 'Certificate already issued' 
            });
        }
        
        // Get module details
        const { data: module, error: moduleError } = await supabase
            .from('modules')
            .select('title, module_id')
            .eq('module_id', moduleId)
            .single();
        
        if (moduleError) throw moduleError;
        
        // Get completion date
        const { data: lastCompletion } = await supabase
            .from('user_progress')
            .select('completed_at')
            .eq('user_id', userId)
            .eq('module_id', moduleId)
            .eq('completed', true)
            .order('completed_at', { ascending: false })
            .limit(1)
            .single();
        
        const completedAt = lastCompletion?.completed_at || new Date().toISOString();
        const certificateId = generateCertificateId(userId, moduleId, completedAt);
        
        // Store certificate (unlocked)
        const { data: certificate, error: insertError } = await supabase
            .from('certificates')
            .insert([{
                user_id: userId,
                module_id: moduleId,
                module_title: module.title,
                certificate_id: certificateId,
                issued_at: new Date().toISOString(),
                completed_at: completedAt,
                user_name: name || 'Anonymous Learner',
                verification_count: 0,
                is_locked: false,
                unlocked_at: new Date().toISOString(),
                all_lessons_completed: true,
                quiz_requirement_met: true
            }])
            .select()
            .single();
        
        if (insertError) throw insertError;
        
        res.json({ 
            success: true, 
            certificateId: certificateId,
            issuedAt: certificate.issued_at,
            moduleTitle: module.title
        });
        
    } catch (error) {
        console.error('Certificate generation error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get certificate status for a course
app.get('/api/certificate/status/:userId/:moduleId', async (req, res) => {
    try {
        const { userId, moduleId } = req.params;
        
        // Get course requirements
        const { data: requirements } = await supabase
            .from('course_completion_requirements')
            .select('*')
            .eq('module_id', moduleId)
            .single();
        
        // Get lessons
        const { data: lessons } = await supabase
            .from('lessons')
            .select('id')
            .eq('module_id', moduleId);
        
        // Get completed lessons
        const { data: completedLessons } = await supabase
            .from('user_progress')
            .select('lesson_id')
            .eq('user_id', userId)
            .eq('module_id', moduleId)
            .eq('completed', true);
        
        // Get quiz results
        const { data: quizAttempts } = await supabase
            .from('quiz_attempts')
            .select('lesson_id, passed')
            .eq('user_id', userId)
            .in('lesson_id', lessons?.map(l => l.id) || []);
        
        const lessonPassed = new Map();
        quizAttempts?.forEach(attempt => {
            if (attempt.passed && !lessonPassed.has(attempt.lesson_id)) {
                lessonPassed.set(attempt.lesson_id, true);
            }
        });
        
        const totalLessons = lessons?.length || 0;
        const completedCount = completedLessons?.length || 0;
        const passedQuizzes = lessons?.filter(l => lessonPassed.get(l.id)).length || 0;
        
        const allLessonsComplete = completedCount === totalLessons;
        const allQuizzesPassed = passedQuizzes === totalLessons;
        
        // Check if certificate exists
        const { data: existingCert } = await supabase
            .from('certificates')
            .select('certificate_id, issued_at')
            .eq('user_id', userId)
            .eq('module_id', moduleId)
            .single();
        
        res.json({
            certificateAvailable: !!existingCert,
            certificateId: existingCert?.certificate_id,
            issuedAt: existingCert?.issued_at,
            requirements: {
                totalLessons,
                completedLessons: completedCount,
                lessonsRemaining: totalLessons - completedCount,
                quizzesPassed: passedQuizzes,
                quizzesRemaining: totalLessons - passedQuizzes,
                allLessonsComplete,
                allQuizzesPassed
            },
            canGenerate: allLessonsComplete && allQuizzesPassed && !existingCert,
            lockedReason: !allLessonsComplete ? 'Complete all lessons' : (!allQuizzesPassed ? 'Pass all quizzes' : null)
        });
    } catch (error) {
        console.error('Certificate status error:', error);
        res.status(500).json({ error: error.message });
    }
});
