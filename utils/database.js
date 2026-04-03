const supabase = require('../lib/supabase');

class SupabaseDB {
    // Get all modules
    async getAllModules() {
        const { data, error } = await supabase
            .from('modules')
            .select('*')
            .order('created_at', { ascending: true });
        
        if (error) throw error;
        return data;
    }

    // Get module by ID
    async getModuleById(moduleId) {
        const { data, error } = await supabase
            .from('modules')
            .select('*')
            .eq('module_id', moduleId)
            .single();
        
        if (error && error.code !== 'PGRST116') throw error;
        return data;
    }

    // Create module
    async createModule(moduleData) {
        const { data, error } = await supabase
            .from('modules')
            .insert([{
                module_id: moduleData.moduleId,
                title: moduleData.title,
                description: moduleData.description,
                estimated_time: moduleData.estimatedTime,
                category: moduleData.category
            }])
            .select()
            .single();
        
        if (error) throw error;
        return data;
    }

    // Get lessons by module
    async getLessonsByModule(moduleId) {
        const { data, error } = await supabase
            .from('lessons')
            .select('*')
            .eq('module_id', moduleId)
            .order('lesson_order', { ascending: true });
        
        if (error) throw error;
        return data;
    }

    // Add lesson
    async addLesson(moduleId, lessonData) {
        const { data, error } = await supabase
            .from('lessons')
            .insert([{
                lesson_id: `lesson_${Date.now()}`,
                module_id: moduleId,
                title: lessonData.title,
                content_type: lessonData.contentType,
                youtube_url: lessonData.youtubeUrl,
                youtube_id: lessonData.youtubeId,
                file_url: lessonData.fileUrl,
                duration: lessonData.duration,
                lesson_order: lessonData.order
            }])
            .select()
            .single();
        
        if (error) throw error;
        return data;
    }

    // Delete module
    async deleteModule(moduleId) {
        const { error } = await supabase
            .from('modules')
            .delete()
            .eq('module_id', moduleId);
        
        if (error) throw error;
        return true;
    }
}

module.exports = new SupabaseDB();
