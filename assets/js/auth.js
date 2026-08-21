/**
 * auth.js
 * ระบบล็อกอิน/ออกจากระบบ สำหรับผู้ใหญ่บ้านและคณะทำงาน
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. ปุ่ม "เข้าสู่ระบบ" บน Top Header หน้าหลัก (คลิกแล้วพาไปหน้า admin-login.html)
    const headerLoginBtn = document.querySelector('header button');
    if (headerLoginBtn && !window.location.pathname.includes('admin-login.html')) {
        headerLoginBtn.style.cursor = 'pointer';
        headerLoginBtn.addEventListener('click', () => {
            window.location.href = 'admin-login.html';
        });
    }

    // 2. ตรวจสอบการส่งฟอร์มเข้าสู่ระบบในหน้า admin-login.html
    const loginForm = document.getElementById('adminLoginForm') || document.querySelector('form');
    const isLoginPage = window.location.pathname.includes('admin-login.html');

    if (isLoginPage && loginForm) {
        loginForm.addEventListener('submit', handleAdminLogin);
    }

    // 3. ป้องกันคนแอบเข้าหน้า Admin Dashboard หากยังไม่ได้ล็อกอิน
    if (!isLoginPage && window.location.pathname.includes('admin-dashboard')) {
        checkAdminSession();
    }

    // 4. ปุ่มออกจากระบบ (Logout)
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleAdminLogout);
    }
});

async function handleAdminLogin(event) {
    event.preventDefault();

    const emailInput = document.getElementById('email') || document.querySelector('input[type="email"]');
    const passwordInput = document.getElementById('password') || document.querySelector('input[type="password"]');
    const submitBtn = document.querySelector('button[type="submit"]');

    if (!emailInput || !passwordInput) return;

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerText = 'กำลังตรวจสอบข้อมูล...';
    }

    try {
        if (!supabase) throw new Error('ไม่สามารถเชื่อมต่อฐานข้อมูลได้');

        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) throw error;

        alert('เข้าสู่ระบบสำเร็จ');
        window.location.href = 'admin-dashboard-v2.html';

    } catch (err) {
        console.error('Login Error:', err.message);
        alert('เข้าสู่ระบบไม่สำเร็จ: อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerText = 'เข้าสู่ระบบ';
        }
    }
}

async function checkAdminSession() {
    if (!supabase) return;

    const { data: { session }, error } = await supabase.auth.getSession();

    if (error || !session) {
        console.warn('ยังไม่ได้เข้าสู่ระบบ นำทางกลับหน้า Login');
        window.location.href = 'admin-login.html';
    }
}

async function handleAdminLogout(event) {
    if (event) event.preventDefault();
    if (!supabase) return;

    await supabase.auth.signOut();
    alert('ออกจากระบบเรียบร้อยแล้ว');
    window.location.href = 'admin-login.html';
}
