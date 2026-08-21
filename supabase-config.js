/**
 * supabase-config.js
 * ไฟล์ตั้งค่าและเชื่อมต่อ Supabase Client สำหรับ e-Village Office
 */

const SUPABASE_URL = 'https://qtnjtsigdgiwdsdfocmq.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_xsHzrDWMBlYwWyTIrojR4Q_8W6mEbJN';

// สร้าง Supabase Client สำหรับใช้งานทั่วทั้งเว็บไซต์
let supabase = null;

if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('✅ Supabase Connected Successfully');
} else {
    console.error('❌ ไม่พบ Supabase SDK โปรดแนบแท็กสคริปต์ Supabase ใน HTML');
}
