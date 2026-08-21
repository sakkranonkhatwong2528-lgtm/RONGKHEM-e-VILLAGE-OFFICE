import { createClient } from
"https://esm.sh/@supabase/supabase-js@2";


// ========================================
// SUPABASE CONFIG
// ========================================

// URL ของโปรเจกต์คุณ
const supabaseUrl =
"https://qtnjtsigdgiwdsdfocmq.supabase.co";


// ใส่ ANON KEY ของ Supabase ตรงนี้
const supabaseAnonKey =
"ใส่_ANON_KEY_ของคุณ_ตรงนี้";


// ========================================
// CREATE CLIENT
// ========================================

const supabaseClient =
createClient(
  supabaseUrl,
  supabaseAnonKey
);


// ========================================
// EXPORT
// ========================================

export default supabaseClient;
