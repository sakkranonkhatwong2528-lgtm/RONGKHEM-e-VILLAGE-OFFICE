import supabaseClient from "./supabase-config.js";
import {
  loadRecords,
  createRecord,
  updateRecord,
  deleteRecord,
  uploadImage
} from "./supabase-service.js";


// ========================================
// ตรวจสอบการเข้าสู่ระบบ
// ========================================

async function checkAuth() {

  const {
    data: { session }
  } = await supabaseClient.auth.getSession();


  if (!session) {

    window.location.href = "login.html";

    return;

  }


  document.getElementById("adminEmail").textContent =
    session.user.email;

}


// ========================================
// กำหนดชื่อโมดูลให้ตรงกับฐานข้อมูล
// ========================================

const MODULE_MAP = {

  news: "news",

  complaint: "complaints",

  elderly: "elderly",

  vulnerable: "vulnerable",

  project: "projects",

  incident: "incidents",

  activity: "activities"

};


// ========================================
// ตัวแปร DOM
// ========================================

const menuSelect =
  document.getElementById("menuSelect");

const crudForm =
  document.getElementById("crudForm");

const recordId =
  document.getElementById("recordId");

const titleInput =
  document.getElementById("titleInput");

const detailInput =
  document.getElementById("detailInput");

const imageInput =
  document.getElementById("imageInput");

const currentImageUrl =
  document.getElementById("currentImageUrl");

const imagePreview =
  document.getElementById("imagePreview");

const imagePreviewContainer =
  document.getElementById(
    "imagePreviewContainer"
  );

const tableBody =
  document.getElementById("tableBody");

const resetBtn =
  document.getElementById("resetBtn");

const logoutBtn =
  document.getElementById("logoutBtn");

const formTitle =
  document.getElementById("formTitle");


// ========================================
// โมดูลปัจจุบัน
// ========================================

function getCurrentModule() {

  return menuSelect.value;

}


// ========================================
// แสดงตัวอย่างรูป
// ========================================

imageInput.addEventListener(
  "change",
  function () {

    const file =
      imageInput.files[0];


    if (!file) {

      return;

    }


    const reader =
      new FileReader();


    reader.onload =
      function (event) {

        imagePreview.src =
          event.target.result;


        imagePreviewContainer.style.display =
          "block";

      };


    reader.readAsDataURL(file);

  }
);


// ========================================
// โหลดข้อมูล
// ========================================

async function loadData() {

  const module =
    getCurrentModule();


  tableBody.innerHTML = `

    <tr>

      <td
        colspan="5"
        style="text-align:center">

        กำลังโหลดข้อมูล...

      </td>

    </tr>

  `;


  try {

    const records =
      await loadRecords(module);


    if (!records.length) {

      tableBody.innerHTML = `

        <tr>

          <td
            colspan="5"
            style="text-align:center">

            ยังไม่มีข้อมูล

          </td>

        </tr>

      `;

      return;

    }


    tableBody.innerHTML =
      "";


    records.forEach(
      function (record) {

        const imageUrl =
          record.image_url || "";


        const detail =
          record.content ||
          record.description ||
          record.detail ||
          "";


        const row =
          document.createElement("tr");


        row.innerHTML = `

          <td>

            ${record.id}

          </td>


          <td>

            ${
              imageUrl
                ? `
                  <img
                    src="${imageUrl}"
                    class="img-preview"
                  >
                `
                : "-"
            }

          </td>


          <td>

            ${escapeHtml(
              record.title || ""
            )}

          </td>


          <td>

            ${escapeHtml(
              detail
            )}

          </td>


          <td>

            <button
              class="btn-edit"
              data-id="${record.id}">

              ✏️ แก้ไข

            </button>


            <button
              class="btn-delete"
              data-id="${record.id}">

              🗑 ลบ

            </button>

          </td>

        `;


        const editButton =
          row.querySelector(
            ".btn-edit"
          );


        const deleteButton =
          row.querySelector(
            ".btn-delete"
          );


        editButton.addEventListener(
          "click",
          function () {

            editRecord(
              record
            );

          }
        );


        deleteButton.addEventListener(
          "click",
          async function () {

            await removeRecord(
              record.id
            );

          }
        );


        tableBody.appendChild(
          row
        );

      }
    );


  } catch (error) {

    console.error(error);


    tableBody.innerHTML = `

      <tr>

        <td
          colspan="5"
          style="text-align:center;color:red">

          โหลดข้อมูลไม่สำเร็จ

        </td>

      </tr>

    `;

  }

}


// ========================================
// เตรียมข้อมูลสำหรับบันทึก
// ========================================

function buildPayload(imageUrl) {

  const module =
    getCurrentModule();


  const title =
    titleInput.value.trim();


  const detail =
    detailInput.value.trim();


  const payload = {

    title: title

  };


  // ข่าวสาร
  if (module === "news") {

    payload.content =
      detail;

    payload.image_url =
      imageUrl;

    payload.published_at =
      new Date()
      .toISOString();

  }


  // กิจกรรม
  if (module === "activity") {

    payload.description =
      detail;

    payload.image_url =
      imageUrl;

  }


  // โครงการ
  if (module === "project") {

    payload.description =
      detail;

    payload.image_url =
      imageUrl;

    payload.status =
      "active";

  }


  // เหตุการณ์
  if (module === "incident") {

    payload.description =
      detail;

    payload.status =
      "active";

    payload.incident_date =
      new Date()
      .toISOString();

  }


  // เรื่องร้องเรียน
  if (module === "complaint") {

    payload.detail =
      detail;

    payload.status =
      "pending";

  }


  // ผู้สูงอายุ
  if (module === "elderly") {

    payload.description =
      detail;

    payload.image_url =
      imageUrl;

  }


  // กลุ่มเปราะบาง
  if (module === "vulnerable") {

    payload.description =
      detail;

    payload.image_url =
      imageUrl;

  }


  return payload;

}


// ========================================
// บันทึกข้อมูล
// ========================================

crudForm.addEventListener(
  "submit",
  async function (event) {

    event.preventDefault();


    const module =
      getCurrentModule();


    const id =
      recordId.value;


    let imageUrl =
      currentImageUrl.value;


    const file =
      imageInput.files[0];


    try {

      const saveBtn =
        document.getElementById(
          "saveBtn"
        );


      saveBtn.disabled =
        true;


      saveBtn.textContent =
        "กำลังบันทึก...";


      // ถ้ามีรูปใหม่
      if (file) {

        imageUrl =
          await uploadImage(
            file,
            "images"
          );

      }


      const payload =
        buildPayload(
          imageUrl
        );


      // แก้ไข
      if (id) {

        await updateRecord(
          module,
          id,
          payload
        );

        alert(
          "แก้ไขข้อมูลเรียบร้อยแล้ว"
        );

      }

      // เพิ่มใหม่
      else {

        await createRecord(
          module,
          payload
        );

        alert(
          "บันทึกข้อมูลเรียบร้อยแล้ว"
        );

      }


      resetForm();


      await loadData();


    } catch (error) {

      console.error(error);


      alert(
        "เกิดข้อผิดพลาด: " +
        error.message
      );

    }


    const saveBtn =
      document.getElementById(
        "saveBtn"
      );


    saveBtn.disabled =
      false;


    saveBtn.textContent =
      "💾 บันทึกข้อมูล";

  }
);


// ========================================
// แก้ไขข้อมูล
// ========================================

function editRecord(record) {

  recordId.value =
    record.id;


  titleInput.value =
    record.title || "";


  detailInput.value =
    record.content ||
    record.description ||
    record.detail ||
    "";


  const imageUrl =
    record.image_url || "";


  currentImageUrl.value =
    imageUrl;


  if (imageUrl) {

    imagePreview.src =
      imageUrl;


    imagePreviewContainer.style.display =
      "block";

  }

  else {

    imagePreviewContainer.style.display =
      "none";

  }


  formTitle.textContent =
    "✏️ แก้ไขข้อมูล";


  window.scrollTo({

    top: 0,

    behavior: "smooth"

  });

}


// ========================================
// ลบข้อมูล
// ========================================

async function removeRecord(id) {

  const confirmDelete =
    confirm(
      "ต้องการลบข้อมูลนี้ใช่หรือไม่?"
    );


  if (!confirmDelete) {

    return;

  }


  try {

    const module =
      getCurrentModule();


    await deleteRecord(
      module,
      id
    );


    alert(
      "ลบข้อมูลเรียบร้อยแล้ว"
    );


    await loadData();


  } catch (error) {

    console.error(error);


    alert(
      "ลบข้อมูลไม่สำเร็จ: " +
      error.message
    );

  }

}


// ========================================
// รีเซ็ตฟอร์ม
// ========================================

function resetForm() {

  crudForm.reset();


  recordId.value =
    "";


  currentImageUrl.value =
    "";


  imagePreview.src =
    "";


  imagePreviewContainer.style.display =
    "none";


  formTitle.textContent =
    "➕ เพิ่มข้อมูลใหม่";

}


// ========================================
// ปุ่มยกเลิก
// ========================================

resetBtn.addEventListener(
  "click",
  function () {

    resetForm();

  }
);


// ========================================
// เปลี่ยนเมนู
// ========================================

menuSelect.addEventListener(
  "change",
  async function () {

    resetForm();


    await loadData();

  }
);


// ========================================
// ออกจากระบบ
// ========================================

logoutBtn.addEventListener(
  "click",
  async function () {

    await supabaseClient
      .auth
      .signOut();


    window.location.href =
      "login.html";

  }
);


// ========================================
// ป้องกัน XSS
// ========================================

function escapeHtml(text) {

  const div =
    document.createElement(
      "div"
    );


  div.textContent =
    text;


  return div.innerHTML;

}


// ========================================
// เริ่มระบบ
// ========================================

async function init() {

  try {

    await checkAuth();


    await loadData();


  } catch (error) {

    console.error(
      "Init error:",
      error
    );

  }

}


init();
