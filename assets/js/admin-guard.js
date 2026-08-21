// admin-guard.js
(async function checkAdminAuth() {
  // 1. ซ่อนเนื้อหาในหน้าเว็บไว้ก่อนเพื่อป้องกัน UI แวบแสดงผล (Flicker)
  document.documentElement.style.visibility = 'hidden';

  document.addEventListener('DOMContentLoaded', async () => {
    try {
      // 2. ตรวจสอบ Session ปัจจุบันจาก Supabase Client
      // (ต้องมั่นใจว่าเปิดใช้งาน supabaseClient แล้ว)
      if (typeof supabaseClient === 'undefined') {
        throw new Error('ไม่พบ supabaseClient กรุณาโหลด supabase-config.js ก่อนไฟล์นี้');
      }

      const { data: { session }, error } = await supabaseClient.auth.getSession();

      if (error || !session) {
        redirectToLogin('กรุณาเข้าสู่ระบบก่อนใช้งาน');
        return;
      }

      // 3. ตรวจสอบ Role หรือสิทธิ์การเป็น Admin ใน Metadata / Database
      const user = session.user;
      const userRole = user.user_metadata?.role || user.app_metadata?.role;

      // หากมีการเช็ค Table profiles หรือ admins เพิ่มเติม
      const { data: profile } = await supabaseClient
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      const finalRole = profile?.role || userRole;

      if (finalRole !== 'admin' && finalRole !== 'super_admin') {
        alert('คุณไม่มีสิทธิ์เข้าถึงหน้านี้');
        await supabaseClient.auth.signOut();
        redirectToLogin('บัญชีของคุณไม่มีสิทธิ์ Admin');
        return;
      }

      // 4. แสดงผลเนื้อหาหน้าเว็บเมื่อยืนยันสิทธิ์สำเร็จ
      document.documentElement.style.visibility = 'visible';

    } catch (err) {
      console.error('Auth Check Error:', err.message);
      redirectToLogin();
    }
  });

  function redirectToLogin(message) {
    if (message) alert(message);
    // ส่ง URL ปัจจุบันติดไปด้วย เพื่อให้ Redirect กลับมาหลังล็อกอินสำเร็จ
    const currentPath = encodeURIComponent(window.location.pathname);
    window.location.href = `admin-login.html?redirect=${currentPath}`;
  }
})();
