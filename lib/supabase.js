const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Public client - limited permissions (only SELECT on public tables)
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

module.exports = supabase;
