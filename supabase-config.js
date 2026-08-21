import { createClient } from
  "https://esm.sh/@supabase/supabase-js@2";

// ========================================
// SUPABASE CONFIG
// ========================================

// Project URL
const supabaseUrl =
  "https://qtnjtsigdgiwdsdfocmq.supabase.co";

// Publishable API Key
const supabaseAnonKey =
  "sb_publishable_xsHzrDWMBlYwWyTIrojR4Q_8W6mEbJN";

// ========================================
// CREATE SUPABASE CLIENT
// ========================================

const supabaseClient = createClient(
  supabaseUrl,
  supabaseAnonKey
);

// ========================================
// EXPORT
// ========================================

export default supabaseClient;
