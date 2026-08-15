/* =====================================================
   RONGKHEM e-VILLAGE OFFICE
   REAL AUTHENTICATION / ADMIN GUARD
   ===================================================== */


/* =====================================================
   GET SESSION
   ===================================================== */

async function getAdminSession(){

  try{

    const {
      data,
      error
    } =
      await supabaseClient
        .auth
        .getSession();


    if(error){

      console.error(
        "Session error:",
        error
      );

      return null;

    }


    return data.session || null;


  }catch(error){

    console.error(
      "Session exception:",
      error
    );

    return null;

  }

}


/* =====================================================
   GET ADMIN PROFILE
   ===================================================== */

async function getAdminProfile(){

  try{

    const session =
      await getAdminSession();


    if(!session){

      return null;

    }


    const {
      data,
      error
    } =
      await supabaseClient

        .from("profiles")

        .select(
          "id,username,display_name,role,active"
        )

        .eq(
          "id",
          session.user.id
        )

        .single();


    if(error){

      console.error(
        "Profile error:",
        error
      );

      return null;

    }


    return data || null;


  }catch(error){

    console.error(
      "Profile exception:",
      error
    );

    return null;

  }

}


/* =====================================================
   REQUIRE ADMIN
   ===================================================== */

async function requireAdmin(){

  try{

    const session =
      await getAdminSession();


    /* ===============================
       ไม่มี Session
    =============================== */

    if(!session){

      window.location.replace(
        "admin-login.html"
      );

      return null;

    }


    /* ===============================
       ดึง Profile
    =============================== */

    const profile =
      await getAdminProfile();


    /* ===============================
       ไม่มี Profile
    =============================== */

    if(!profile){

      await supabaseClient
        .auth
        .signOut();


      window.location.replace(
        "admin-login.html"
      );

      return null;

    }


    /* ===============================
       ตรวจ Active
    =============================== */

    if(
      profile.active !== true
    ){

      await supabaseClient
        .auth
        .signOut();


      alert(
        "บัญชีนี้ถูกระงับการใช้งาน"
      );


      window.location.replace(
        "admin-login.html"
      );


      return null;

    }


    /* ===============================
       ตรวจ Role
    =============================== */

    if(
      profile.role !== "admin"
    ){

      await supabaseClient
        .auth
        .signOut();


      alert(
        "บัญชีนี้ไม่มีสิทธิ์เข้าสู่ระบบผู้ใหญ่บ้าน"
      );


      window.location.replace(
        "admin-login.html"
      );


      return null;

    }


    /* ===============================
       ผ่านทุกเงื่อนไข
    =============================== */

    return {

      session:
        session,

      user:
        session.user,

      profile:
        profile

    };


  }catch(error){

    console.error(
      "Admin guard error:",
      error
    );


    window.location.replace(
      "admin-login.html"
    );


    return null;

  }

}


/* =====================================================
   AUDIT LOG
   ===================================================== */

async function writeAuditLog(
  action,
  target = null,
  details = {}
){

  try{

    const session =
      await getAdminSession();


    if(!session){

      return false;

    }


    const profile =
      await getAdminProfile();


    await supabaseClient
      .from("audit_logs")
      .insert({

        user_id:
          session.user.id,

        username:
          profile
            ? profile.username
            : null,

        action:
          action,

        target:
          target,

        details:
          details

      });


    return true;


  }catch(error){

    console.error(
      "Audit log error:",
      error
    );

    return false;

  }

}


/* =====================================================
   LOGOUT ADMIN
   ===================================================== */

async function logoutAdmin(){

  try{

    await writeAuditLog(
      "LOGOUT",
      "ADMIN"
    );

  }catch(error){

    console.warn(error);

  }


  try{

    await supabaseClient
      .auth
      .signOut();

  }catch(error){

    console.error(
      "Logout error:",
      error
    );

  }


  window.location.replace(
    "admin-login.html"
  );

}


/* =====================================================
   AUTH STATE LISTENER
   ===================================================== */

supabaseClient
  .auth
  .onAuthStateChange(
    async function(
      event,
      session
    ){

      console.log(
        "Auth event:",
        event
      );


      /*
       * ถ้า Session ถูกลบ
       * และอยู่หน้า Dashboard
       * ให้กลับ Login
       */

      if(
        event === "SIGNED_OUT"
      ){

        if(
          !window.location.pathname
            .endsWith(
              "admin-login.html"
            )
        ){

          window.location.replace(
            "admin-login.html"
          );

        }

      }

    }
  );


/* =====================================================
   AUTO CHECK
   ===================================================== */

async function bootAdminSecurity(){

  /*
   * ทำงานเฉพาะหน้า Dashboard
   */

  const isLoginPage =
    window.location.pathname
      .endsWith(
        "admin-login.html"
      );


  if(isLoginPage){

    return;

  }


  /*
   * ตรวจสิทธิ์ Admin
   */

  const admin =
    await requireAdmin();


  if(!admin){

    return;

  }


  /*
   * บันทึกการเปิด Dashboard
   */

  await writeAuditLog(
    "VIEW",
    "ADMIN_DASHBOARD"
  );


  /*
   * แสดงชื่อผู้ใช้
   */

  const nameElement =
    document.getElementById(
      "adminDisplayName"
    );


  if(
    nameElement &&
    admin.profile
  ){

    nameElement.textContent =
      admin.profile.display_name
      ||
      admin.profile.username
      ||
      "ผู้ใหญ่บ้าน";

  }


  /*
   * แสดง Role
   */

  const roleElement =
    document.getElementById(
      "adminRole"
    );


  if(
    roleElement &&
    admin.profile
  ){

    roleElement.textContent =
      admin.profile.role;

  }

}


/* =====================================================
   START SECURITY
   ===================================================== */

document.addEventListener(
  "DOMContentLoaded",
  function(){

    bootAdminSecurity();

  }
);
