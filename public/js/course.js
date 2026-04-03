// Get module ID from URL
const urlParams = new URLSearchParams(window.location.search);
const moduleId = urlParams.get('id');

if (moduleId) {
    loadCourse(moduleId);
}

async function loadCourse(moduleId) {
    try {
        // Load module details
        const moduleRes = await fetch(`/api/modules/${moduleId}`);
        const module = await moduleRes.json();
        
        // Load lessons
        const lessonsRes = await fetch(`/api/modules/${moduleId}/lessons`);
        const lessons = await lessonsRes.json();
        
        const container = document.getElementById('course-container');
        container.innerHTML = `
            <h2>${module.title}</h2>
            <p>${module.description}</p>
            <h3>Lessons (${lessons.length})</h3>
            <div class="lessons-list">
                ${lessons.map(lesson => `
                    <div class="lesson-item" onclick="loadLesson('${lesson.id}')">
                        <strong>${lesson.order || 1}. ${lesson.title}</strong>
                        <small>${lesson.contentType} | ${lesson.duration}</small>
                    </div>
                `).join('')}
            </div>
        `;
    } catch (error) {
        console.error('Error loading course:', error);
    }
}

function loadLesson(lessonId) {
    window.location.href = `/lesson.html?id=${lessonId}`;
}
