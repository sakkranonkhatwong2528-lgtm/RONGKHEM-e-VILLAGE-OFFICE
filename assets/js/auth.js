import supabaseClient from "../../supabase-config.js";

// ========================================
// ตรวจสอบการเข้าสู่ระบบ
// ========================================
export async function requireAdmin() {
  const {
    data: { session }
  } = await supabaseClient.auth.getSession();

  // ถ้ายังไม่ได้ Login
  if (!session) {
    window.location.href = "admin-login.html";
    return null;
  }

  return session.user;
}

// ========================================
// Login
// ========================================
export async function login(email, password) {
  const { data, error } =
    await supabaseClient.auth.signInWithPassword({
      email,
      password
    });

  if (error) {
    console.error("Login error:", error);
    throw error;
  }

  return data;
}

// ========================================
// Logout
// ========================================
export async function logout() {
  const { error } =
    await supabaseClient.auth.signOut();

  if (error) {
    console.error("Logout error:", error);
    throw error;
  }

  window.location.href = "admin-login.html";
}

// ========================================
// ถ้า Login อยู่แล้ว
// ไม่ต้องกลับไปหน้า Login
// ========================================
export async function redirectIfLoggedIn() {
  const {
    data: { session }
  } = await supabaseClient.auth.getSession();

  if (session) {
    window.location.href = "admin.html";
  }
}
