import { createClient } from
"https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl =
"https://qtnjtsigdgiwdsdfocmq.supabase.co";

const supabaseAnonKey =
"sb_publishable_วางคีย์เต็มของคุณตรงนี้";

const supabaseClient =
createClient(
  supabaseUrl,
  supabaseAnonKey
);

export default supabaseClient;
