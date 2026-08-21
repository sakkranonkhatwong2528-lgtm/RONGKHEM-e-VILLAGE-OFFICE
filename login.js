import supabaseClient from "./supabase-config.js";

const loginForm =
  document.getElementById("loginForm");

const emailInput =
  document.getElementById("email");

const passwordInput =
  document.getElementById("password");

const loginBtn =
  document.getElementById("loginBtn");

const errorMessage =
  document.getElementById("errorMessage");


// ตรวจสอบว่าล็อกอินอยู่แล้วหรือไม่

async function checkExistingLogin() {

  const {
    data
  } = await supabaseClient
    .auth
    .getUser();


  if (data.user) {

    window.location.href =
      "admin.html";

  }

}


// LOGIN

loginForm.addEventListener(
  "submit",
  async function(event) {

    event.preventDefault();


    const email =
      emailInput.value.trim();

    const password =
      passwordInput.value;


    errorMessage.textContent =
      "";


    loginBtn.disabled =
      true;

    loginBtn.textContent =
      "กำลังเข้าสู่ระบบ...";


    try {

      const {
        data,
        error
      } = await supabaseClient
        .auth
        .signInWithPassword({

          email:email,

          password:password

        });


      if (error) {

        throw error;

      }


      if (!data.user) {

        throw new Error(
          "ไม่สามารถเข้าสู่ระบบได้"
        );

      }


      window.location.href =
        "admin.html";


    }
    catch (error) {

      console.error(error);


      errorMessage.textContent =
        error.message ||
        "เข้าสู่ระบบไม่สำเร็จ";

    }
    finally {

      loginBtn.disabled =
        false;

      loginBtn.textContent =
        "🔓 เข้าสู่ระบบ";

    }

  }
);


// START

checkExistingLogin();
