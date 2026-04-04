// Load modules for dropdown
async function loadModulesDropdown() {
    try {
        const response = await fetch('/api/modules');
        const modules = await response.json();
        
        const select = document.getElementById('uploadModuleId');
        if (!select) return;
        
        select.innerHTML = '<option value="">Select a module...</option>';
        
        if (modules.length === 0) {
            select.innerHTML = '<option value="">No modules available. Create one first!</option>';
            return;
        }
        
        modules.forEach(module => {
            const option = document.createElement('option');
            // Use moduleId (from transformed data) or module_id
            option.value = module.moduleId || module.module_id;
            option.textContent = `${module.title} (${option.value})`;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading modules:', error);
        const select = document.getElementById('uploadModuleId');
        if (select) {
            select.innerHTML = '<option value="">Error loading modules</option>';
        }
    }
}

// Load all modules for display
async function loadAllModules() {
    try {
        const response = await fetch('/api/modules');
        const modules = await response.json();
        
        const container = document.getElementById('modules-list');
        if (!container) return;
        
        container.innerHTML = '';
        
        if (modules.length === 0) {
            container.innerHTML = '<p style="text-align: center; padding: 40px;">No modules created yet. Use "Create Module" to add your first course!</p>';
            return;
        }
        
        for (const module of modules) {
            const card = document.createElement('div');
            card.className = 'module-card';
            card.style.marginBottom = '20px';
            card.style.padding = '20px';
            card.style.border = '1px solid #ddd';
            card.style.borderRadius = '8px';
            card.style.backgroundColor = '#f9f9f9';
            
            card.innerHTML = `
                <h3 style="color: #667eea; margin-bottom: 10px;">📚 ${module.title}</h3>
                <p><strong>ID:</strong> ${module.moduleId || module.module_id}</p>
                <p><strong>Description:</strong> ${module.description || 'No description'}</p>
                <p><strong>Estimated Time:</strong> ${module.estimatedTime || module.estimated_time || 'TBD'}</p>
                <hr style="margin: 15px 0;">
                <h4>📖 Lessons:</h4>
                <div id="lessons-${module.moduleId || module.module_id}" style="margin-top: 10px;">
                    <em>Loading lessons...</em>
                </div>
            `;
            container.appendChild(card);
            
            const moduleId = module.moduleId || module.module_id;
            
            // Load lessons for this module
            try {
                const lessonsResponse = await fetch(`/api/modules/${moduleId}/lessons`);
                const lessons = await lessonsResponse.json();
                
                const lessonsDiv = document.getElementById(`lessons-${moduleId}`);
                if (!lessonsDiv) continue;
                
                if (lessons.length === 0) {
                    lessonsDiv.innerHTML = '<p style="color: #999;">No lessons yet. Add content to create lessons!</p>';
                } else {
                    lessonsDiv.innerHTML = '';
                    lessons.sort((a, b) => (a.order || 0) - (b.order || 0));
                    lessons.forEach(lesson => {
                        const lessonDiv = document.createElement('div');
                        lessonDiv.className = 'lesson-item';
                        lessonDiv.style.padding = '10px';
                        lessonDiv.style.margin = '10px 0';
                        lessonDiv.style.backgroundColor = 'white';
                        lessonDiv.style.borderLeft = '3px solid #48bb78';
                        lessonDiv.style.borderRadius = '4px';
                        
                        let icon = '📄';
                        if (lesson.contentType === 'youtube') icon = '▶️';
                        else if (lesson.contentType === 'video') icon = '🎥';
                        else if (lesson.contentType === 'pdf') icon = '📑';
                        
                        lessonDiv.innerHTML = `
                            <strong>${lesson.order || 1}. ${lesson.title}</strong><br>
                            <small>${icon} ${lesson.contentType === 'youtube' ? 'YouTube Video' : lesson.contentType} | ⏱️ ${lesson.duration || 'N/A'}</small>
                        `;
                        lessonsDiv.appendChild(lessonDiv);
                    });
                }
            } catch (err) {
                console.error(`Error loading lessons for ${moduleId}:`, err);
                const lessonsDiv = document.getElementById(`lessons-${moduleId}`);
                if (lessonsDiv) {
                    lessonsDiv.innerHTML = '<p style="color: red;">Error loading lessons</p>';
                }
            }
        }
    } catch (error) {
        console.error('Error loading modules:', error);
    }
}

// Show section
function showSection(sectionName) {
    const sections = ['create-module', 'upload-content', 'view-modules'];
    sections.forEach(section => {
        const el = document.getElementById(`${section}-section`);
        if (el) el.style.display = 'none';
    });
    
    const selectedSection = document.getElementById(`${sectionName}-section`);
    if (selectedSection) selectedSection.style.display = 'block';
    
    if (sectionName === 'upload-content') {
        loadModulesDropdown();
    } else if (sectionName === 'view-modules') {
        loadAllModules();
    }
}

// Handle module creation
const moduleForm = document.getElementById('module-form');
if (moduleForm) {
    moduleForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const moduleData = {
            moduleId: formData.get('moduleId'),
            title: formData.get('title'),
            description: formData.get('description'),
            estimatedTime: formData.get('estimatedTime')
        };
        
        if (!moduleData.moduleId || !moduleData.title) {
            showMessage('Module ID and Title are required!', 'error');
            return;
        }
        
        try {
            const response = await fetch('/api/admin/modules', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(moduleData)
            });
            
            if (response.ok) {
                const result = await response.json();
                showMessage(`✅ Module "${result.title}" created successfully!`, 'success');
                e.target.reset();
                if (document.getElementById('view-modules-section').style.display !== 'none') {
                    loadAllModules();
                }
            } else {
                const error = await response.json();
                showMessage(`❌ Error: ${error.error || 'Failed to create module'}`, 'error');
            }
        } catch (error) {
            showMessage('❌ Network error. Make sure server is running.', 'error');
        }
    });
}

// Handle content upload
const uploadForm = document.getElementById('upload-form');
if (uploadForm) {
    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const moduleSelect = document.getElementById('uploadModuleId');
        const moduleId = moduleSelect.value;
        const lessonTitle = document.getElementById('lessonTitle').value;
        const duration = document.getElementById('duration').value;
        const order = document.getElementById('order').value;
        
        if (!moduleId || !lessonTitle) {
            showMessage('Please select a module and enter lesson title', 'error');
            return;
        }
        
        // Check if YouTube tab is active
        const isYoutubeActive = document.getElementById('typeYoutubeBtn').classList.contains('active');
        
        if (isYoutubeActive) {
            // Handle YouTube link
            const youtubeUrl = document.getElementById('youtubeUrl').value;
            
            if (!youtubeUrl) {
                showMessage('Please enter a YouTube URL', 'error');
                return;
            }
            
            try {
                const response = await fetch('/api/admin/youtube-lesson', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        moduleId: moduleId,
                        lessonTitle: lessonTitle,
                        youtubeUrl: youtubeUrl,
                        duration: duration,
                        order: order
                    })
                });
                
                if (response.ok) {
                    const result = await response.json();
                    showMessage(`✅ YouTube lesson "${result.title}" added successfully!`, 'success');
                    document.getElementById('youtubeUrl').value = '';
                    document.getElementById('lessonTitle').value = '';
                    document.getElementById('duration').value = '';
                    document.getElementById('youtubePreview').style.display = 'none';
                    if (document.getElementById('view-modules-section').style.display !== 'none') {
                        loadAllModules();
                    }
                } else {
                    const error = await response.json();
                    showMessage(`❌ Error: ${error.error || 'Failed to add YouTube lesson'}`, 'error');
                }
            } catch (error) {
                showMessage('❌ Network error: ' + error.message, 'error');
            }
        } else {
            // Handle file upload
            const fileInput = document.getElementById('file');
            const contentType = document.getElementById('contentType').value;
            
            if (!fileInput.files[0]) {
                showMessage('Please select a file to upload', 'error');
                return;
            }
            
            const formData = new FormData();
            formData.append('file', fileInput.files[0]);
            formData.append('lessonTitle', lessonTitle);
            formData.append('contentType', contentType);
            formData.append('duration', duration);
            formData.append('order', order);
            
            try {
                const response = await fetch(`/api/admin/modules/${moduleId}/lessons`, {
                    method: 'POST',
                    body: formData
                });
                
                if (response.ok) {
                    const result = await response.json();
                    showMessage(`✅ Lesson "${result.title}" uploaded successfully!`, 'success');
                    fileInput.value = '';
                    document.getElementById('lessonTitle').value = '';
                    document.getElementById('duration').value = '';
                    if (document.getElementById('view-modules-section').style.display !== 'none') {
                        loadAllModules();
                    }
                } else {
                    const error = await response.json();
                    showMessage(`❌ Error: ${error.error || 'Upload failed'}`, 'error');
                }
            } catch (error) {
                showMessage('❌ Upload failed: ' + error.message, 'error');
            }
        }
    });
}

// Show message
function showMessage(message, type) {
    const existing = document.querySelector('.message-container');
    if (existing) existing.remove();
    
    const msgDiv = document.createElement('div');
    msgDiv.className = 'message-container';
    msgDiv.style.position = 'fixed';
    msgDiv.style.top = '20px';
    msgDiv.style.right = '20px';
    msgDiv.style.zIndex = '1000';
    msgDiv.style.animation = 'slideIn 0.3s ease';
    
    const bgColor = type === 'success' ? '#48bb78' : '#f56565';
    msgDiv.innerHTML = `
        <div style="background: ${bgColor}; color: white; padding: 15px 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            ${message}
        </div>
    `;
    
    document.body.appendChild(msgDiv);
    
    setTimeout(() => {
        msgDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => msgDiv.remove(), 300);
    }, 5000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('Admin panel loaded');
    showSection('create-module');
});
