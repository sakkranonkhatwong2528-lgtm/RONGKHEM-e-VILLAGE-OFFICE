import supabaseClient from "./supabase-config.js";
import { requireAdmin, logout } from "./assets/js/auth.js";

// ========================================
// กำหนดเมนูให้ตรงกับ HTML
// ========================================

const MODULES = {
  news: {
    table: "news",
    title: "title",
    detail: "content",
    image: "image_url"
  },

  complaint: {
    table: "complaints",
    title: "title",
    detail: "detail",
    image: null
  },

  elderly: {
    table: "elderly",
    title: "name",
    detail: "detail",
    image: null
  },

  vulnerable: {
    table: "vulnerable",
    title: "name",
    detail: "detail",
    image: null
  },

  project: {
    table: "projects",
    title: "title",
    detail: "description",
    image: "image_url"
  },

  incident: {
    table: "incidents",
    title: "title",
    detail: "description",
    image: null
  },

  activity: {
    table: "activities",
    title: "title",
    detail: "description",
    image: "image_url"
  }
};

// ========================================
// Elements
// ========================================

const menuSelect = document.querySelector("#menuSelect");
const crudForm = document.querySelector("#crudForm");
const recordId = document.querySelector("#recordId");
const currentImageUrl = document.querySelector("#currentImageUrl");
const titleInput = document.querySelector("#titleInput");
const detailInput = document.querySelector("#detailInput");
const imageInput = document.querySelector("#imageInput");
const imagePreview = document.querySelector("#imagePreview");
const imagePreviewContainer = document.querySelector("#imagePreviewContainer");
const tableBody = document.querySelector("#tableBody");
const resetBtn = document.querySelector("#resetBtn");
const logoutBtn = document.querySelector("#logoutBtn");
const adminEmail = document.querySelector("#adminEmail");
const formTitle = document.querySelector("#formTitle");

// ========================================
// Module ปัจจุบัน
// ========================================

function getCurrentModule() {
  return MODULES[menuSelect.value];
}

// ========================================
// Login
// ========================================

async function checkAdmin() {
  const user = await requireAdmin();

  if (!user) return;

  adminEmail.textContent = user.email;
}

// ========================================
// โหลดข้อมูล
// ========================================

async function loadData() {
  const module = getCurrentModule();

  tableBody.innerHTML = `
    <tr>
      <td colspan="5" style="text-align:center">
        กำลังโหลด...
      </td>
    </tr>
  `;

  try {
    const { data, error } = await supabaseClient
      .from(module.table)
      .select("*")
      .order("id", { ascending: false });

    if (error) throw error;

    renderTable(data || [], module);

  } catch (error) {
    console.error(error);

    tableBody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center;color:red">
          โหลดข้อมูลไม่สำเร็จ: ${escapeHtml(error.message)}
        </td>
      </tr>
    `;
  }
}

// ========================================
// แสดงตาราง
// ========================================

function renderTable(data, module) {
  if (!data.length) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center">
          ยังไม่มีข้อมูล
        </td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = data.map(item => {
    const title = item[module.title] || "";
    const detail = item[module.detail] || "";
    const image = module.image ? item[module.image] : null;

    return `
      <tr>
        <td>${item.id}</td>

        <td>
          ${
            image
              ? `<img src="${escapeHtml(image)}" class="img-preview">`
              : "-"
          }
        </td>

        <td>${escapeHtml(title)}</td>

        <td>${escapeHtml(detail)}</td>

        <td>
          <button
            type="button"
            class="btn-edit"
            data-id="${item.id}">
            ✏️ แก้ไข
          </button>

          <button
            type="button"
            class="btn-delete"
            data-id="${item.id}">
            🗑 ลบ
          </button>
        </td>
      </tr>
    `;
  }).join("");
}

// ========================================
// บันทึก
// ========================================

crudForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const module = getCurrentModule();

  const payload = {
    [module.title]: titleInput.value.trim(),
    [module.detail]: detailInput.value.trim()
  };

  try {
    // อัปโหลดรูปใหม่
    if (module.image && imageInput.files[0]) {
      const file = imageInput.files[0];

      const safeName = file.name.replace(/[^\w.\-]/g, "_");

      const fileName =
        `${Date.now()}-${crypto.randomUUID()}-${safeName}`;

      const { error: uploadError } = await supabaseClient
        .storage
        .from("images")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabaseClient
        .storage
        .from("images")
        .getPublicUrl(fileName);

      payload[module.image] = urlData.publicUrl;
    }

    // ใช้รูปเดิม
    else if (module.image && currentImageUrl.value) {
      payload[module.image] = currentImageUrl.value;
    }

    // แก้ไข
    if (recordId.value) {
      const { error } = await supabaseClient
        .from(module.table)
        .update(payload)
        .eq("id", recordId.value);

      if (error) throw error;

      alert("แก้ไขข้อมูลเรียบร้อย");

    } else {
      // เพิ่มใหม่
      const { error } = await supabaseClient
        .from(module.table)
        .insert([payload]);

      if (error) throw error;

      alert("บันทึกข้อมูลเรียบร้อย");
    }

    resetForm();
    await loadData();

  } catch (error) {
    console.error(error);
    alert(`เกิดข้อผิดพลาด: ${error.message}`);
  }
});

// ========================================
// แก้ไข / ลบ
// ========================================

tableBody.addEventListener("click", async (event) => {
  const editButton = event.target.closest(".btn-edit");
  const deleteButton = event.target.closest(".btn-delete");

  const module = getCurrentModule();

  // แก้ไข
  if (editButton) {
    const id = editButton.dataset.id;

    try {
      const { data, error } = await supabaseClient
        .from(module.table)
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      recordId.value = data.id;
      titleInput.value = data[module.title] || "";
      detailInput.value = data[module.detail] || "";

      if (module.image && data[module.image]) {
        currentImageUrl.value = data[module.image];
        imagePreview.src = data[module.image];
        imagePreviewContainer.style.display = "block";
      }

      formTitle.textContent = "✏️ แก้ไขข้อมูล";

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

    } catch (error) {
      alert(`โหลดข้อมูลไม่สำเร็จ: ${error.message}`);
    }
  }

  // ลบ
  if (deleteButton) {
    const id = deleteButton.dataset.id;

    if (!confirm("ต้องการลบข้อมูลนี้ใช่หรือไม่?")) {
      return;
    }

    try {
      const { error } = await supabaseClient
        .from(module.table)
        .delete()
        .eq("id", id);

      if (error) throw error;

      alert("ลบข้อมูลเรียบร้อย");

      await loadData();

    } catch (error) {
      alert(`ลบข้อมูลไม่สำเร็จ: ${error.message}`);
    }
  }
});

// ========================================
// Preview รูป
// ========================================

imageInput.addEventListener("change", () => {
  const file = imageInput.files[0];

  if (!file) return;

  imagePreview.src = URL.createObjectURL(file);
  imagePreviewContainer.style.display = "block";
});

// ========================================
// Reset
// ========================================

function resetForm() {
  crudForm.reset();

  recordId.value = "";
  currentImageUrl.value = "";

  imagePreview.removeAttribute("src");
  imagePreviewContainer.style.display = "none";

  formTitle.textContent = "➕ เพิ่มข้อมูลใหม่";
}

resetBtn.addEventListener("click", resetForm);

// ========================================
// เปลี่ยนเมนู
// ========================================

menuSelect.addEventListener("change", async () => {
  resetForm();
  await loadData();
});

// ========================================
// Logout
// ========================================

logoutBtn.addEventListener("click", async () => {
  if (confirm("ต้องการออกจากระบบใช่หรือไม่?")) {
    await logout();
  }
});

// ========================================
// ป้องกัน HTML
// ========================================

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// ========================================
// เริ่มระบบ
// ========================================

await checkAdmin();
await loadData();
