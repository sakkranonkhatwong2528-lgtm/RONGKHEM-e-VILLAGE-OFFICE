/**
 * app.js
 * จัดการการรับเรื่องร้องเรียนและการโหลดข้อมูลสถิติ
 */

document.addEventListener('DOMContentLoaded', () => {
    // ระบบรับเรื่องร้องเรียน (หน้า complaint.html หรือฟอร์มร้องเรียน)
    const complaintForm = document.getElementById('complaintForm') || document.querySelector('form');
    if (complaintForm && window.location.pathname.includes('complaint')) {
        complaintForm.addEventListener('submit', handleComplaintSubmit);
    }

    // โหลดข้อมูลเรื่องร้องเรียนเข้าหน้า Admin Dashboard
    if (window.location.pathname.includes('admin-dashboard') || window.location.pathname.includes('admin.html')) {
        loadAdminComplaints();
    }
});

/**
 * ฟังก์ชันส่งเรื่องร้องเรียนสำหรับชาวบ้าน
 */
async function handleComplaintSubmit(event) {
    event.preventDefault();

    const titleElem = document.getElementById('complaintTitle') || document.querySelector('input[name="title"]');
    const descElem = document.getElementById('complaintDesc') || document.querySelector('textarea');
    const nameElem = document.getElementById('reporterName') || document.querySelector('input[name="name"]');
    const phoneElem = document.getElementById('reporterPhone') || document.querySelector('input[name="phone"]');
    const submitBtn = document.querySelector('button[type="submit"]');

    if (!titleElem || !titleElem.value.trim()) {
        alert('กรุณากรอกหัวข้อเรื่องร้องเรียน');
        return;
    }

    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerText = 'กำลังส่งข้อมูล...';
    }

    try {
        if (!supabase) throw new Error('ไม่สามารถเชื่อมต่อฐานข้อมูล Supabase ได้');

        const { data, error } = await supabase
            .from('complaints')
            .insert([
                {
                    title: titleElem.value.trim(),
                    description: descElem ? descElem.value.trim() : '',
                    reporter_name: nameElem ? nameElem.value.trim() : 'ไม่ระบุชื่อ',
                    phone: phoneElem ? phoneElem.value.trim() : '',
                    status: 'pending'
                }
            ]);

        if (error) throw error;

        alert('ส่งเรื่องร้องเรียน/แจ้งเหตุ เรียบร้อยแล้ว!');
        if (complaintForm) complaintForm.reset();

    } catch (err) {
        console.error('Complaint Submit Error:', err.message);
        alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล: ' + err.message);
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerText = 'ส่งเรื่องร้องเรียน';
        }
    }
}

/**
 * ฟังก์ชันดึงรายการเรื่องร้องเรียนมาแสดงบนหน้า Admin Dashboard
 */
async function loadAdminComplaints() {
    const tableBody = document.getElementById('complaintsTableBody') || document.querySelector('table tbody');
    if (!tableBody) return;

    try {
        if (!supabase) return;

        const { data: complaints, error } = await supabase
            .from('complaints')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        if (!complaints || complaints.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:15px;">ไม่พบรายการเรื่องร้องเรียน</td></tr>';
            return;
        }

        tableBody.innerHTML = '';

        complaints.forEach((item, index) => {
            const dateStr = new Date(item.created_at).toLocaleDateString('th-TH', {
                year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
            });

            const statusText = item.status === 'completed' ? 'เสร็จสิ้น' : (item.status === 'in_progress' ? 'กำลังดำเนินการ' : 'รอดำเนินการ');
            const statusColor = item.status === 'completed' ? '#28a745' : (item.status === 'in_progress' ? '#ffc107' : '#dc3545');

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${index + 1}</td>
                <td><strong>${escapeHtml(item.title)}</strong><br><small style="color:#666;">${escapeHtml(item.description || '-')}</small></td>
                <td>${escapeHtml(item.reporter_name)}<br><small>${escapeHtml(item.phone || '-')}</small></td>
                <td>${dateStr}</td>
                <td><span style="background:${statusColor}; color:${item.status === 'in_progress' ? '#000' : '#fff'}; padding:3px 8px; border-radius:12px; font-size:12px;">${statusText}</span></td>
                <td>
                    <select onchange="updateStatus(${item.id}, this.value)" style="padding:4px; border-radius:4px;">
                        <option value="pending" ${item.status === 'pending' ? 'selected' : ''}>รอดำเนินการ</option>
                        <option value="in_progress" ${item.status === 'in_progress' ? 'selected' : ''}>กำลังดำเนินการ</option>
                        <option value="completed" ${item.status === 'completed' ? 'selected' : ''}>เสร็จสิ้น</option>
                    </select>
                </td>
            `;
            tableBody.appendChild(tr);
        });

    } catch (err) {
        console.error('Load Complaints Error:', err.message);
    }
}

async function updateStatus(id, newStatus) {
    try {
        const { error } = await supabase
            .from('complaints')
            .update({ status: newStatus })
            .eq('id', id);

        if (error) throw error;
        alert('อัปเดตสถานะเรียบร้อยแล้ว');
        loadAdminComplaints();
    } catch (err) {
        alert('อัปเดตสถานะไม่สำเร็จ: ' + err.message);
    }
}

function escapeHtml(str) {
    return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
