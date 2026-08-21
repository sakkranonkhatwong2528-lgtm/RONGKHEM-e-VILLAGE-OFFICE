import supabaseClient from "./supabase-config.js";

import {
  loadRecords,
  createRecord,
  updateRecord,
  deleteRecord,
  uploadImage,
  deleteImage
} from "./supabase.js";


// ========================================
// ELEMENTS
// ========================================

const adminEmail =
  document.getElementById("adminEmail");

const logoutBtn =
  document.getElementById("logoutBtn");

const menuSelect =
  document.getElementById("menuSelect");

const formTitle =
  document.getElementById("formTitle");

const crudForm =
  document.getElementById("crudForm");

const recordId =
  document.getElementById("recordId");

const currentImageUrl =
  document.getElementById("currentImageUrl");

const titleInput =
  document.getElementById("titleInput");

const detailInput =
  document.getElementById("detailInput");

const imageInput =
  document.getElementById("imageInput");

const imagePreview =
  document.getElementById("imagePreview");

const imagePreviewContainer =
  document.getElementById(
    "imagePreviewContainer"
  );

const resetBtn =
  document.getElementById("resetBtn");

const saveBtn =
  document.getElementById("saveBtn");

const tableBody =
  document.getElementById("tableBody");


// ========================================
// ชื่อโมดูล
// ========================================

const MODULE_NAMES = {

  news:
    "ข่าวสารประชาสัมพันธ์",

  complaint:
    "เรื่องร้องเรียน",

  elderly:
    "ข้อมูลผู้สูงอายุ",

  vulnerable:
    "กลุ่มเปราะบาง",

  project:
    "โครงการหมู่บ้าน",

  incident:
    "เหตุการณ์ / แจ้งเตือน",

  activity:
    "กิจกรรม"

};


// ========================================
// ตรวจสอบการเข้าสู่ระบบ
// ========================================

async function checkAuth() {

  const {
    data,
    error
  } =
    await supabaseClient
      .auth
      .getUser();


  if (error || !data.user) {

    window.location.href =
      "admin-login.html";

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

    const confirmLogout =
      confirm(
        "ต้องการออกจากระบบใช่หรือไม่?"
      );


    if (!confirmLogout) {

      return;

    }


    const {
      error
    } =
      await supabaseClient
        .auth
        .signOut();


    if (error) {

      alert(
        "ไม่สามารถออกจากระบบได้"
      );

      console.error(error);

      return;

    }


    window.location.href =
      "admin-login.html";

  }
);


// ========================================
// โหลดข้อมูล
// ========================================

async function refreshTable() {

  const moduleName =
    menuSelect.value;


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
      await loadRecords(
        moduleName
      );


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


    tableBody.innerHTML = "";


    records.forEach(
      record => {

        const row =
          document.createElement("tr");


        const title =
          record.title || "-";


        const detail =
          record.content ||
          record.description ||
          record.detail ||
          "-";


        const imageUrl =
          record.image_url ||
          "";


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
                    alt="รูปภาพ">
                `
                : "-"
            }

          </td>

          <td>
            ${escapeHtml(title)}
          </td>

          <td>
            ${escapeHtml(
              shortenText(
                detail,
                120
              )
            )}
          </td>

          <td>

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

          </td>

        `;


        row
          .querySelector(
            '[data-action="edit"]'
          )
          .addEventListener(
            "click",
            () => {

              editRecord(
                record
              );

            }
          );


        row
          .querySelector(
            '[data-action="delete"]'
          )
          .addEventListener(
            "click",
            () => {

              removeRecord(
                record
              );

            }
          );


        tableBody.appendChild(
          row
        );

      }
    );

  }

  catch (error) {

    console.error(error);


    tableBody.innerHTML = `
      <tr>
        <td
          colspan="5"
          style="text-align:center;color:red">

          ไม่สามารถโหลดข้อมูลได้

        </td>
      </tr>
    `;

  }

}


// ========================================
// เพิ่ม / แก้ไขข้อมูล
// ========================================

crudForm.addEventListener(
  "submit",
  async event => {

    event.preventDefault();


    const moduleName =
      menuSelect.value;


    const isEdit =
      Boolean(
        recordId.value
      );


    saveBtn.disabled = true;


    saveBtn.textContent =
      "กำลังบันทึก...";


    try {

      let imageUrl =
        currentImageUrl.value ||
        null;


      // ====================================
      // อัปโหลดรูปใหม่
      // ====================================

      if (
        imageInput.files &&
        imageInput.files[0]
      ) {

        const oldImage =
          currentImageUrl.value;


        imageUrl =
          await uploadImage(
            imageInput.files[0]
          );


        if (oldImage) {

          await deleteImage(
            oldImage
          );

        }

      }


      const payload =
        buildPayload(
          moduleName,
          imageUrl
        );


      if (isEdit) {

        await updateRecord(
          moduleName,
          recordId.value,
          payload
        );

        alert(
          "แก้ไขข้อมูลเรียบร้อยแล้ว"
        );

      }

      else {

        await createRecord(
          moduleName,
          payload
        );

        alert(
          "เพิ่มข้อมูลเรียบร้อยแล้ว"
        );

      }


      resetForm();


      await refreshTable();

    }

    catch (error) {

      console.error(error);


      alert(
        "เกิดข้อผิดพลาด: " +
        error.message
      );

    }

    finally {

      saveBtn.disabled = false;


      saveBtn.textContent =
        "💾 บันทึกข้อมูล";

    }

  }
);


// ========================================
// สร้างข้อมูลก่อนส่งเข้า Supabase
// ========================================

function buildPayload(
  moduleName,
  imageUrl
) {

  const title =
    titleInput.value.trim();

  const detail =
    detailInput.value.trim();


  switch (moduleName) {


    case "news":

      return {

        title: title,

        content: detail,

        image_url: imageUrl,

        published_at:
          new Date()
            .toISOString()

      };


    case "activity":

      return {

        title: title,

        description: detail,

        image_url: imageUrl,

        event_date:
          new Date()
            .toISOString()

      };


    case "project":

      return {

        title: title,

        description: detail,

        status:
          "กำลังดำเนินการ",

        image_url: imageUrl

      };


    case "incident":

      return {

        title: title,

        description: detail,

        status:
          "เปิด",

        incident_date:
          new Date()
            .toISOString()

      };


    case "complaint":

      return {

        title: title,

        detail: detail,

        status:
          "รอดำเนินการ",

        created_at:
          new Date()
            .toISOString()

      };


    case "elderly":

      return {

        title: title,

        description: detail,

        image_url: imageUrl

      };


    case "vulnerable":

      return {

        title: title,

        description: detail,

        image_url: imageUrl

      };


    default:

      return {

        title: title,

        description: detail,

        image_url: imageUrl

      };

  }

}


// ========================================
// แก้ไขข้อมูล
// ========================================

function editRecord(
  record
) {

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
    record.image_url ||
    "";


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


  saveBtn.textContent =
    "💾 บันทึกการแก้ไข";


  window.scrollTo({

    top: 0,

    behavior:
      "smooth"

  });

}


// ========================================
// ลบข้อมูล
// ========================================

async function removeRecord(
  record
) {

  const moduleName =
    menuSelect.value;


  const confirmed =
    confirm(
      `ต้องการลบ "${record.title}" ใช่หรือไม่?`
    );


  if (!confirmed) {

    return;

  }


  try {

    await deleteRecord(
      moduleName,
      record.id
    );


    if (
      record.image_url
    ) {

      await deleteImage(
        record.image_url
      );

    }


    alert(
      "ลบข้อมูลเรียบร้อยแล้ว"
    );


    await refreshTable();

  }

  catch (error) {

    console.error(error);


    alert(
      "ไม่สามารถลบข้อมูลได้: " +
      error.message
    );

  }

}


// ========================================
// รีเซ็ตฟอร์ม
// ========================================

function resetForm() {

  crudForm.reset();


  recordId.value = "";


  currentImageUrl.value = "";


  imagePreview.src = "";


  imagePreviewContainer.style.display =
    "none";


  formTitle.textContent =
    "➕ เพิ่มข้อมูลใหม่";


  saveBtn.textContent =
    "💾 บันทึกข้อมูล";

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
// เปลี่ยนเมนู
// ========================================

menuSelect.addEventListener(
  "change",
  () => {

    resetForm();


    const moduleName =
      menuSelect.value;


    formTitle.textContent =
      `➕ เพิ่มข้อมูลใหม่: ${MODULE_NAMES[moduleName]}`;


    refreshTable();

  }
);


// ========================================
// Preview รูปภาพ
// ========================================

imageInput.addEventListener(
  "change",
  () => {

    const file =
      imageInput.files[0];


    if (!file) {

      imagePreview.src = "";


      imagePreviewContainer.style.display =
        "none";

      return;

    }


    const reader =
      new FileReader();


    reader.onload =
      event => {

        imagePreview.src =
          event.target.result;


        imagePreviewContainer.style.display =
          "block";

      };


    reader.readAsDataURL(
      file
    );

  }
);


// ========================================
// ป้องกัน XSS
// ========================================

function escapeHtml(
  value
) {

  const div =
    document.createElement(
      "div"
    );


  div.textContent =
    value || "";


  return div.innerHTML;

}


// ========================================
// ตัดข้อความ
// ========================================

function shortenText(
  text,
  maxLength
) {

  if (!text) {

    return "";

  }


  if (
    text.length <= maxLength
  ) {

    return text;

  }


  return (
    text.substring(
      0,
      maxLength
    ) + "..."
  );

}


// ========================================
// เริ่มต้นระบบ
// ========================================

async function init() {

  await checkAuth();


  formTitle.textContent =
    `➕ เพิ่มข้อมูลใหม่: ${
      MODULE_NAMES[
        menuSelect.value
      ]
    }`;


  await refreshTable();

}


init();
