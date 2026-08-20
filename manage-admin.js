import { supabase } from './supabase.js';

let currentTable = 'news';

// 1. ตรวจสอบสิทธิ์การเข้าใช้งาน (Auth Guard)
async function checkAuthGuard() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        alert('กรุณาเข้าสู่ระบบก่อนใช้งาน!');
        window.location.href = 'admin-login.html';
        return false;
    }
    const adminEmailElem = document.getElementById('adminEmail');
    if (adminEmailElem) adminEmailElem.innerText = session.user.email;
    return true;
}

// 2. ฟังก์ชันอัปโหลดรูปภาพลง Supabase Storage
async function uploadImage(file) {
    if (!file) return null;
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    const { error: uploadError } = await supabase.storage
        .from('rongkhem-images') // ชื่อ Bucket ใน Supabase Storage
        .upload(filePath, file);

    if (uploadError) {
        alert('อัปโหลดรูปภาพไม่สำเร็จ: ' + uploadError.message);
        return null;
    }

    const { data } = supabase.storage.from('rongkhem-images').getPublicUrl(filePath);
    return data.publicUrl;
}

// 3. กำหนดชื่อฟิลด์ตามโครงสร้างตาราง
function getFieldNames(tableName) {
    switch (tableName) {
        case 'elderly':
        case 'vulnerable':
        case 'people':
            return { titleField: 'name', detailField: 'details' };
        case 'complaint':
        case 'incident':
            return { titleField: 'subject', detailField: 'description' };
        default:
            return { titleField: 'title', detailField: 'detail' };
    }
}

// 4. ดึงข้อมูลจากฐานข้อมูลมาแสดงในตาราง
async function loadTableData() {
    const tbody = document.getElementById('tableBody');
    if (!tbody) return;
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">กำลังโหลดข้อมูล...</td></tr>';

    const { data, error } = await supabase
        .from(currentTable)
        .select('*')
        .order('id', { ascending: false });

    if (error) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:red;">เกิดข้อผิดพลาด: ${error.message}</td></tr>`;
        return;
    }

    tbody.innerHTML = '';
    if (!data || data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">ไม่พบข้อมูลในเมนูนี</td></tr>';
        return;
    }

    const { titleField, detailField } = getFieldNames(currentTable);

    data.forEach(item => {
        const row = document.createElement('tr');
        const titleText = item[titleField] || item.title || item.name || item.subject || '-';
        const detailText = item[detailField] || item.detail || item.description || item.details || '-';
        const imageUrl = item.image_url || item.image || item.photo || '';

        row.innerHTML = `
            <td>${item.id}</td>
            <td style="text-align:center;">
                ${imageUrl ? `<img src="${imageUrl}" class="img-preview">` : '<small style="color:#aaa;">ไม่มีรูป</small>'}
            </td>
            <td><strong>${escapeHtml(titleText)}</strong></td>
            <td>${escapeHtml(detailText)}</td>
            <td style="text-align:center;">
                <button type="button" class="btn-edit" data-item="${encodeURIComponent(JSON.stringify(item))}">แก้ไข</button>
                <button type="button" class="btn-delete" data-id="${item.id}">ลบ</button>
            </td>
        `;
        tbody.appendChild(row);
    });

    // ผูก Event ปุ่มแก้ไข/ลบ
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const item = JSON.parse(decodeURIComponent(e.target.dataset.item));
            editRecord(item);
        });
    });

    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            removeRecord(e.target.dataset.id);
        });
    });
}

// 5. บันทึกข้อมูล (เพิ่ม/แก้ไข)
async function handleFormSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('recordId').value;
    const titleValue = document.getElementById('titleInput').value.trim();
    const detailValue = document.getElementById('detailInput').value.trim();
    const imageFile = document.getElementById('imageInput').files[0];
    let imageUrl = document.getElementById('currentImageUrl').value;

    // ถ้ามีการเลือกรูปใหม่ ให้ทำการอัปโหลด
    if (imageFile) {
        const uploadedUrl = await uploadImage(imageFile);
        if (uploadedUrl) imageUrl = uploadedUrl;
    }

    const { titleField, detailField } = getFieldNames(currentTable);
    const payload = {
        [titleField]: titleValue,
        [detailField]: detailValue,
        image_url: imageUrl,
        updated_at: new Date().toISOString()
    };

    if (id) {
        // แก้ไข
        const { error } = await supabase.from(currentTable).update(payload).eq('id', id);
        if (error) alert('แก้ไขข้อมูลไม่สำเร็จ: ' + error.message);
        else alert('แก้ไขข้อมูลเรียบร้อยแล้ว');
    } else {
        // เพิ่มใหม่
        const { error } = await supabase.from(currentTable).insert([payload]);
        if (error) alert('เพิ่มข้อมูลไม่สำเร็จ: ' + error.message);
        else alert('เพิ่มข้อมูลเรียบร้อยแล้ว');
    }

    resetForm();
    await loadTableData();
}

// 6. ดึงข้อมูลขึ้นฟอร์มเพื่อแก้ไข
function editRecord(item) {
    const { titleField, detailField } = getFieldNames(currentTable);
    document.getElementById('recordId').value = item.id;
    document.getElementById('titleInput').value = item[titleField] || item.title || item.name || item.subject || '';
    document.getElementById('detailInput').value = item[detailField] || item.detail || item.description || item.details || '';
    
    const imageUrl = item.image_url || item.image || item.photo || '';
    document.getElementById('currentImageUrl').value = imageUrl;

    const previewContainer = document.getElementById('imagePreviewContainer');
    const previewImg = document.getElementById('imagePreview');
    if (imageUrl) {
        previewImg.src = imageUrl;
        previewContainer.style.display = 'block';
    } else {
        previewContainer.style.display = 'none';
    }

    document.getElementById('formTitle').innerText = `✏️ แก้ไขข้อมูล (ID: ${item.id})`;
    document.getElementById('saveBtn').innerText = 'บันทึกการแก้ไข';
}

// 7. ลบข้อมูล
async function removeRecord(id) {
    if (!confirm('คุณยืนยันที่จะลบรายการนี้ใช่หรือไม่?')) return;
    const { error } = await supabase.from(currentTable).delete().eq('id', id);
    if (error) {
        alert('ลบข้อมูลไม่สำเร็จ: ' + error.message);
    } else {
        alert('ลบข้อมูลเรียบร้อยแล้ว');
        await loadTableData();
    }
}

// 8. ล้างฟอร์ม
function resetForm() {
    document.getElementById('crudForm').reset();
    document.getElementById('recordId').value = '';
    document.getElementById('currentImageUrl').value = '';
    document.getElementById('imagePreviewContainer').style.display = 'none';
    document.getElementById('formTitle').innerText = '➕ เพิ่มข้อมูลใหม่';
    document.getElementById('saveBtn').innerText = 'บันทึกข้อมูล';
}

function escapeHtml(text) {
    if (typeof text !== 'string') return text;
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Event Listeners เมื่อโหลดหน้า
document.addEventListener('DOMContentLoaded', async () => {
    const isAuthed = await checkAuthGuard();
    if (isAuthed) {
        await loadTableData();

        document.getElementById('menuSelect').addEventListener('change', (e) => {
            currentTable = e.target.value;
            resetForm();
            loadTableData();
        });

        document.getElementById('crudForm').addEventListener('submit', handleFormSubmit);
        document.getElementById('resetBtn').addEventListener('click', resetForm);
        document.getElementById('logoutBtn').addEventListener('click', async () => {
            if (confirm('ยืนยันการออกจากระบบ?')) {
                await supabase.auth.signOut();
                window.location.href = 'admin-login.html';
            }
        });
    }
});
