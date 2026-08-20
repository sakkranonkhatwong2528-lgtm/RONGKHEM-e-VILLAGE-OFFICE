import { createClient } from
'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// ========================================
// RONGKHEM e-VILLAGE OFFICE
// Supabase Configuration
// ========================================

// ใส่ Project URL จริงของคุณ
const SUPABASE_URL = 'ใส่_PROJECT_URL_ตรงนี้';

// ใส่ Publishable Key หรือ anon public key จริงของคุณ
const SUPABASE_ANON_KEY = 'ใส่_ANON_OR_PUBLISHABLE_KEY_ตรงนี้';


// สร้างการเชื่อมต่อ Supabase
export const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true
        }
    }
);
