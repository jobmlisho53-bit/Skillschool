const supabase = require('../lib/supabase');
const supabaseAdmin = require('../lib/supabase-admin');

class SupabaseDB {
    // Get all modules (public read)
    async getAllModules() {
        const { data, error } = await supabase
            .from('modules')
            .select('*')
            .order('created_at', { ascending: true });
        
        if (error) throw error;
        
        return data.map(m => ({
            moduleId: m.module_id,
            module_id: m.module_id,
            title: m.title,
            description: m.description,
            estimatedTime: m.estimated_time,
            estimated_time: m.estimated_time,
            category: m.category,
            isActive: m.is_active
        }));
    }

    // Get module by ID (public read)
    async getModuleById(moduleId) {
        const { data, error } = await supabase
            .from('modules')
            .select('*')
            .eq('module_id', moduleId)
            .single();
        
        if (error && error.code !== 'PGRST116') throw error;
        return data;
    }

    // Create module (admin only - uses service role)
    async createModule(moduleData) {
        const existing = await this.getModuleById(moduleData.moduleId);
        if (existing) {
            throw new Error(`Module "${moduleData.moduleId}" already exists`);
        }
        
        const { data, error } = await supabaseAdmin
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

    // Get lessons by module (public read)
    async getLessonsByModule(moduleId) {
        const { data, error } = await supabase
            .from('lessons')
            .select('*')
            .eq('module_id', moduleId)
            .order('lesson_order', { ascending: true });
        
        if (error) throw error;
        
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

    // Add lesson (admin only - uses service role)
    async addLesson(moduleId, lessonData) {
        const module = await this.getModuleById(moduleId);
        if (!module) {
            throw new Error(`Module "${moduleId}" does not exist. Please create the module first.`);
        }
        
        const { data, error } = await supabaseAdmin
            .from('lessons')
            .insert([{
                lesson_id: `lesson_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                module_id: moduleId,
                title: lessonData.title,
                content_type: lessonData.contentType,
                youtube_url: lessonData.youtubeUrl,
                youtube_id: lessonData.youtubeId,
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

    // Delete lesson (admin only - uses service role)
    async deleteLesson(lessonId) {
        const { error } = await supabaseAdmin
            .from('lessons')
            .delete()
            .eq('id', lessonId);
        
        if (error) throw error;
        return true;
    }

    // Save user progress (uses service role for safety)
    async saveProgress(userId, lessonId, moduleId) {
        const { data: existing } = await supabaseAdmin
            .from('user_progress')
            .select('id')
            .eq('user_id', userId)
            .eq('lesson_id', lessonId)
            .single();
        
        if (existing) {
            const { error } = await supabaseAdmin
                .from('user_progress')
                .update({ completed: true, completed_at: new Date().toISOString() })
                .eq('id', existing.id);
            
            if (error) throw error;
        } else {
            const { error } = await supabaseAdmin
                .from('user_progress')
                .insert([{
                    user_id: userId,
                    lesson_id: lessonId,
                    module_id: moduleId,
                    completed: true,
                    completed_at: new Date().toISOString()
                }]);
            
            if (error) throw error;
        }
        
        return true;
    }

    // Get user progress (uses service role)
    async getUserProgress(userId, moduleId) {
        const { data: lessons, error: lessonsError } = await supabase
            .from('lessons')
            .select('id')
            .eq('module_id', moduleId);
        
        if (lessonsError) throw lessonsError;
        
        const { data: completed, error: progressError } = await supabaseAdmin
            .from('user_progress')
            .select('lesson_id')
            .eq('user_id', userId)
            .eq('module_id', moduleId)
            .eq('completed', true);
        
        if (progressError) throw progressError;
        
        const completedIds = completed?.map(c => c.lesson_id) || [];
        const total = lessons?.length || 0;
        const completedCount = completedIds.length;
        const percentage = total > 0 ? Math.round((completedCount / total) * 100) : 0;
        
        return {
            total,
            completed: completedCount,
            percentage,
            completedLessons: completedIds
        };
    }

    // Save feedback (public insert, admin only view)
    async saveFeedback(userId, moduleId, rating, confusion, suggestions) {
        const { error } = await supabaseAdmin
            .from('module_feedback')
            .insert([{
                user_id: userId,
                module_id: moduleId,
                rating: rating || null,
                helpful: rating ? (rating >= 4) : null,
                confusion: confusion || null,
                suggestions: suggestions || null,
                created_at: new Date().toISOString()
            }]);
        
        if (error) throw error;
        return true;
    }

    // Get feedback for admin (uses service role)
    async getFeedback(moduleId) {
        const { data, error } = await supabaseAdmin
            .from('module_feedback')
            .select('*')
            .eq('module_id', moduleId)
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        const ratings = data.filter(f => f.rating).map(f => f.rating);
        const avgRating = ratings.length > 0 
            ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
            : null;
        
        return {
            total: data.length,
            averageRating: avgRating,
            feedback: data
        };
    }

    // Save contact message (public insert)
    async saveContact(name, email, subject, message) {
        const { error } = await supabaseAdmin
            .from('contacts')
            .insert([{
                name: name,
                email: email,
                subject: subject,
                message: message,
                status: 'unread',
                created_at: new Date().toISOString()
            }]);
        
        if (error) throw error;
        return true;
    }

    // Get contacts for admin (uses service role)
    async getContacts() {
        const { data, error } = await supabaseAdmin
            .from('contacts')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data;
    }
}

module.exports = new SupabaseDB();
