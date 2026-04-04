const supabase = require('../lib/supabase');

class SupabaseDB {
    // Get all modules
    async getAllModules() {
        const { data, error } = await supabase
            .from('modules')
            .select('*')
            .order('created_at', { ascending: true });
        
        if (error) throw error;
        
        // Transform for frontend compatibility
        return data.map(m => ({
            moduleId: m.module_id,
            module_id: m.module_id,
            title: m.title,
            description: m.description,
            estimatedTime: m.estimated_time,
            estimated_time: m.estimated_time,
            category: m.category,
            isActive: m.is_active,
            createdAt: m.created_at
        }));
    }

    // Get module by ID
    async getModuleById(moduleId) {
        const { data, error } = await supabase
            .from('modules')
            .select('*')
            .eq('module_id', moduleId)
            .single();
        
        if (error && error.code !== 'PGRST116') throw error;
        
        if (!data) return null;
        
        return {
            moduleId: data.module_id,
            module_id: data.module_id,
            title: data.title,
            description: data.description,
            estimatedTime: data.estimated_time,
            category: data.category
        };
    }

    // Create module
    async createModule(moduleData) {
        // Check if module already exists
        const existing = await this.getModuleById(moduleData.moduleId);
        if (existing) {
            throw new Error(`Module "${moduleData.moduleId}" already exists`);
        }
        
        const { data, error } = await supabase
            .from('modules')
            .insert([{
                module_id: moduleData.moduleId,
                title: moduleData.title,
                description: moduleData.description || '',
                estimated_time: moduleData.estimatedTime || 'TBD',
                category: moduleData.category || 'General',
                is_active: true
            }])
            .select()
            .single();
        
        if (error) throw error;
        
        return {
            moduleId: data.module_id,
            title: data.title,
            description: data.description,
            estimatedTime: data.estimated_time,
            category: data.category
        };
    }

    // Get lessons by module
    async getLessonsByModule(moduleId) {
        const { data, error } = await supabase
            .from('lessons')
            .select('*')
            .eq('module_id', moduleId)
            .order('lesson_order', { ascending: true });
        
        if (error) throw error;
        
        // Transform for frontend
        return data.map(l => ({
            id: l.id,
            lessonId: l.lesson_id,
            title: l.title,
            contentType: l.content_type,
            youtubeUrl: l.youtube_url,
            youtubeId: l.youtube_id,
            fileUrl: l.file_url,
            duration: l.duration,
            order: l.lesson_order,
            moduleId: l.module_id,
            createdAt: l.created_at
        }));
    }

    // Add lesson (FIXED - with module existence check)
    async addLesson(moduleId, lessonData) {
        // CRITICAL FIX: First verify the module exists
        const module = await this.getModuleById(moduleId);
        if (!module) {
            throw new Error(`Module "${moduleId}" does not exist. Please create the module first.`);
        }
        
        // Clean YouTube URL if present
        let youtubeUrl = lessonData.youtubeUrl;
        let youtubeId = lessonData.youtubeId;
        
        if (youtubeUrl && !youtubeId) {
            // Extract ID from URL
            const match = youtubeUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/);
            if (match) {
                youtubeId = match[1];
                // Clean the URL (remove tracking parameters)
                youtubeUrl = `https://youtu.be/${youtubeId}`;
            }
        }
        
        const { data, error } = await supabase
            .from('lessons')
            .insert([{
                lesson_id: `lesson_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                module_id: moduleId,
                title: lessonData.title,
                content_type: lessonData.contentType,
                youtube_url: youtubeUrl,
                youtube_id: youtubeId,
                file_url: lessonData.fileUrl,
                duration: lessonData.duration || 'N/A',
                lesson_order: lessonData.order || 1
            }])
            .select()
            .single();
        
        if (error) throw error;
        
        return {
            id: data.id,
            title: data.title,
            contentType: data.content_type,
            youtubeUrl: data.youtube_url,
            youtubeId: data.youtube_id,
            duration: data.duration,
            order: data.lesson_order
        };
    }

    // Delete module
    async deleteModule(moduleId) {
        // Check if module exists
        const module = await this.getModuleById(moduleId);
        if (!module) {
            throw new Error(`Module "${moduleId}" does not exist`);
        }
        
        const { error } = await supabase
            .from('modules')
            .delete()
            .eq('module_id', moduleId);
        
        if (error) throw error;
        return true;
    }
}

module.exports = new SupabaseDB();
