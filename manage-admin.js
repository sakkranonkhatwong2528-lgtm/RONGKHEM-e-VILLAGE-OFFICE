import { supabase } from './supabase-config.js';

// ================================
// DOM
// ================================

const adminEmail = document.getElementById('adminEmail');
const logoutBtn = document.getElementById('logoutBtn');

const menuSelect = document.getElementById('menuSelect');
const crudForm = document.getElementById('crudForm');

const recordId = document.getElementById('recordId');
const currentImageUrl = document.getElementById('currentImageUrl');

const titleInput = document.getElementById('titleInput');
const detailInput = document.getElementById('detailInput');
const imageInput = document.getElementById('imageInput');

const imagePreview = document.getElementById('imagePreview');
const imagePreviewContainer =
    document.getElementById('imagePreviewContainer');

const tableBody = document.getElementById('tableBody');
const formTitle = document.getElementById('formTitle');
const resetBtn = document.getElementById('resetBtn');
const saveBtn = document.getElementById('saveBtn');


// ================================
// ตรวจสอบ Login
// ================================

async function checkLogin() {

    const {
        data: { user },
        error
    } = await supabase.auth.getUser();

    if (error || !user) {
        window.location.href = 'login.html';
        return false;
    }

    adminEmail.textContent = user.email;

    return true;
}


// ================================
// โหลดข้อมูล
// ================================

async function loadData() {

    const tableName = menuSelect.value;

    tableBody.innerHTML = `
        <tr>
            <td colspan="5" style="text-align:center">
                กำลังโหลดข้อมูล...
            </td>
        </tr>
    `;

    const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .order('id', {
            ascending: false
        });

    if (error) {

        console.error(error);

        tableBody.innerHTML = `
            <tr>
                <td colspan="5"
                    style="text-align:center;color:red">
                    โหลดข้อมูลไม่สำเร็จ:<br>
                    ${escapeHtml(error.message)}
                </td>
            </tr>
        `;

        return;
    }

    renderTable(data || []);
}


// ================================
// แสดงตาราง
// ================================

function renderTable(data) {

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

    tableBody.innerHTML = '';

    data.forEach(item => {

        const imageHtml = item.image_url
            ? `
                <img
                    src="${item.image_url}"
                    class="img-preview"
                    alt="รูปภาพ"
                >
            `
            : 'ไม่มีรูป';

        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${item.id}</td>

            <td>${imageHtml}</td>

            <td>
                ${escapeHtml(item.title || '')}
            </td>

            <td>
                ${escapeHtml(item.detail || '')}
            </td>

            <td style="text-align:center">

                <button
                    type="button"
                    class="btn-edit">
                    ✏️ แก้ไข
                </button>

                <button
                    type="button"
                    class="btn-delete">
                    🗑️ ลบ
                </button>

            </td>
        `;

        row.querySelector('.btn-edit')
            .addEventListener('click', () => {
                editData(item);
            });

        row.querySelector('.btn-delete')
            .addEventListener('click', () => {
                deleteData(item);
            });

        tableBody.appendChild(row);
    });
}


// ================================
// Preview รูป
// ================================

imageInput.addEventListener('change', () => {

    const file = imageInput.files[0];

    if (!file) return;

    imagePreview.src = URL.createObjectURL(file);

    imagePreviewContainer.style.display = 'block';
});


// ================================
// Upload รูป
// ================================

async function uploadImage(file) {

    if (!file) {
        return currentImageUrl.value || null;
    }

    const extension =
        file.name.split('.').pop();

    const fileName =
        `${Date.now()}-${crypto.randomUUID()}.${extension}`;

    const filePath =
        `uploads/${fileName}`;

    const { error } =
        await supabase.storage
            .from('village-images')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            });

    if (error) {
        throw new Error(
            'อัปโหลดรูปไม่สำเร็จ: ' +
            error.message
        );
    }

    const { data } =
        supabase.storage
            .from('village-images')
            .getPublicUrl(filePath);

    return data.publicUrl;
}


// ================================
// บันทึก
// เพิ่ม / แก้ไข
// ================================

crudForm.addEventListener(
    'submit',
    async event => {

        event.preventDefault();

        const tableName = menuSelect.value;
        const id = recordId.value;

        saveBtn.disabled = true;
        saveBtn.textContent = 'กำลังบันทึก...';

        try {

            const imageUrl =
                await uploadImage(
                    imageInput.files[0]
                );

            const payload = {
                title: titleInput.value.trim(),
                detail: detailInput.value.trim(),
                image_url: imageUrl
            };

            let error;

            // แก้ไข
            if (id) {

                const result = await supabase
                    .from(tableName)
                    .update(payload)
                    .eq('id', id);

                error = result.error;

            }

            // เพิ่ม
            else {

                const result = await supabase
                    .from(tableName)
                    .insert([payload]);

                error = result.error;
            }

            if (error) {
                throw error;
            }

            alert(
                id
                    ? 'แก้ไขข้อมูลเรียบร้อยแล้ว'
                    : 'เพิ่มข้อมูลเรียบร้อยแล้ว'
            );

            resetForm();

            await loadData();

        }

        catch (error) {

            console.error(error);

            alert(
                'เกิดข้อผิดพลาด:\n' +
                error.message
            );

        }

        finally {

            saveBtn.disabled = false;

            saveBtn.textContent =
                'บันทึกข้อมูล';
        }

    }
);


// ================================
// แก้ไขข้อมูล
// ================================

function editData(item) {

    recordId.value = item.id;

    titleInput.value =
        item.title || '';

    detailInput.value =
        item.detail || '';

    currentImageUrl.value =
        item.image_url || '';

    if (item.image_url) {

        imagePreview.src =
            item.image_url;

        imagePreviewContainer.style.display =
            'block';

    } else {

        imagePreview.src = '';

        imagePreviewContainer.style.display =
            'none';
    }

    formTitle.textContent =
        '✏️ แก้ไขข้อมูล ID: ' + item.id;

    document.querySelector('.form-section')
        ?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
}


// ================================
// ลบข้อมูล
// ================================

async function deleteData(item) {

    const tableName =
        menuSelect.value;

    const confirmDelete = confirm(
        `ต้องการลบ "${item.title}" ใช่หรือไม่?\nการลบไม่สามารถย้อนกลับได้`
    );

    if (!confirmDelete) return;

    const { error } =
        await supabase
            .from(tableName)
            .delete()
            .eq('id', item.id);

    if (error) {

        console.error(error);

        alert(
            'ลบข้อมูลไม่สำเร็จ:\n' +
            error.message
        );

        return;
    }

    alert('ลบข้อมูลเรียบร้อยแล้ว');

    resetForm();

    await loadData();
}


// ================================
// ล้างฟอร์ม
// ================================

function resetForm() {

    crudForm.reset();

    recordId.value = '';

    currentImageUrl.value = '';

    imagePreview.src = '';

    imagePreviewContainer.style.display =
        'none';

    formTitle.textContent =
        '➕ เพิ่มข้อมูลใหม่';
}


// ================================
// เปลี่ยนเมนู
// ================================

menuSelect.addEventListener(
    'change',
    async () => {

        resetForm();

        await loadData();
    }
);


// ================================
// ปุ่มล้างฟอร์ม
// ================================

resetBtn.addEventListener(
    'click',
    resetForm
);


// ================================
// Logout
// ================================

logoutBtn.addEventListener(
    'click',
    async () => {

        if (!confirm(
            'ต้องการออกจากระบบใช่หรือไม่?'
        )) {
            return;
        }

        const { error } =
            await supabase.auth.signOut();

        if (error) {

            alert(
                'ออกจากระบบไม่สำเร็จ'
            );

            return;
        }

        window.location.href =
            'login.html';
    }
);


// ================================
// ป้องกัน HTML Injection
// ================================

function escapeHtml(value) {

    return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}


// ================================
// เริ่มระบบ
// ================================

async function init() {

    const loggedIn =
        await checkLogin();

    if (!loggedIn) return;

    await loadData();
}

init();
