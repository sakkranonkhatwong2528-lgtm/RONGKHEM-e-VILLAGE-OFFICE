// ========================================
// RONGKHEM e-VILLAGE OFFICE
// Supabase Shared Client
// ========================================

// ใช้ค่าเดิมจาก config.js ถ้ามี
const SUPABASE_URL = window.SUPABASE_URL || "YOUR_SUPABASE_URL";
const SUPABASE_ANON_KEY =
  window.SUPABASE_ANON_KEY || "YOUR_SUPABASE_ANON_KEY";

// ตรวจสอบว่าโหลด Supabase CDN แล้วหรือยัง
if (!window.supabase) {
  console.error("Supabase CDN is not loaded.");
}

// สร้าง Supabase Client เพียงตัวเดียว
const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

// Export เพื่อให้ไฟล์อื่น import ไปใช้ได้
export { supabaseClient };
export default supabaseClient;
