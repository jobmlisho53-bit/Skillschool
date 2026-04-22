// Simple cache for courses (stores in localStorage)
const CACHE_KEY = 'income_school_courses';
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

function saveCoursesToCache(courses) {
    try {
        const cacheData = {
            data: courses,
            timestamp: Date.now()
        };
        localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
        console.log('Courses cached successfully');
    } catch(e) { console.log('Cache save failed:', e); }
}

function getCoursesFromCache() {
    try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (!cached) return null;
        
        const cacheData = JSON.parse(cached);
        const isExpired = (Date.now() - cacheData.timestamp) > CACHE_DURATION;
        
        if (isExpired) {
            localStorage.removeItem(CACHE_KEY);
            return null;
        }
        
        console.log('Loaded courses from cache');
        return cacheData.data;
    } catch(e) { return null; }
}

function clearCoursesCache() {
    localStorage.removeItem(CACHE_KEY);
}
