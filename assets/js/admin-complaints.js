let currentFilter = 'all';

document.addEventListener('DOMContentLoaded', () => {
    loadComplaints();
});

// โหลดรายการเรื่องร้องเรียน
async function loadComplaints() {
    const complaintList = document.getElementById('complaint-list');
    complaintList.innerHTML = '<tr><td colspan="5" style="text-align:center;">กำลังโหลดรายการ...</td></tr>';

    let query = supabaseClient
        .from('complaints')
        .select('*')
        .order('created_at', { ascending: false });

    if (currentFilter !== 'all') {
        query = query.eq('status', currentFilter);
    }

    const { data: complaints, error } = await query;

    if (error) {
        console.error('Error fetching complaints:', error);
        complaintList.innerHTML = '<tr><td colspan="5" style="text-align:center; color:red;">เกิดข้อผิดพลาดในการโหลดเรื่องร้องเรียน</td></tr>';
        return;
    }

    if (!complaints || complaints.length === 0) {
        complaintList.innerHTML = '<tr><td colspan="5" style="text-align:center;">ไม่พบเรื่องร้องเรียนในหมวดหมู่นี้</td></tr>';
        return;
    }

    complaintList.innerHTML = complaints.map(item => `
        <tr>
            <td>
                <strong>#${escapeHtml(item.tracking_code || item.id)}</strong><br>
                <small style="color:#666;">${new Date(item.created_at).toLocaleDateString('th-TH')}</small>
            </td>
            <td>
                <strong>${escapeHtml(item.reporter_name || 'ไม่ระบุตัวตน')}</strong><br>
                <small>📞 ${escapeHtml(item.phone || '-')}</small>
            </td>
            <td>
                <strong>${escapeHtml(item.title)}</strong>
                <p style="margin: 5px 0 0 0; font-size:13px; color:#555;">${escapeHtml(item.description)}</p>
            </td>
            <td>${getStatusBadge(item.status)}</td>
            <td>
                <button class="btn btn-primary" onclick="openUpdateModal('${item.id}', '${escapeHtml(item.tracking_code || item.id)}', '${escapeHtml(item.title)}', '${item.status}', '${escapeHtml(item.remark || '')}')">
                    อัปเดตสถานะ
                </button>
            </td>
        </tr>
    `).join('');
}

// กรองสถานะเรื่องร้องเรียน
function filterStatus(status, btnElement) {
    currentFilter = status;
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    btnElement.classList.add('active');
    loadComplaints();
}

// แสดง Badge สถานะ
function getStatusBadge(status) {
    switch (status) {
        case 'pending':
            return '<span class="status-badge status-pending">⏳ รอดำเนินการ</span>';
        case 'in_progress':
            return '<span class="status-badge status-in_progress">🔄 กำลังดำเนินการ</span>';
        case 'completed':
            return '<span class="status-badge status-completed">✅ เสร็จสิ้น</span>';
        case 'rejected':
            return '<span class="status-badge status-rejected">❌ ปฏิเสธ/ยกเลิก</span>';
        default:
            return `<span class="status-badge">${status}</span>`;
    }
}

// เปิด Modal สำหรับอัปเดตสถานะ
function openUpdateModal(id, trackingCode, title, status, remark) {
    document.getElementById('modal-complaint-id').value = id;
    document.getElementById('modal-tracking-code').textContent = trackingCode;
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-status').value = status;
    document.getElementById('modal-remark').value = remark;
    document.getElementById('update-modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('update-modal').style.display = 'none';
}

// บันทึกการอัปเดตสถานะลง Supabase
document.getElementById('update-status-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('modal-complaint-id').value;
    const status = document.getElementById('modal-status').value;
    const remark = document.getElementById('modal-remark').value;

    const { error } = await supabaseClient
        .from('complaints')
        .update({
            status: status,
            remark: remark,
            updated_at: new Date()
        })
        .eq('id', id);

    if (error) {
        alert('เกิดข้อผิดพลาดในการบันทึก: ' + error.message);
    } else {
        alert('อัปเดตสถานะเรื่องร้องเรียนเรียบร้อยแล้ว!');
        closeModal();
        loadComplaints();
    }
});
