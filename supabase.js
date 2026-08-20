// supabase.js (เพิ่มต่อท้ายไฟล์เดิม)

/**
 * ล็อกอินเข้าสู่ระบบด้วย อีเมล และ รหัสผ่าน
 */
export async function loginAdmin(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });
    if (error) {
        alert('เข้าสู่ระบบไม่สำเร็จ: ' + error.message);
        throw error;
    }
    return data;
}

/**
 * ออกจากระบบ
 */
export async function logoutAdmin() {
    const { error } = await supabase.auth.signOut();
    if (error) {
        alert('เกิดข้อผิดพลาดในการออกจากระบบ: ' + error.message);
    } else {
        window.location.href = 'admin-login.html';
    }
}

/**
 * ตรวจสอบสิทธิ์การเข้าใช้งาน (ส่งกลับ Session หรือ null)
 */
export async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
}
