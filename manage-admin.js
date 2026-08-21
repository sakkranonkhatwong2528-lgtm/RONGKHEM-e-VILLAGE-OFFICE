import supabaseClient from "./supabase-config.js";


// ========================================
// ตั้งค่าโมดูลทั้งหมด
// ========================================

const MODULES = {

  news: {
    table: "news",
    title: "📰 ข่าวสารประชาสัมพันธ์",
    detailField: "content",
    image: true,
    status: false,
    dateField: "published_at"
  },

  activities: {
    table: "activities",
    title: "🎉 กิจกรรม",
    detailField: "description",
    image: true,
    status: false,
    dateField: "event_date"
  },

  projects: {
    table: "projects",
    title: "📁 โครงการหมู่บ้าน",
    detailField: "description",
    image: true,
    status: true,
    dateField: null
  },

  incidents: {
    table: "incidents",
    title: "⚠️ เหตุการณ์ / แจ้งเตือน",
    detailField: "description",
    image: false,
    status: true,
    dateField: "incident_date"
  },

  complaints: {
    table: "complaints",
    title: "📢 เรื่องร้องเรียน",
    detailField: "detail",
    image: false,
    status: true,
    dateField: null
  },

  elderly: {
    table: "elderly",
    title: "👴 ข้อมูลผู้สูงอายุ",
    detailField: "description",
    image: true,
    status: false,
    dateField: null
  },

  vulnerable: {
    table: "vulnerable",
    title: "❤️ กลุ่มเปราะบาง",
    detailField: "description",
    image: true,
    status: false,
    dateField: null
  }

};


// ========================================
// ตัวแปร DOM
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

const statusInput =
  document.getElementById("statusInput");

const dateInput =
  document.getElementById("dateInput");

const imageInput =
  document.getElementById("imageInput");

const imagePreview =
  document.getElementById("imagePreview");

const imagePreviewContainer =
  document.getElementById("imagePreviewContainer");

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

const resetBtn =
  document.getElementById("resetBtn");

const logoutBtn =
  document.getElementById("logoutBtn");

const adminEmail =
  document.getElementById("adminEmail");


// ========================================
// โมดูลปัจจุบัน
// ========================================

function getCurrentModule() {

  return MODULES[menuSelect.value];

}


// ========================================
// ตรวจสอบ Login
// ========================================

async function checkLogin() {

  const {
    data,
    error
  } = await supabaseClient.auth.getUser();

  if (error || !data.user) {

    window.location.href = "login.html";

    return;

  }

  adminEmail.textContent =
    data.user.email;

}


// ========================================
// Logout
// ========================================

logoutBtn.addEventListener(
  "click",
  async () => {

    await supabaseClient.auth.signOut();

    window.location.href =
      "login.html";

  }
);


// ========================================
// แสดง/ซ่อน Field
// ========================================

function updateFormFields() {

  const module =
    getCurrentModule();


  formTitle.textContent =
    "➕ เพิ่ม " + module.title;

  listTitle.textContent =
    "📋 รายการ " + module.title;


  statusGroup.style.display =
    module.status ? "block" : "none";


  dateGroup.style.display =
    module.dateField ? "block" : "none";


  imageInput.parentElement.style.display =
    module.image ? "block" : "none";


  if (!module.image) {

    imagePreviewContainer.style.display =
      "none";

  }

}


// ========================================
// โหลดข้อมูล
// ========================================

async function loadRecords() {

  const module =
    getCurrentModule();


  tableBody.innerHTML = `
    <tr>
      <td colspan="6"
      style="text-align:center">
        กำลังโหลด...
      </td>
    </tr>
  `;


  const {
    data,
    error
  } = await supabaseClient
    .from(module.table)
    .select("*")
    .order("created_at", {
      ascending: false
    });


  if (error) {

    console.error(error);

    tableBody.innerHTML = `
      <tr>
        <td colspan="6"
        style="text-align:center;color:red">
          โหลดข้อมูลไม่สำเร็จ
        </td>
      </tr>
    `;

    return;

  }


  if (!data || data.length === 0) {

    tableBody.innerHTML = `
      <tr>
        <td colspan="6"
        style="text-align:center">
          ยังไม่มีข้อมูล
        </td>
      </tr>
    `;

    return;

  }


  tableBody.innerHTML = "";


  data.forEach(record => {

    const detail =
      record[module.detailField] || "";


    const statusOrDate =
      module.status
        ? (record.status || "-")
        : (
            module.dateField
              ? formatDate(
                  record[module.dateField]
                )
              : "-"
          );


    const image =
      record.image_url
        ? `
          <img
            src="${record.image_url}"
            class="img-preview"
            alt="รูปภาพ">
        `
        : "-";


    const tr =
      document.createElement("tr");


    tr.innerHTML = `

      <td>${record.id}</td>

      <td>
        ${image}
      </td>

      <td>
        ${escapeHtml(record.title)}
      </td>

      <td>
        ${escapeHtml(detail)}
      </td>

      <td>
        ${escapeHtml(statusOrDate)}
      </td>

      <td>

        <div class="action-buttons">

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

        </div>

      </td>

    `;


    tr.querySelector(".btn-edit")
      .addEventListener(
        "click",
        () => {

          editRecord(record);

        }
      );


    tr.querySelector(".btn-delete")
      .addEventListener(
        "click",
        () => {

          deleteRecord(record);

        }
      );


    tableBody.appendChild(tr);

  });

}


// ========================================
// แสดงรูป Preview
// ========================================

imageInput.addEventListener(
  "change",
  () => {

    const file =
      imageInput.files[0];


    if (!file) {

      imagePreviewContainer.style.display =
        "none";

      return;

    }


    const reader =
      new FileReader();


    reader.onload =
      function(event) {

        imagePreview.src =
          event.target.result;


        imagePreviewContainer.style.display =
          "block";

      };


    reader.readAsDataURL(file);

  }
);


// ========================================
// Upload รูป
// ========================================

async function uploadImage(file) {

  if (!file) {
    return null;
  }


  const extension =
    file.name.split(".").pop();


  const fileName =
    `uploads/${Date.now()}-${crypto.randomUUID()}.${extension}`;


  const {
    error
  } = await supabaseClient
    .storage
    .from("images")
    .upload(
      fileName,
      file,
      {
        upsert: false
      }
    );


  if (error) {

    console.error(error);

    throw error;

  }


  const {
    data
  } = supabaseClient
    .storage
    .from("images")
    .getPublicUrl(fileName);


  return data.publicUrl;

}


// ========================================
// บันทึกข้อมูล
// ========================================

crudForm.addEventListener(
  "submit",
  async event => {

    event.preventDefault();


    const module =
      getCurrentModule();


    const saveBtn =
      document.getElementById("saveBtn");


    saveBtn.disabled = true;

    saveBtn.textContent =
      "กำลังบันทึก...";


    try {

      const payload = {

        title:
          titleInput.value.trim()

      };


      // รายละเอียด

      payload[
        module.detailField
      ] =
        detailInput.value.trim();


      // สถานะ

      if (module.status) {

        payload.status =
          statusInput.value;

      }


      // วันที่

      if (module.dateField) {

        if (dateInput.value) {

          if (
            module.dateField ===
            "published_at"
          ) {

            payload.published_at =
              new Date(
                dateInput.value
              ).toISOString();

          }

          else if (
            module.dateField ===
            "incident_date"
          ) {

            payload.incident_date =
              new Date(
                dateInput.value
              ).toISOString();

          }

          else {

            payload[
              module.dateField
            ] =
              dateInput.value;

          }

        }

      }


      // รูปภาพ

      if (module.image) {

        const file =
          imageInput.files[0];


        let imageUrl =
          currentImageUrl.value || null;


        if (file) {

          imageUrl =
            await uploadImage(file);

        }


        payload.image_url =
          imageUrl;

      }


      // เพิ่มข้อมูล

      if (!recordId.value) {

        const {
          error
        } = await supabaseClient
          .from(module.table)
          .insert([payload]);


        if (error) {
          throw error;
        }


        alert(
          "บันทึกข้อมูลสำเร็จ"
        );

      }


      // แก้ไขข้อมูล

      else {

        const {
          error
        } = await supabaseClient
          .from(module.table)
          .update(payload)
          .eq(
            "id",
            recordId.value
          );


        if (error) {
          throw error;
        }


        alert(
          "แก้ไขข้อมูลสำเร็จ"
        );

      }


      resetForm();

      loadRecords();

    }


    catch(error) {

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
// แก้ไขข้อมูล
// ========================================

function editRecord(record) {

  const module =
    getCurrentModule();


  recordId.value =
    record.id;


  titleInput.value =
    record.title || "";


  detailInput.value =
    record[
      module.detailField
    ] || "";


  if (module.status) {

    statusInput.value =
      record.status || "";

  }


  if (
    module.dateField &&
    record[module.dateField]
  ) {

    const date =
      new Date(
        record[module.dateField]
      );


    if (
      module.dateField ===
      "event_date"
    ) {

      dateInput.value =
        record[module.dateField];

    }

    else {

      dateInput.value =
        date.toISOString()
          .split("T")[0];

    }

  }


  if (
    module.image &&
    record.image_url
  ) {

    currentImageUrl.value =
      record.image_url;


    imagePreview.src =
      record.image_url;


    imagePreviewContainer.style.display =
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
// ลบข้อมูล
// ========================================

async function deleteRecord(record) {

  const module =
    getCurrentModule();


  const confirmDelete =
    confirm(
      `ต้องการลบ "${record.title}" ใช่หรือไม่?`
    );


  if (!confirmDelete) {
    return;
  }


  try {

    const {
      error
    } = await supabaseClient
      .from(module.table)
      .delete()
      .eq(
        "id",
        record.id
      );


    if (error) {
      throw error;
    }


    alert(
      "ลบข้อมูลสำเร็จ"
    );


    loadRecords();

  }


  catch(error) {

    console.error(error);

    alert(
      "ลบข้อมูลไม่สำเร็จ: " +
      error.message
    );

  }

}


// ========================================
// Reset Form
// ========================================

function resetForm() {

  crudForm.reset();


  recordId.value = "";


  currentImageUrl.value = "";


  imagePreview.src = "";


  imagePreviewContainer.style.display =
    "none";


  updateFormFields();

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

    loadRecords();

  }
);


// ========================================
// ป้องกัน XSS
// ========================================

function escapeHtml(value) {

  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }


  return String(value)

    .replace(
      /&/g,
      "&amp;"
    )

    .replace(
      /</g,
      "&lt;"
    )

    .replace(
      />/g,
      "&gt;"
    )

    .replace(
      /"/g,
      "&quot;"
    )

    .replace(
      /'/g,
      "&#039;"
    );

}


// ========================================
// แปลงวันที่
// ========================================

function formatDate(value) {

  if (!value) {
    return "-";
  }


  const date =
    new Date(value);


  if (
    Number.isNaN(
      date.getTime()
    )
  ) {

    return value;

  }


  return date.toLocaleDateString(
    "th-TH",
    {
      year: "numeric",
      month: "short",
      day: "numeric"
    }
  );

}


// ========================================
// เริ่มระบบ
// ========================================

async function init() {

  await checkLogin();

  updateFormFields();

  await loadRecords();

}


init();
