import supabaseClient from "./supabase-config.js";

import {
  loadRecords,
  createRecord,
  updateRecord,
  deleteRecord,
  uploadImage
} from "./supabase-service.js";


// ========================================
// DOM ELEMENTS
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

const currentImageUrl =
  document.getElementById("currentImageUrl");

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

const imagePreviewContainer =
  document.getElementById(
    "imagePreviewContainer"
  );

const imagePreview =
  document.getElementById(
    "imagePreview"
  );

const resetBtn =
  document.getElementById("resetBtn");

const tableBody =
  document.getElementById("tableBody");

const formTitle =
  document.getElementById("formTitle");

const listTitle =
  document.getElementById("listTitle");

const statusGroup =
  document.getElementById("statusGroup");

const dateGroup =
  document.getElementById("dateGroup");

const saveBtn =
  document.getElementById("saveBtn");


// ========================================
// MODULE LABELS
// ========================================

const MODULE_LABELS = {

  news:
    "ข่าวสารประชาสัมพันธ์",

  activity:
    "กิจกรรม",

  project:
    "โครงการหมู่บ้าน",

  incident:
    "เหตุการณ์ / แจ้งเตือน",

  complaint:
    "เรื่องร้องเรียน",

  elderly:
    "ข้อมูลผู้สูงอายุ",

  vulnerable:
    "กลุ่มเปราะบาง"

};


// ========================================
// CHECK LOGIN
// ========================================

async function checkLogin() {

  const {
    data,
    error
  } =
    await supabaseClient
      .auth
      .getUser();


  if (error) {

    console.error(error);

  }


  const user =
    data?.user;


  if (!user) {

    window.location.href =
      "./แอดมินล็อกอิน.html";

    return;

  }


  adminEmail.textContent =
    user.email || "ผู้ดูแลระบบ";

}


// ========================================
// LOGOUT
// ========================================

logoutBtn.addEventListener(
  "click",
  async () => {

    const confirmLogout =
      confirm(
        "ต้องการออกจากระบบหรือไม่?"
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

      console.error(error);

      alert(
        "เกิดข้อผิดพลาดในการออกจากระบบ"
      );

      return;

    }


    window.location.href =
      "./แอดมินล็อกอิน.html";

  }
);


// ========================================
// GET CURRENT MODULE
// ========================================

function getCurrentModule() {

  return menuSelect.value;

}


// ========================================
// GET MODULE LABEL
// ========================================

function getModuleLabel() {

  const module =
    getCurrentModule();


  return (
    MODULE_LABELS[module]
    ||
    module
  );

}


// ========================================
// UPDATE FORM UI
// ========================================

function updateFormUI() {

  const module =
    getCurrentModule();


  const label =
    getModuleLabel();


  formTitle.textContent =
    `➕ เพิ่ม${label}`;


  listTitle.textContent =
    `📋 รายการ${label}`;


  // ซ่อนทั้งหมดก่อน

  statusGroup.style.display =
    "none";

  dateGroup.style.display =
    "none";


  // ============================
  // NEWS
  // ============================

  if (
    module === "news"
  ) {

    dateGroup.style.display =
      "block";

  }


  // ============================
  // PROJECT
  // ============================

  if (
    module === "project"
  ) {

    statusGroup.style.display =
      "block";

  }


  // ============================
  // INCIDENT
  // ============================

  if (
    module === "incident"
  ) {

    statusGroup.style.display =
      "block";

    dateGroup.style.display =
      "block";

  }


  // ============================
  // COMPLAINT
  // ============================

  if (
    module === "complaint"
  ) {

    statusGroup.style.display =
      "block";

  }

}


// ========================================
// RESET FORM
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
    `➕ เพิ่ม${getModuleLabel()}`;


  saveBtn.textContent =
    "💾 บันทึกข้อมูล";

}


// ========================================
// CHANGE MENU
// ========================================

menuSelect.addEventListener(
  "change",
  async () => {

    resetForm();

    updateFormUI();

    await renderTable();

  }
);


// ========================================
// IMAGE PREVIEW
// ========================================

imageInput.addEventListener(
  "change",
  () => {

    const file =
      imageInput.files[0];


    if (!file) {

      return;

    }


    const imageUrl =
      URL.createObjectURL(
        file
      );


    imagePreview.src =
      imageUrl;


    imagePreviewContainer.style.display =
      "block";

  }
);


// ========================================
// RESET BUTTON
// ========================================

resetBtn.addEventListener(
  "click",
  () => {

    resetForm();

  }
);


// ========================================
// BUILD PAYLOAD
// ========================================

function buildPayload(
  imageUrl
) {

  const module =
    getCurrentModule();


  const payload = {

    title:
      titleInput.value.trim()

  };


  // ============================
  // NEWS
  // ============================

  if (
    module === "news"
  ) {

    payload.content =
      detailInput.value.trim();

    payload.image_url =
      imageUrl;

    if (
      dateInput.value
    ) {

      payload.published_at =
        dateInput.value;

    }

  }


  // ============================
  // ACTIVITY
  // ============================

  if (
    module === "activity"
  ) {

    payload.description =
      detailInput.value.trim();

    payload.image_url =
      imageUrl;

  }


  // ============================
  // PROJECT
  // ============================

  if (
    module === "project"
  ) {

    payload.description =
      detailInput.value.trim();

    payload.status =
      statusInput.value;

    payload.image_url =
      imageUrl;

  }


  // ============================
  // INCIDENT
  // ============================

  if (
    module === "incident"
  ) {

    payload.description =
      detailInput.value.trim();

    payload.status =
      statusInput.value;

    if (
      dateInput.value
    ) {

      payload.incident_date =
        dateInput.value;

    }

  }


  // ============================
  // COMPLAINT
  // ============================

  if (
    module === "complaint"
  ) {

    payload.detail =
      detailInput.value.trim();

    payload.status =
      statusInput.value;

  }


  // ============================
  // ELDERLY
  // ============================

  if (
    module === "elderly"
  ) {

    payload.description =
      detailInput.value.trim();

    payload.image_url =
      imageUrl;

  }


  // ============================
  // VULNERABLE
  // ============================

  if (
    module === "vulnerable"
  ) {

    payload.description =
      detailInput.value.trim();

    payload.image_url =
      imageUrl;

  }


  return payload;

}


// ========================================
// SAVE DATA
// ========================================

crudForm.addEventListener(
  "submit",
  async (event) => {

    event.preventDefault();


    const module =
      getCurrentModule();


    const id =
      recordId.value;


    try {

      saveBtn.disabled =
        true;


      saveBtn.textContent =
        "กำลังบันทึก...";


      let imageUrl =
        currentImageUrl.value
        ||
        null;


      const file =
        imageInput.files[0];


      // ============================
      // UPLOAD IMAGE
      // ============================

      if (
        file
      ) {

        imageUrl =
          await uploadImage(
            file
          );

      }


      const payload =
        buildPayload(
          imageUrl
        );


      // ============================
      // CREATE
      // ============================

      if (
        !id
      ) {

        await createRecord(
          module,
          payload
        );


        alert(
          "บันทึกข้อมูลเรียบร้อยแล้ว"
        );

      }


      // ============================
      // UPDATE
      // ============================

      else {

        await updateRecord(
          module,
          id,
          payload
        );


        alert(
          "แก้ไขข้อมูลเรียบร้อยแล้ว"
        );

      }


      resetForm();


      await renderTable();

    }


    catch (
      error
    ) {

      console.error(error);


      alert(
        "เกิดข้อผิดพลาด: "
        +
        (
          error.message
          ||
          "ไม่สามารถบันทึกข้อมูลได้"
        )
      );

    }


    finally {

      saveBtn.disabled =
        false;


      saveBtn.textContent =
        "💾 บันทึกข้อมูล";

    }

  }
);


// ========================================
// RENDER TABLE
// ========================================

async function renderTable() {

  const module =
    getCurrentModule();


  tableBody.innerHTML =
    `
      <tr>
        <td
          colspan="6"
          style="text-align:center">
          กำลังโหลดข้อมูล...
        </td>
      </tr>
    `;


  try {

    const records =
      await loadRecords(
        module
      );


    if (
      !records.length
    ) {

      tableBody.innerHTML =
        `
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
      "";


    records.forEach(
      (record) => {

        const tr =
          document.createElement(
            "tr"
          );


        const imageUrl =
          record.image_url
          ||
          "";


        const imageHtml =
          imageUrl
            ?
            `
              <img
                src="${escapeHtml(imageUrl)}"
                class="img-preview"
                alt="รูปภาพ">
            `
            :
            "-";


        const detail =
          record.content
          ||
          record.description
          ||
          record.detail
          ||
          "-";


        const statusOrDate =
          record.status
          ||
          record.published_at
          ||
          record.incident_date
          ||
          "-";


        tr.innerHTML =
          `
            <td>
              ${escapeHtml(
                String(
                  record.id
                )
              )}
            </td>

            <td>
              ${imageHtml}
            </td>

            <td>
              ${escapeHtml(
                record.title
                ||
                "-"
              )}
            </td>

            <td>
              ${escapeHtml(
                detail
              )}
            </td>

            <td>
              ${escapeHtml(
                String(
                  statusOrDate
                )
              )}
            </td>

            <td>

              <div
                class="action-buttons">

                <button
                  type="button"
                  class="btn-edit">

                  ✏️ แก้ไข

                </button>

                <button
                  type="button"
                  class="btn-delete">

                  🗑 ลบ

                </button>

              </div>

            </td>
          `;


        // ============================
        // EDIT
        // ============================

        const editButton =
          tr.querySelector(
            ".btn-edit"
          );


        editButton.addEventListener(
          "click",
          () => {

            editRecord(
              record
            );

          }
        );


        // ============================
        // DELETE
        // ============================

        const deleteButton =
          tr.querySelector(
            ".btn-delete"
          );


        deleteButton.addEventListener(
          "click",
          async () => {

            await removeRecord(
              record.id
            );

          }
        );


        tableBody.appendChild(
          tr
        );

      }
    );

  }


  catch (
    error
  ) {

    console.error(error);


    tableBody.innerHTML =
      `
        <tr>
          <td
            colspan="6"
            style="text-align:center;color:red">

            เกิดข้อผิดพลาด:
            ${escapeHtml(
              error.message
              ||
              "ไม่สามารถโหลดข้อมูลได้"
            )}

          </td>
        </tr>
      `;

  }

}


// ========================================
// EDIT RECORD
// ========================================

function editRecord(
  record
) {

  recordId.value =
    record.id
    ||
    "";


  titleInput.value =
    record.title
    ||
    "";


  detailInput.value =
    record.content
    ||
    record.description
    ||
    record.detail
    ||
    "";


  statusInput.value =
    record.status
    ||
    "";


  // ============================
  // DATE
  // ============================

  let dateValue =
    record.published_at
    ||
    record.incident_date
    ||
    "";


  if (
    dateValue
  ) {

    dateValue =
      String(
        dateValue
      )
      .slice(
        0,
        10
      );

  }


  dateInput.value =
    dateValue;


  // ============================
  // IMAGE
  // ============================

  const imageUrl =
    record.image_url
    ||
    "";


  currentImageUrl.value =
    imageUrl;


  if (
    imageUrl
  ) {

    imagePreview.src =
      imageUrl;


    imagePreviewContainer.style.display =
      "block";

  }


  else {

    imagePreview.src =
      "";


    imagePreviewContainer.style.display =
      "none";

  }


  formTitle.textContent =
    `✏️ แก้ไข${getModuleLabel()}`;


  saveBtn.textContent =
    "💾 บันทึกการแก้ไข";


  window.scrollTo({

    top: 0,

    behavior:
      "smooth"

  });

}


// ========================================
// DELETE RECORD
// ========================================

async function removeRecord(
  id
) {

  const confirmDelete =
    confirm(
      "คุณต้องการลบข้อมูลนี้ใช่หรือไม่?"
    );


  if (
    !confirmDelete
  ) {

    return;

  }


  const module =
    getCurrentModule();


  try {

    await deleteRecord(
      module,
      id
    );


    alert(
      "ลบข้อมูลเรียบร้อยแล้ว"
    );


    resetForm();


    await renderTable();

  }


  catch (
    error
  ) {

    console.error(error);


    alert(
      "ไม่สามารถลบข้อมูลได้: "
      +
      (
        error.message
        ||
        "เกิดข้อผิดพลาด"
      )
    );

  }

}


// ========================================
// ESCAPE HTML
// ========================================

function escapeHtml(
  value
) {

  const div =
    document.createElement(
      "div"
    );


  div.textContent =
    value
    ??
    "";


  return div.innerHTML;

}


// ========================================
// INITIALIZE
// ========================================

async function init() {

  await checkLogin();


  updateFormUI();


  await renderTable();

}


init();
