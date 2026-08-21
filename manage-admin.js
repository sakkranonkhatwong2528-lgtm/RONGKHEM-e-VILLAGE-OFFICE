import supabaseClient from "./supabase-config.js";
import {
  loadRecords,
  createRecord,
  updateRecord,
  deleteRecord,
  uploadImage
} from "./supabase-service.js";


// ========================================
// ตั้งค่าเมนู
// ========================================

const MODULE_MAP = {
  news: "news",
  activities: "activity",
  projects: "project",
  incidents: "incident",
  complaints: "complaint",
  elderly: "elderly",
  vulnerable: "vulnerable"
};


// ========================================
// ELEMENTS
// ========================================

const adminEmail =
  document.getElementById("adminEmail");

const logoutBtn =
  document.getElementById("logoutBtn");

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

const statusInput =
  document.getElementById("statusInput");

const dateInput =
  document.getElementById("dateInput");

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

const resetBtn =
  document.getElementById("resetBtn");

const tableBody =
  document.getElementById("tableBody");

const formTitle =
  document.getElementById("formTitle");


// ========================================
// ตรวจสอบผู้ใช้
// ========================================

async function checkUser() {

  const {
    data,
    error
  } =
    await supabaseClient.auth.getUser();


  if (error || !data.user) {

    window.location.href =
      "แอดมินล็อกอิน.html";

    return;

  }


  adminEmail.textContent =
    data.user.email;

}


// ========================================
// ออกจากระบบ
// ========================================

logoutBtn.addEventListener(
  "click",
  async () => {

    await supabaseClient
      .auth
      .signOut();


    window.location.href =
      "แอดมินล็อกอิน.html";

  }
);


// ========================================
// รับชื่อโมดูลปัจจุบัน
// ========================================

function getCurrentModule() {

  return MODULE_MAP[
    menuSelect.value
  ];

}


// ========================================
// โหลดข้อมูล
// ========================================

async function renderRecords() {

  tableBody.innerHTML = `
    <tr>
      <td
        colspan="6"
        style="text-align:center">
        กำลังโหลด...
      </td>
    </tr>
  `;


  try {

    const moduleName =
      getCurrentModule();


    const records =
      await loadRecords(
        moduleName
      );


    if (!records.length) {

      tableBody.innerHTML = `
        <tr>
          <td
            colspan="6"
            style="text-align:center">
            ยังไม่มีข้อมูล
          </td>
        </tr>
      `;

      return;

    }


    tableBody.innerHTML =
      records
        .map(
          record => createRow(record)
        )
        .join("");


  } catch (error) {

    console.error(error);


    tableBody.innerHTML = `
      <tr>
        <td
          colspan="6"
          style="text-align:center;color:red">
          เกิดข้อผิดพลาด:
          ${escapeHtml(error.message)}
        </td>
      </tr>
    `;

  }

}


// ========================================
// สร้างแถวตาราง
// ========================================

function createRow(record) {

  const image =
    record.image_url;


  const detail =
    record.content ||
    record.description ||
    record.detail ||
    "-";


  const statusDate =
    record.status ||
    record.published_at ||
    record.incident_date ||
    record.created_at ||
    "-";


  return `
    <tr>

      <td>
        ${record.id}
      </td>


      <td>

        ${
          image
            ? `
              <img
                src="${image}"
                class="img-preview"
                alt="รูปภาพ">
            `
            : "-"
        }

      </td>


      <td>
        ${escapeHtml(
          record.title || "-"
        )}
      </td>


      <td>
        ${escapeHtml(detail)}
      </td>


      <td>
        ${escapeHtml(
          formatDate(statusDate)
        )}
      </td>


      <td>

        <div class="action-buttons">

          <button
            class="btn-edit"
            data-action="edit"
            data-id="${record.id}">

            ✏️ แก้ไข

          </button>


          <button
            class="btn-delete"
            data-action="delete"
            data-id="${record.id}">

            🗑 ลบ

          </button>

        </div>

      </td>

    </tr>
  `;

}


// ========================================
// ป้องกัน HTML
// ========================================

function escapeHtml(value) {

  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}


// ========================================
// แปลงวันที่
// ========================================

function formatDate(value) {

  if (!value) {
    return "-";
  }


  return String(value)
    .replace("T", " ")
    .substring(0, 19);

}


// ========================================
// เปลี่ยนเมนู
// ========================================

menuSelect.addEventListener(
  "change",
  () => {

    resetForm();

    renderRecords();

  }
);


// ========================================
// Preview รูป
// ========================================

imageInput.addEventListener(
  "change",
  () => {

    const file =
      imageInput.files[0];


    if (!file) {

      return;

    }


    const reader =
      new FileReader();


    reader.onload =
      event => {

        imagePreview.src =
          event.target.result;


        imagePreviewContainer
          .style
          .display =
            "block";

      };


    reader.readAsDataURL(file);

  }
);


// ========================================
// บันทึกข้อมูล
// ========================================

crudForm.addEventListener(
  "submit",
  async event => {

    event.preventDefault();


    const moduleName =
      getCurrentModule();


    const id =
      recordId.value;


    try {

      let imageUrl =
        currentImageUrl.value ||
        null;


      const file =
        imageInput.files[0];


      // อัปโหลดรูปใหม่

      if (file) {

        imageUrl =
          await uploadImage(
            file
          );

      }


      const payload = {

        title:
          titleInput.value.trim(),

        description:
          detailInput.value.trim(),

        content:
          detailInput.value.trim(),

        detail:
          detailInput.value.trim(),

        status:
          statusInput.value ||

          undefined,

        incident_date:
          dateInput.value ||

          undefined,

        published_at:
          dateInput.value ||

          undefined,

        image_url:
          imageUrl

      };


      // แก้ไข

      if (id) {

        await updateRecord(
          moduleName,
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
          moduleName,
          payload
        );


        alert(
          "บันทึกข้อมูลเรียบร้อยแล้ว"
        );

      }


      resetForm();

      await renderRecords();


    } catch (error) {

      console.error(error);


      alert(
        "เกิดข้อผิดพลาด: " +
        error.message
      );

    }

  }
);


// ========================================
// คลิกปุ่มในตาราง
// ========================================

tableBody.addEventListener(
  "click",
  async event => {

    const button =
      event.target.closest(
        "button"
      );


    if (!button) {

      return;

    }


    const action =
      button.dataset.action;


    const id =
      button.dataset.id;


    if (!action || !id) {

      return;

    }


    const moduleName =
      getCurrentModule();


    try {

      const records =
        await loadRecords(
          moduleName
        );


      const record =
        records.find(
          item =>
            String(item.id) ===
            String(id)
        );


      if (!record) {

        alert(
          "ไม่พบข้อมูล"
        );

        return;

      }


      // แก้ไขข้อมูล

      if (
        action === "edit"
      ) {

        editRecord(
          record
        );

      }


      // ลบข้อมูล

      if (
        action === "delete"
      ) {

        const confirmDelete =
          confirm(
            "คุณต้องการลบข้อมูลนี้หรือไม่?"
          );


        if (!confirmDelete) {

          return;

        }


        await deleteRecord(
          moduleName,
          id
        );


        alert(
          "ลบข้อมูลเรียบร้อยแล้ว"
        );


        await renderRecords();

      }


    } catch (error) {

      console.error(error);


      alert(
        "เกิดข้อผิดพลาด: " +
        error.message
      );

    }

  }
);


// ========================================
// นำข้อมูลเข้า Form
// ========================================

function editRecord(record) {

  recordId.value =
    record.id || "";


  titleInput.value =
    record.title || "";


  detailInput.value =
    record.content ||
    record.description ||
    record.detail ||
    "";


  statusInput.value =
    record.status || "";


  const dateValue =
    record.incident_date ||
    record.published_at ||
    "";


  dateInput.value =
    dateValue
      ? String(dateValue)
          .substring(0, 10)
      : "";


  currentImageUrl.value =
    record.image_url || "";


  if (record.image_url) {

    imagePreview.src =
      record.image_url;


    imagePreviewContainer
      .style
      .display =
        "block";

  }


  formTitle.textContent =
    "✏️ แก้ไขข้อมูล";


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}


// ========================================
// รีเซ็ต Form
// ========================================

function resetForm() {

  crudForm.reset();


  recordId.value =
    "";


  currentImageUrl.value =
    "";


  imagePreview.src =
    "";


  imagePreviewContainer
    .style
    .display =
      "none";


  formTitle.textContent =
    "➕ เพิ่มข้อมูลใหม่";

}


// ========================================
// ปุ่มยกเลิก
// ========================================

resetBtn.addEventListener(
  "click",
  () => {

    resetForm();

  }
);


// ========================================
// เริ่มระบบ
// ========================================

async function init() {

  await checkUser();

  await renderRecords();

}


init();
