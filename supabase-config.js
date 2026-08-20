import { createClient } from
'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL = 'ใส่_URL_ของคุณ';

const SUPABASE_ANON_KEY = 'ใส่_ANON_KEY_ของคุณ';

export const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);
