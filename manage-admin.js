import supabaseClient from "./supabase-config.js";

// ========================================
// กำหนดตารางให้ตรงกับ value ใน manage.html
// ========================================

const MODULES = {
  news: {
    table: "news",
    title: "ข่าวสารประชาสัมพันธ์",
    detailField: "content",
    imageField: "image_url"
  },

  complaint: {
    table: "complaints",
    title: "เรื่องร้องเรียน",
    detailField: "detail",
    imageField: null
  },

  elderly: {
    table: "elderly",
    title: "ข้อมูลผู้สูงอายุ",
    detailField: "description",
    imageField: "image_url"
  },

  vulnerable: {
    table: "vulnerable",
    title: "กลุ่มเปราะบาง",
    detailField: "description",
    imageField: "image_url"
  },

  project: {
    table: "projects",
    title: "โครงการหมู่บ้าน",
    detailField: "description",
    imageField: "image_url"
  },

  incident: {
    table: "incidents",
    title: "เหตุการณ์ / แจ้งเตือน",
    detailField: "description",
    imageField: null
  },

  activity: {
    table: "activities",
    title: "กิจกรรม",
    detailField: "description",
    imageField: "image_url"
  }
};


// ========================================
// ELEMENTS
// ========================================

const menuSelect = document.getElementById("menuSelect");
const crudForm = document.getElementById("crudForm");

const recordId = document.getElementById("recordId");
const currentImageUrl =
  document.getElementById("currentImageUrl");

const titleInput =
  document.getElementById("titleInput");

const detailInput =
  document.getElementById("detailInput");

const imageInput =
  document.getElementById("imageInput");

const tableBody =
  document.getElementById("tableBody");

const formTitle =
  document.getElementById("formTitle");

const resetBtn =
  document.getElementById("resetBtn");

const logoutBtn =
  document.getElementById("logoutBtn");

const adminEmail =
  document.getElementById("adminEmail");

const imagePreview =
  document.getElementById("imagePreview");

const imagePreviewContainer =
  document.getElementById(
    "imagePreviewContainer"
  );


// ========================================
// ตรวจสอบ LOGIN
// ========================================

async function checkAuth() {

  const {
    data,
    error
  } =
    await supabaseClient.auth.getUser();

  if (error || !data.user) {

    window.location.href =
      "admin-login.html";

    return;
  }

  adminEmail.textContent =
    data.user.email;
}


// ========================================
// GET MODULE
// ========================================

function getCurrentModule() {

  return MODULES[
    menuSelect.value
  ];
}


// ========================================
// LOAD DATA
// ========================================

async function loadData() {

  const module =
    getCurrentModule();

  tableBody.innerHTML = `
    <tr>
      <td colspan="5"
      style="text-align:center">
      กำลังโหลดข้อมูล...
      </td>
    </tr>
  `;

  const {
    data,
    error
  } =
    await supabaseClient
      .from(module.table)
      .select("*")
      .order(
        "created_at",
        {
          ascending: false
        }
      );

  if (error) {

    console.error(error);

    tableBody.innerHTML = `
      <tr>
        <td colspan="5">
        ❌ ${error.message}
        </td>
      </tr>
    `;

    return;
  }

  if (!data || data.length === 0) {

    tableBody.innerHTML = `
      <tr>
        <td colspan="5"
        style="text-align:center">
        ยังไม่มีข้อมูล
        </td>
      </tr>
    `;

    return;
  }

  tableBody.innerHTML =
    data.map(record => {

      const detail =
        record[module.detailField] || "";

      const image =
        module.imageField
          ? record[module.imageField]
          : null;

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
                class="img-preview">
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
          onclick="editRecord(${record.id})">

          ✏️ แก้ไข

          </button>

          <button
          class="btn-delete"
          onclick="deleteRecord(${record.id})">

          🗑 ลบ

          </button>

        </td>

      </tr>

      `;

    }).join("");

  window.currentRecords = data;
}


// ========================================
// SAVE
// ========================================

crudForm.addEventListener(
  "submit",
  async function(event) {

    event.preventDefault();

    const module =
      getCurrentModule();

    const payload = {

      title:
        titleInput.value.trim()

    };

    payload[
      module.detailField
    ] =
      detailInput.value.trim();


    // ==========================
    // UPLOAD IMAGE
    // ==========================

    if (
      module.imageField &&
      imageInput.files.length > 0
    ) {

      const file =
        imageInput.files[0];

      const extension =
        file.name.split(".").pop();

      const fileName =
        `${Date.now()}-${crypto.randomUUID()}.${extension}`;

      const {
        error: uploadError
      } =
        await supabaseClient
          .storage
          .from("images")
          .upload(
            fileName,
            file
          );

      if (uploadError) {

        alert(
          "อัปโหลดรูปไม่สำเร็จ: " +
          uploadError.message
        );

        return;
      }

      const {
        data
      } =
        supabaseClient
          .storage
          .from("images")
          .getPublicUrl(
            fileName
          );

      payload[
        module.imageField
      ] =
        data.publicUrl;

    } else if (
      module.imageField &&
      currentImageUrl.value
    ) {

      payload[
        module.imageField
      ] =
        currentImageUrl.value;

    }


    // ==========================
    // CREATE / UPDATE
    // ==========================

    let error;

    if (recordId.value) {

      ({
        error
      } =
        await supabaseClient
          .from(module.table)
          .update(payload)
          .eq(
            "id",
            recordId.value
          ));

    } else {

      ({
        error
      } =
        await supabaseClient
          .from(module.table)
          .insert(payload));

    }


    if (error) {

      console.error(error);

      alert(
        "เกิดข้อผิดพลาด: " +
        error.message
      );

      return;
    }


    alert(
      "บันทึกข้อมูลเรียบร้อย"
    );

    resetForm();

    loadData();

  }
);


// ========================================
// EDIT
// ========================================

window.editRecord =
  function(id) {

    const module =
      getCurrentModule();

    const record =
      window.currentRecords.find(
        item =>
          item.id === id
      );

    if (!record) return;

    recordId.value =
      record.id;

    titleInput.value =
      record.title || "";

    detailInput.value =
      record[
        module.detailField
      ] || "";


    if (
      module.imageField &&
      record[
        module.imageField
      ]
    ) {

      currentImageUrl.value =
        record[
          module.imageField
        ];

      imagePreview.src =
        currentImageUrl.value;

      imagePreviewContainer.style.display =
        "block";

    }

    formTitle.textContent =
      "✏️ แก้ไขข้อมูล";

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  };


// ========================================
// DELETE
// ========================================

window.deleteRecord =
  async function(id) {

    const confirmDelete =
      confirm(
        "ต้องการลบข้อมูลนี้หรือไม่?"
      );

    if (!confirmDelete) return;

    const module =
      getCurrentModule();

    const {
      error
    } =
      await supabaseClient
        .from(module.table)
        .delete()
        .eq(
          "id",
          id
        );

    if (error) {

      alert(
        "ลบไม่สำเร็จ: " +
        error.message
      );

      return;
    }

    alert(
      "ลบข้อมูลเรียบร้อย"
    );

    loadData();

  };


// ========================================
// RESET FORM
// ========================================

function resetForm() {

  crudForm.reset();

  recordId.value = "";

  currentImageUrl.value = "";

  imagePreviewContainer.style.display =
    "none";

  formTitle.textContent =
    "➕ เพิ่มข้อมูลใหม่";

}


// ========================================
// PREVIEW IMAGE
// ========================================

imageInput.addEventListener(
  "change",
  function() {

    const file =
      this.files[0];

    if (!file) return;

    imagePreview.src =
      URL.createObjectURL(
        file
      );

    imagePreviewContainer.style.display =
      "block";

  }
);


// ========================================
// CHANGE MODULE
// ========================================

menuSelect.addEventListener(
  "change",
  function() {

    resetForm();

    loadData();

  }
);


// ========================================
// RESET BUTTON
// ========================================

resetBtn.addEventListener(
  "click",
  resetForm
);


// ========================================
// LOGOUT
// ========================================

logoutBtn.addEventListener(
  "click",
  async function() {

    await supabaseClient
      .auth
      .signOut();

    window.location.href =
      "admin-login.html";

  }
);


// ========================================
// ESCAPE HTML
// ========================================

function escapeHtml(text) {

  const div =
    document.createElement("div");

  div.textContent = text;

  return div.innerHTML;

}


// ========================================
// START
// ========================================

async function init() {

  await checkAuth();

  await loadData();

}

init();
