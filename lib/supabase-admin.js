const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// This client has FULL access - ONLY use in backend!
// NEVER expose this to the frontend
const supabaseAdmin = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
);

module.exports = supabaseAdmin;
