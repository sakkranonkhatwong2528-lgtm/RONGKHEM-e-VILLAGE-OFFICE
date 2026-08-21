import { createClient } from
"https://esm.sh/@supabase/supabase-js@2";

// ========================================
// SUPABASE CONFIG
// ========================================

const supabaseUrl =
"https://qtnjtsigdgiwdsdfocmq.supabase.co";

const supabaseAnonKey =
"วาง_PUBLISHABLE_OR_ANON_KEY_ตรงนี้";

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
