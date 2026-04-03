// Simple working version
console.log('Main.js loaded - Version 2.0');

let currentModule = null;

// Load courses when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded, fetching courses...');
    loadCourses();
});

async function loadCourses() {
    try {
        console.log('Fetching from /api/modules...');
        const response = await fetch('/api/modules');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const courses = await response.json();
        console.log(`Received ${courses.length} courses:`, courses);
        
        const grid = document.getElementById('skills-grid');
        if (!grid) {
            console.error('skills-grid element not found!');
            return;
        }
        
        if (courses.length === 0) {
            grid.innerHTML = '<p style="text-align: center; padding: 40px;">No courses available yet. Check back soon!</p>';
            return;
        }
        
        // Clear loading message
        grid.innerHTML = '';
        
        // Display each course as a card
        courses.forEach(course => {
            const card = document.createElement('div');
            card.className = 'skill-card';
            card.onclick = () => viewCourse(course);
            
            // Get emoji based on category
            let emoji = '📚';
            if (course.category === 'Development') emoji = '💻';
            else if (course.category === 'Finance') emoji = '💰';
            else if (course.category === 'Marketing') emoji = '📢';
            else if (course.category === 'Content Creation') emoji = '🎬';
            else if (course.category === 'Business') emoji = '🏢';
            
            card.innerHTML = `
                <div style="font-size: 3rem; margin-bottom: 10px;">${emoji}</div>
                <h3 style="color: #667eea; margin-bottom: 10px;">${escapeHtml(course.title)}</h3>
                <p style="color: #666; margin-bottom: 10px;">${escapeHtml(course.description || 'Learn this valuable skill')}</p>
                <div style="display: flex; justify-content: space-between; margin-top: 15px;">
                    <small style="color: #999;">⏱️ ${escapeHtml(course.estimatedTime || 'Self-paced')}</small>
                    <small style="color: #48bb78;">▶️ Start Learning</small>
                </div>
            `;
            
            grid.appendChild(card);
        });
        
        console.log('Courses displayed successfully');
        
    } catch (error) {
        console.error('Error loading courses:', error);
        const grid = document.getElementById('skills-grid');
        if (grid) {
            grid.innerHTML = `<p style="color: red; text-align: center; padding: 40px;">
                Error loading courses: ${error.message}<br>
                Make sure the server is running on port 5000
            </p>`;
        }
    }
}

async function viewCourse(course) {
    console.log('Viewing course:', course.title);
    currentModule = course;
    
    // Update course view
    const courseTitle = document.getElementById('course-title');
    const courseDesc = document.getElementById('course-description');
    
    if (courseTitle) courseTitle.textContent = course.title;
    if (courseDesc) {
        courseDesc.innerHTML = `
            <div style="background: #f0f0f0; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p>${escapeHtml(course.description || 'No description available')}</p>
                <p><strong>⏱️ Estimated time:</strong> ${escapeHtml(course.estimatedTime || 'Self-paced')}</p>
                <p><strong>📊 Status:</strong> ${course.isActive ? 'Active' : 'Coming Soon'}</p>
            </div>
        `;
    }
    
    // Load lessons for this course
    try {
        const response = await fetch(`/api/modules/${course.moduleId}/lessons`);
        const lessons = await response.json();
        
        console.log(`Loaded ${lessons.length} lessons for ${course.title}`);
        
        const lessonsList = document.getElementById('lessons-list');
        if (!lessonsList) return;
        
        lessonsList.innerHTML = '';
        
        if (lessons.length === 0) {
            lessonsList.innerHTML = '<p style="text-align: center; padding: 40px;">No lessons yet. Content coming soon!</p>';
        } else {
            lessons.sort((a, b) => (a.order || 0) - (b.order || 0));
            lessons.forEach(lesson => {
                const lessonItem = document.createElement('div');
                lessonItem.className = 'lesson-item';
                lessonItem.style.padding = '15px';
                lessonItem.style.margin = '10px 0';
                lessonItem.style.backgroundColor = 'white';
                lessonItem.style.borderRadius = '8px';
                lessonItem.style.cursor = 'pointer';
                lessonItem.style.borderLeft = '4px solid #667eea';
                lessonItem.onclick = () => viewLesson(lesson);
                
                const icon = lesson.contentType === 'video' ? '🎥' : (lesson.contentType === 'pdf' ? '📄' : '📚');
                
                lessonItem.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <strong>${lesson.order || 1}. ${escapeHtml(lesson.title)}</strong>
                            <br>
                            <small>${icon} ${lesson.contentType} | ⏱️ ${lesson.duration || 'N/A'}</small>
                        </div>
                        <div style="color: #667eea;">▶️</div>
                    </div>
                `;
                lessonsList.appendChild(lessonItem);
            });
        }
        
        // Switch views
        document.getElementById('skills-section').classList.add('hidden');
        document.getElementById('modules-section').classList.add('hidden');
        document.getElementById('course-section').classList.remove('hidden');
        document.getElementById('lesson-section').classList.add('hidden');
        
    } catch (error) {
        console.error('Error loading lessons:', error);
        const lessonsList = document.getElementById('lessons-list');
        if (lessonsList) {
            lessonsList.innerHTML = `<p style="color: red;">Error loading lessons: ${error.message}</p>`;
        }
    }
}

function viewLesson(lesson) {
    console.log('Loading lesson:', lesson.title);
    
    const lessonTitle = document.getElementById('lesson-title');
    const lessonContent = document.getElementById('lesson-content');
    
    if (lessonTitle) lessonTitle.textContent = lesson.title;
    
    if (lessonContent) {
        lessonContent.innerHTML = '';
        
        if (lesson.contentType === 'video') {
            const video = document.createElement('video');
            video.controls = true;
            video.style.width = '100%';
            video.style.maxWidth = '800px';
            video.style.margin = '20px auto';
            video.style.display = 'block';
            video.src = lesson.fileUrl;
            lessonContent.appendChild(video);
        } else if (lesson.contentType === 'pdf') {
            lessonContent.innerHTML = `
                <iframe src="${lesson.fileUrl}" style="width:100%; height:600px; border:none;"></iframe>
                <p style="margin-top: 20px;"><a href="${lesson.fileUrl}" target="_blank" style="display: inline-block; padding: 10px 20px; background: #667eea; color: white; text-decoration: none; border-radius: 5px;">📥 Download PDF</a></p>
            `;
        } else {
            lessonContent.innerHTML = `
                <div style="text-align: center; padding: 40px;">
                    <p><a href="${lesson.fileUrl}" target="_blank" style="display: inline-block; padding: 10px 20px; background: #667eea; color: white; text-decoration: none; border-radius: 5px;">📥 View/Download Content</a></p>
                </div>
            `;
        }
    }
    
    // Switch views
    document.getElementById('skills-section').classList.add('hidden');
    document.getElementById('modules-section').classList.add('hidden');
    document.getElementById('course-section').classList.add('hidden');
    document.getElementById('lesson-section').classList.remove('hidden');
}

// Helper function to escape HTML
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Setup back button listeners
document.addEventListener('DOMContentLoaded', function() {
    // Back to modules from course
    const backToModules = document.getElementById('back-to-modules');
    if (backToModules) {
        backToModules.addEventListener('click', () => {
            document.getElementById('skills-section').classList.add('hidden');
            document.getElementById('modules-section').classList.remove('hidden');
            document.getElementById('course-section').classList.add('hidden');
            document.getElementById('lesson-section').classList.add('hidden');
        });
    }
    
    // Back to course from lesson
    const backToCourse = document.getElementById('back-to-course');
    if (backToCourse) {
        backToCourse.addEventListener('click', () => {
            if (currentModule) {
                viewCourse(currentModule);
            }
        });
    }
    
    // Back to skills from modules
    const backToSkills = document.getElementById('back-to-skills');
    if (backToSkills) {
        backToSkills.addEventListener('click', () => {
            document.getElementById('skills-section').classList.remove('hidden');
            document.getElementById('modules-section').classList.add('hidden');
            document.getElementById('course-section').classList.add('hidden');
            document.getElementById('lesson-section').classList.add('hidden');
        });
    }
});

console.log('Main.js setup complete');
