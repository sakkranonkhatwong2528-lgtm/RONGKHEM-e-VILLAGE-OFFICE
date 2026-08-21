// ========================================
// SUPABASE CONFIG (Global Window Client)
// ========================================

const SUPABASE_URL = "https://qtnjtsigdgiwdsdfocmq.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_xsHzrDWMBlYwWyTIrojR4Q_8W6mEbJN";

// สร้าง Supabase Client ให้เป็น Global Variable
const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);
