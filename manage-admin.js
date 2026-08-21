// manage-admin.js

document.addEventListener('DOMContentLoaded', () => {
  loadVillageStats();
  loadActivitiesList();

  document.getElementById('stats-form').addEventListener('submit', handleUpdateStats);
  document.getElementById('activity-form').addEventListener('submit', handleSaveActivity);
});

// --- 1. การจัดการสถิติหมู่บ้าน ---
async function loadVillageStats() {
  const { data, error } = await supabaseClient
    .from('village_stats')
    .select('*')
    .eq('id', 1)
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
}

async function handleUpdateStats(e) {
  e.preventDefault();
  const payload = {
    id: 1,
    population: parseInt(document.getElementById('stat-population').value),
    households: parseInt(document.getElementById('stat-households').value),
    children: parseInt(document.getElementById('stat-children').value),
    elderly: parseInt(document.getElementById('stat-elderly').value),
    disabled: parseInt(document.getElementById('stat-disabled').value),
    vulnerable: parseInt(document.getElementById('stat-vulnerable').value),
    updated_at: new Date().toISOString()
  };

  const { error } = await supabaseClient
    .from('village_stats')
    .upsert(payload);

  if (error) alert('เกิดข้อผิดพลาดในการบันทึกสถิติ: ' + error.message);
  else alert('อัปเดตข้อมูลสถิติเรียบร้อยแล้ว!');
}

// --- 2. อัปโหลดรูปภาพเข้า Supabase Storage ---
async function uploadActivityImage(file) {
  if (!file) return null;
  const fileExt = file.name.split('.').pop();
  const fileName = `act_${Date.now()}.${fileExt}`;
  const filePath = `activities/${fileName}`;

  const { error } = await supabaseClient.storage
    .from('rongkhem-images')
    .upload(filePath, file);

  if (error) {
    alert('อัปโหลดรูปไม่สำเร็จ: ' + error.message);
    return null;
  }

  const { data } = supabaseClient.storage
    .from('rongkhem-images')
    .getPublicUrl(filePath);

  return data.publicUrl;
}

// --- 3. เพิ่ม/แก้ไข กิจกรรม ---
async function handleSaveActivity(e) {
  e.preventDefault();
  const id = document.getElementById('activity-id').value;
  const fileInput = document.getElementById('act-image').files[0];
  
  let imageUrl = null;
  if (fileInput) {
    imageUrl = await uploadActivityImage(fileInput);
  }

  const activityData = {
    title: document.getElementById('act-title').value,
    event_date: document.getElementById('act-date').value,
    location: document.getElementById('act-location').value,
    participants_count: parseInt(document.getElementById('act-participants').value) || 0
  };

  if (imageUrl) activityData.image_url = imageUrl;

  let resultError = null;

  if (id) {
    // กรณีแก้ไข (Update)
    const { error } = await supabaseClient
      .from('activities')
      .update(activityData)
      .eq('id', id);
    resultError = error;
  } else {
    // กรณีเพิ่มใหม่ (Create)
    const { error } = await supabaseClient
      .from('activities')
      .insert([activityData]);
    resultError = error;
  }

  if (resultError) {
    alert('เกิดข้อผิดพลาด: ' + resultError.message);
  } else {
    alert('บันทึกข้อมูลกิจกรรมเรียบร้อยแล้ว!');
    resetActivityForm();
    loadActivitiesList();
  }
}

// --- 4. ดึงรายการกิจกรรมทั้งหมดมาแสดงในตาราง ---
async function loadActivitiesList() {
  const { data: activities, error } = await supabaseClient
    .from('activities')
    .select('*')
    .order('event_date', { ascending: false });

  if (error) return console.error(error);

  const tbody = document.getElementById('activity-table-body');
  tbody.innerHTML = '';

  activities.forEach(act => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${act.title}</strong></td>
      <td>${act.event_date}</td>
      <td>${act.location}</td>
      <td>
        <button class="btn btn-primary" style="padding:4px 8px;" onclick="editActivity(${JSON.stringify(act).replace(/"/g, '&quot;')})">แก้ไข</button>
        <button class="btn btn-danger" style="padding:4px 8px;" onclick="deleteActivity(${act.id})">ลบ</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// --- 5. ลบกิจกรรม ---
async function deleteActivity(id) {
  if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบกิจกรรมนี้?')) return;

  const { error } = await supabaseClient
    .from('activities')
    .delete()
    .eq('id', id);

  if (error) alert('ลบข้อมูลไม่สำเร็จ: ' + error.message);
  else {
    alert('ลบข้อมูลเรียบร้อยแล้ว');
    loadActivitiesList();
  }
}

// --- 6. ดึงข้อมูลกิจกรรมลงฟอร์มเพื่อแก้ไข ---
function editActivity(act) {
  document.getElementById('activity-id').value = act.id;
  document.getElementById('act-title').value = act.title;
  document.getElementById('act-date').value = act.event_date;
  document.getElementById('act-location').value = act.location;
  document.getElementById('act-participants').value = act.participants_count;

  document.getElementById('btn-save-activity').textContent = 'อัปเดตกิจกรรม';
  document.getElementById('btn-cancel-edit').style.display = 'inline-block';
}

function resetActivityForm() {
  document.getElementById('activity-form').reset();
  document.getElementById('activity-id').value = '';
  document.getElementById('btn-save-activity').textContent = 'บันทึกกิจกรรม';
  document.getElementById('btn-cancel-edit').style.display = 'none';
}
