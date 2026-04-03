const urlParams = new URLSearchParams(window.location.search);
const lessonId = urlParams.get('id');

if (lessonId) {
    loadLesson(lessonId);
}

async function loadLesson(lessonId) {
    try {
        // Get all lessons to find this one (simplified - you'd want a direct endpoint)
        const modulesRes = await fetch('/api/modules');
        const modules = await modulesRes.json();
        
        let foundLesson = null;
        for (const module of modules) {
            const lessonsRes = await fetch(`/api/modules/${module.moduleId}/lessons`);
            const lessons = await lessonsRes.json();
            foundLesson = lessons.find(l => l.id === lessonId);
            if (foundLesson) break;
        }
        
        if (foundLesson) {
            const container = document.getElementById('lesson-container');
            container.innerHTML = `
                <h2>${foundLesson.title}</h2>
                <div class="lesson-content">
                    ${renderContent(foundLesson)}
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading lesson:', error);
    }
}

function renderContent(lesson) {
    if (lesson.contentType === 'video') {
        return `<video controls style="width:100%; max-width:800px;" src="${lesson.fileUrl}"></video>`;
    } else if (lesson.contentType === 'pdf') {
        return `<iframe src="${lesson.fileUrl}" style="width:100%; height:600px;"></iframe>`;
    } else {
        return `<a href="${lesson.fileUrl}" target="_blank">Download Content</a>`;
    }
}
