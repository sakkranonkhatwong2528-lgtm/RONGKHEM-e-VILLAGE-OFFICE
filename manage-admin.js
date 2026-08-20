// manage-admin.js
import { fetchData, insertData, updateData, deleteData } from './supabase.js';

// ตารางเริ่มต้นเมื่อเปิดหน้าเว็บ
let currentTable = 'news';

// Map รายชื่อฟิลด์หลักของแต่ละตารางให้อัตโนมัติ (รองรับโครงสร้างตารางที่หลากหลาย)
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

// 1. โหลดข้อมูลลงตารางเมื่อมีการเปลี่ยนเมนู
window.switchMenu = async function(tableName) {
    currentTable = tableName;
    resetForm();
    await loadTableData();
};

// 2. ดึงข้อมูลจาก Supabase มาแสดงในตาราง HTML
async function loadTableData() {
    const tbody = document.getElementById('tableBody');
    if (!tbody) return;

    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">กำลังโหลดข้อมูล...</td></tr>';
    
    const data = await fetchData(currentTable);
    const { titleField, detailField } = getFieldNames(currentTable);
    
    tbody.innerHTML = '';

    if (!data || data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">ไม่พบข้อมูลในเมนูนี</td></tr>';
        return;
    }

    data.forEach(item => {
        const row = document.createElement('tr');
        const titleText = item[titleField] || item.title || item.name || item.subject || '-';
        const detailText = item[detailField] || item.detail || item.description || item.details || '-';

        row.innerHTML = `
            <td>${item.id}</td>
            <td><strong>${escapeHtml(titleText)}</strong></td>
            <td>${escapeHtml(detailText)}</td>
            <td style="text-align:center;">
                <button type="button" class="btn-edit" onclick="editRecord(${item.id}, '${encodeURIComponent(JSON.stringify(item))}')">แก้ไข</button>
                <button type="button" class="btn-delete" onclick="removeRecord(${item.id})">ลบ</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// 3. จัดการการกดบันทึกฟอร์ม (ทั้งเพิ่มใหม่ และ แก้ไข)
window.handleFormSubmit = async function(event) {
    event.preventDefault();

    const id = document.getElementById('recordId').value;
    const titleValue = document.getElementById('titleInput').value.trim();
    const detailValue = document.getElementById('detailInput').value.trim();

    const { titleField, detailField } = getFieldNames(currentTable);

    // จัดโครงสร้างข้อมูลที่จะส่งไปเซฟ
    const payload = {
        [titleField]: titleValue,
        [detailField]: detailValue,
        updated_at: new Date().toISOString()
    };

    try {
        if (id) {
            // โหมดแก้ไข (Update)
            await updateData(currentTable, id, payload);
            alert('แก้ไขข้อมูลเรียบร้อยแล้ว');
        } else {
            // โหมดเพิ่มใหม่ (Create)
            await insertData(currentTable, payload);
            alert('เพิ่มข้อมูลใหม่เรียบร้อยแล้ว');
        }

        resetForm();
        await loadTableData();
    } catch (err) {
        console.error('Submit Error:', err);
    }
};

// 4. ดึงข้อมูลรายการที่เลือกขึ้นมาบนฟอร์ม เพื่อเตรียมแก้ไข
window.editRecord = function(id, encodedData) {
    const item = JSON.parse(decodeURIComponent(encodedData));
    const { titleField, detailField } = getFieldNames(currentTable);

    document.getElementById('recordId').value = item.id;
    document.getElementById('titleInput').value = item[titleField] || item.title || item.name || item.subject || '';
    document.getElementById('detailInput').value = item[detailField] || item.detail || item.description || item.details || '';
    
    document.getElementById('formTitle').innerText = `แก้ไขข้อมูล (ID: ${item.id})`;
    document.getElementById('saveBtn').innerText = 'บันทึกการแก้ไข';
};

// 5. ลบข้อมูล
window.removeRecord = async function(id) {
    const success = await deleteData(currentTable, id);
    if (success) {
        alert('ลบข้อมูลเรียบร้อยแล้ว');
        await loadTableData();
    }
};

// 6. ล้างข้อมูลบนฟอร์ม
window.resetForm = function() {
    const form = document.getElementById('crudForm');
    if (form) form.reset();
    document.getElementById('recordId').value = '';
    document.getElementById('formTitle').innerText = 'เพิ่มข้อมูลใหม่';
    document.getElementById('saveBtn').innerText = 'เพิ่มข้อมูล';
};

// ฟังก์ชันช่วยหลีกเลี่ยง XSS
function escapeHtml(text) {
    if (typeof text !== 'string') return text;
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// โหลดข้อมูลลงตารางทันทีเมื่อเปิดหน้า
document.addEventListener('DOMContentLoaded', () => {
    loadTableData();
});
