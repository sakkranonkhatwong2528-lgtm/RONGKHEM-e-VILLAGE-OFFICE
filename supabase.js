// supabase.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// 1. ระบุ URL และ Key จาก Supabase Project Settings > API
const SUPABASE_URL = 'https://YOUR_SUPABASE_PROJECT_ID.supabase.co'; 
const SUPABASE_KEY = 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/**
 * ดึงข้อมูลทั้งหมดจากตารางที่กำหนด
 * @param {string} tableName - ชื่อตารางในฐานข้อมูล
 */
export async function fetchData(tableName) {
    const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .order('id', { ascending: false });
        
    if (error) {
        console.error(`Error fetching from ${tableName}:`, error);
        return [];
    }
    return data;
}

/**
 * เพิ่มข้อมูลใหม่ลงตาราง
 * @param {string} tableName - ชื่อตาราง
 * @param {object} payload - ข้อมูลที่ต้องการเพิ่ม
 */
export async function insertData(tableName, payload) {
    const { data, error } = await supabase
        .from(tableName)
        .insert([payload])
        .select();
        
    if (error) {
        console.error(`Error inserting into ${tableName}:`, error);
        alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล: ' + error.message);
        throw error;
    }
    return data;
}

/**
 * แก้ไขข้อมูลเดิมตาม ID
 * @param {string} tableName - ชื่อตาราง
 * @param {number|string} id - รหัสรายการที่ต้องการแก้ไข
 * @param {object} payload - ข้อมูลที่ต้องการอัปเดต
 */
export async function updateData(tableName, id, payload) {
    const { data, error } = await supabase
        .from(tableName)
        .update(payload)
        .eq('id', id)
        .select();
        
    if (error) {
        console.error(`Error updating ${tableName}:`, error);
        alert('เกิดข้อผิดพลาดในการอัปเดตข้อมูล: ' + error.message);
        throw error;
    }
    return data;
}

/**
 * ลบข้อมูลตาม ID
 * @param {string} tableName - ชื่อตาราง
 * @param {number|string} id - รหัสรายการที่ต้องการลบ
 */
export async function deleteData(tableName, id) {
    if (!confirm('คุณยืนยันที่จะลบรายการนี้ใช่หรือไม่?')) {
        return false;
    }
    
    const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);
        
    if (error) {
        console.error(`Error deleting from ${tableName}:`, error);
        alert('เกิดข้อผิดพลาดในการลบข้อมูล: ' + error.message);
        throw error;
    }
    return true;
}
