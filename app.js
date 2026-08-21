/**
 * app.js
 * จัดการข้อมูลสถิติหน้าแรก และระบบรับเรื่องร้องเรียนชาวบ้าน
 */

document.addEventListener('DOMContentLoaded', () => {
    // โหลดข้อมูลสถิติมารีเฟรชในหน้าแรก
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname === '/RONGKHEM-e-VILLAGE-OFFICE/') {
        loadVillageStats();
    }

    // ฟอร์มส่งเรื่องร้องเรียน (หน้า complaint.html)
    const complaintForm = document.getElementById('complaintForm') || document.querySelector('form');
    if (complaintForm && window.location.pathname.includes('complaint')) {
        complaintForm.addEventListener('submit', handleComplaintSubmit);
    }

    // โหลดตารางจัดการเรื่องร้องเรียน (หน้า Admin Dashboard)
    if (window.location.pathname.includes('admin-dashboard')) {
        loadAdminComplaints();
    }
});

/**
 * ดึงข้อมูลสถิติหมู่บ้านจาก Supabase มาแสดงแทนตัวเลข Static
 */
async function loadVillageStats() {
    try {
        if (!supabase) return;

        const { data: stats, error } = await supabase
            .from('village_stats')
            .select('*')
            .single();

        if (error || !stats) return;

        // อัปเดตตัวเลขการแสดงผลตาม ID หรือ Selector
        updateTextContent('stat-population', stats.population);
        updateTextContent('stat-households', stats.households);
        updateTextContent('stat-children', stats.children);
        updateTextContent('stat-elderly', stats.elderly);
        updateTextContent('stat-disabled', stats.disabled);
        updateTextContent('stat-vulnerable', stats.vulnerable);

    } catch (err) {
        console.warn('Load Stats Error:', err.message);
    }
}

/**
 * ส่งเรื่องร้องเรียนของชาวบ้านเข้าสู่ Supabase
 */
async function handleComplaintSubmit(event) {
    event.preventDefault();

    const titleElem = document.getElementById('complaintTitle') || document.querySelector('input[name="title"]');
    const descElem = document.getElementById('complaintDesc') || document.querySelector('textarea');
    const nameElem = document.getElementById('reporterName') || document.querySelector('input[name="name"]');
    const phoneElem = document.getElementById('reporterPhone') || document.querySelector('input[name="phone"]');
    const submitBtn = document.querySelector('button[type="submit"]');

    if (!titleElem || !titleElem.value.trim()) {
        alert('กรุณากรอกหัวข้อเรื่องร้องเรียน/แจ้งเหตุ');
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
        event.target.reset();

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
 * โหลดรายการร้องเรียนลงตารางในหน้า Admin
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
            tableBody.innerHTML = '<tr><td colspan="6" class="text-center py-4 text-gray-500">ไม่พบรายการเรื่องร้องเรียน</td></tr>';
            return;
        }

        tableBody.innerHTML = '';

        complaints.forEach((item, index) => {
            const dateStr = new Date(item.created_at).toLocaleDateString('th-TH', {
                year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
            });

            const statusBadge = item.status === 'completed' 
                ? '<span class="bg-green-100 text-green-700 text-xs px-2.5 py-1 rounded-full font-medium">เสร็จสิ้น</span>'
                : (item.status === 'in_progress' 
                    ? '<span class="bg-yellow-100 text-yellow-700 text-xs px-2.5 py-1 rounded-full font-medium">กำลังดำเนินการ</span>' 
                    : '<span class="bg-red-100 text-red-700 text-xs px-2.5 py-1 rounded-full font-medium">รอดำเนินการ</span>');

            const tr = document.createElement('tr');
            tr.className = 'border-b hover:bg-gray-50 text-sm';
            tr.innerHTML = `
                <td class="p-3 text-center">${index + 1}</td>
                <td class="p-3"><strong>${escapeHtml(item.title)}</strong><br><span class="text-xs text-gray-500">${escapeHtml(item.description || '-')}</span></td>
                <td class="p-3">${escapeHtml(item.reporter_name)}<br><span class="text-xs text-gray-500">${escapeHtml(item.phone || '-')}</span></td>
                <td class="p-3 text-xs text-gray-500">${dateStr}</td>
                <td class="p-3 text-center">${statusBadge}</td>
                <td class="p-3 text-center">
                    <select onchange="updateStatus(${item.id}, this.value)" class="text-xs border rounded p-1 bg-white">
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

function updateTextContent(id, text) {
    const elem = document.getElementById(id);
    if (elem && text !== undefined) elem.innerText = text.toLocaleString();
}

function escapeHtml(str) {
    return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
