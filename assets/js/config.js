/* =====================================================
   RONGKHEM e-VILLAGE OFFICE
   SUPABASE CONFIGURATION
   ===================================================== */

const SUPABASE_URL =
  "YOUR_SUPABASE_URL";

const SUPABASE_ANON_KEY =
  "YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY";


/* =====================================================
   CREATE SUPABASE CLIENT
   ===================================================== */

const supabaseClient =
  window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  );


/* =====================================================
   GLOBAL CONNECTION CHECK
   ===================================================== */

async function checkSupabaseConnection(){

  try{

    if(
      !SUPABASE_URL ||
      SUPABASE_URL === "YOUR_SUPABASE_URL"
    ){

      console.warn(
        "ยังไม่ได้ใส่ Supabase URL"
      );

      return false;

    }


    if(
      !SUPABASE_ANON_KEY ||
      SUPABASE_ANON_KEY ===
      "YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY"
    ){

      console.warn(
        "ยังไม่ได้ใส่ Supabase Publishable/Anon Key"
      );

      return false;

    }


    const {
      data,
      error
    } =
      await supabaseClient
        .auth
        .getSession();


    if(error){

      console.error(
        "Supabase connection error:",
        error
      );

      return false;

    }


    return true;


  }catch(error){

    console.error(
      "Supabase error:",
      error
    );

    return false;

  }

}


/* =====================================================
   GET CURRENT USER
   ===================================================== */

async function getCurrentUser(){

  try{

    const {
      data,
      error
    } =
      await supabaseClient
        .auth
        .getUser();


    if(error){

      console.warn(
        "Get user error:",
        error
      );

      return null;

    }


    return data.user || null;


  }catch(error){

    console.error(error);

    return null;

  }

}


/* =====================================================
   GET CURRENT SESSION
   ===================================================== */

async function getCurrentSession(){

  try{

    const {
      data,
      error
    } =
      await supabaseClient
        .auth
        .getSession();


    if(error){

      console.warn(
        "Get session error:",
        error
      );

      return null;

    }


    return data.session || null;


  }catch(error){

    console.error(error);

    return null;

  }

}


/* =====================================================
   LOGOUT
   ===================================================== */

async function logoutAdmin(){

  try{

    await supabaseClient
      .auth
      .signOut();


    window.location.replace(
      "admin-login.html"
    );


  }catch(error){

    console.error(
      "Logout error:",
      error
    );

  }

}
