// โหลดข้อมูลสถิติและกิจกรรมเมื่อเปิดหน้า
document.addEventListener('DOMContentLoaded', () => {
    loadVillageStats();
    loadActivities();
});

// ------------------------------------
// 1. ส่วนจัดการสถิติหมู่บ้าน (Stats)
// ------------------------------------
async function loadVillageStats() {
    try {
        const { data, error } = await supabaseClient
            .from('village_stats')
            .select('*')
            .single();

        if (error && error.code !== 'PGRST116') {
            console.error('Error fetching stats:', error);
            return;
        }

        if (data) {
            document.getElementById('stat-population').value = data.population || 0;
            document.getElementById('stat-households').value = data.households || 0;
            document.getElementById('stat-children').value = data.children || 0;
            document.getElementById('stat-elderly').value = data.elderly || 0;
            document.getElementById('stat-disabled').value = data.disabled || 0;
            document.getElementById('stat-vulnerable').value = data.vulnerable || 0;
        }
    } catch (err) {
        console.error('Unexpected error loading stats:', err);
    }
}

document.getElementById('stats-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const statsData = {
        id: 1, // กำหนด ID หลักสำหรับแถวสถิติประจำหมู่บ้าน
        population: parseInt(document.getElementById('stat-population').value) || 0,
        households: parseInt(document.getElementById('stat-households').value) || 0,
        children: parseInt(document.getElementById('stat-children').value) || 0,
        elderly: parseInt(document.getElementById('stat-elderly').value) || 0,
        disabled: parseInt(document.getElementById('stat-disabled').value) || 0,
        vulnerable: parseInt(document.getElementById('stat-vulnerable').value) || 0,
        updated_at: new Date()
    };

    const { error } = await supabaseClient
        .from('village_stats')
        .upsert(statsData);

    if (error) {
        alert('เกิดข้อผิดพลาดในการบันทึกสถิติ: ' + error.message);
    } else {
        alert('บันทึกข้อมูลสถิติเรียบร้อยแล้ว!');
    }
});

// ------------------------------------
// 2. ส่วนจัดการกิจกรรม (Activities)
// ------------------------------------
async function loadActivities() {
    const tableBody = document.getElementById('activity-table-body');
    tableBody.innerHTML = '<tr><td colspan="4" style="text-align:center;">กำลังโหลดข้อมูล...</td></tr>';

    const { data: activities, error } = await supabaseClient
        .from('activities')
        .select('*')
        .order('date', { ascending: false });

    if (error) {
        console.error('Error fetching activities:', error);
        tableBody.innerHTML = '<tr><td colspan="4" style="text-align:center; color:red;">ไม่สามารถโหลดข้อมูลกิจกรรมได้</td></tr>';
        return;
    }

    if (!activities || activities.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="4" style="text-align:center;">ยังไม่มีรายการกิจกรรม</td></tr>';
        return;
    }

    tableBody.innerHTML = activities.map(act => `
        <tr>
            <td><strong>${escapeHtml(act.title)}</strong></td>
            <td>${act.date || '-'}</td>
            <td>${escapeHtml(act.location || '-')}</td>
            <td>
                <button class="btn btn-secondary" onclick="editActivity('${act.id}')">แก้ไข</button>
                <button class="btn btn-danger" onclick="deleteActivity('${act.id}')">ลบ</button>
            </td>
        </tr>
    `).join('');
}

// บันทึก / แก้ไขกิจกรรม
document.getElementById('activity-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const activityId = document.getElementById('activity-id').value;
    const title = document.getElementById('act-title').value;
    const date = document.getElementById('act-date').value;
    const location = document.getElementById('act-location').value;
    const participants = parseInt(document.getElementById('act-participants').value) || 0;
    const imageFile = document.getElementById('act-image').files[0];

    let imageUrl = null;

    // อัปโหลดรูปภาพเข้า Supabase Storage (ถ้ามีการเลือกรูป)
    if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabaseClient
            .storage
            .from('activity-images')
            .upload(fileName, imageFile);

        if (uploadError) {
            alert('อัปโหลดรูปภาพไม่สำเร็จ: ' + uploadError.message);
            return;
        }

        const { data: publicUrlData } = supabaseClient
            .storage
            .from('activity-images')
            .getPublicUrl(fileName);
            
        imageUrl = publicUrlData.publicUrl;
    }

    const payload = {
        title,
        date,
        location,
        participants,
        updated_at: new Date()
    };

    if (imageUrl) {
        payload.image_url = imageUrl;
    }

    let error;
    if (activityId) {
        // อัปเดตกิจกรรมเดิม
        const res = await supabaseClient
            .from('activities')
            .update(payload)
            .eq('id', activityId);
        error = res.error;
    } else {
        // เพิ่มกิจกรรมใหม่
        const res = await supabaseClient
            .from('activities')
            .insert([payload]);
        error = res.error;
    }

    if (error) {
        alert('เกิดข้อผิดพลาดในการบันทึกกิจกรรม: ' + error.message);
    } else {
        alert('บันทึกกิจกรรมเรียบร้อยแล้ว!');
        resetActivityForm();
        loadActivities();
    }
});

// ดึงข้อมูลมาแก้ไข
async function editActivity(id) {
    const { data: act, error } = await supabaseClient
        .from('activities')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !act) {
        alert('ไม่พบข้อมูลกิจกรรม');
        return;
    }

    document.getElementById('activity-id').value = act.id;
    document.getElementById('act-title').value = act.title;
    document.getElementById('act-date').value = act.date;
    document.getElementById('act-location').value = act.location;
    document.getElementById('act-participants').value = act.participants || 0;

    document.getElementById('btn-save-activity').textContent = 'อัปเดตกิจกรรม';
    document.getElementById('btn-cancel-edit').style.display = 'inline-block';
}

// ลบกิจกรรม
async function deleteActivity(id) {
    if (!confirm('คุณต้องการลบกิจกรรมนี้ใช่หรือไม่?')) return;

    const { error } = await supabaseClient
        .from('activities')
        .delete()
        .eq('id', id);

    if (error) {
        alert('เกิดข้อผิดพลาดในการลบ: ' + error.message);
    } else {
        alert('ลบกิจกรรมเรียบร้อยแล้ว');
        loadActivities();
    }
}

// รีเซ็ตฟอร์มกิจกรรม
function resetActivityForm() {
    document.getElementById('activity-id').value = '';
    document.getElementById('activity-form').reset();
    document.getElementById('btn-save-activity').textContent = 'บันทึกกิจกรรม';
    document.getElementById('btn-cancel-edit').style.display = 'none';
}

function escapeHtml(text) {
    if (!text) return '';
    return text.replace(/[&<>"']/g, function(m) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
    });
}
