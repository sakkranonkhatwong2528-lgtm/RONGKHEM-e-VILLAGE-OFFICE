document.addEventListener('DOMContentLoaded', () => {
  loadVillageStats();
  loadActivities();

  // ผูก Event การบันทึกสถิติ
  const statsForm = document.getElementById('stats-form');
  if (statsForm) {
    statsForm.addEventListener('submit', handleSaveStats);
  }

  // ผูก Event การบันทึกกิจกรรม
  const activityForm = document.getElementById('activity-form');
  if (activityForm) {
    activityForm.addEventListener('submit', handleSaveActivity);
  }
});

// ==========================================
// 1. จัดการข้อมูลสถิติหมู่บ้าน (Village Stats)
// ==========================================
async function loadVillageStats() {
  try {
    const { data, error } = await supabaseClient
      .from('village_stats')
      .select('*')
      .eq('id', 1)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    if (data) {
      document.getElementById('stat-population').value = data.population || 0;
      document.getElementById('stat-households').value = data.households || 0;
      document.getElementById('stat-children').value = data.children || 0;
      document.getElementById('stat-elderly').value = data.elderly || 0;
      document.getElementById('stat-disabled').value = data.disabled || 0;
      document.getElementById('stat-vulnerable').value = data.vulnerable || 0;
    }
  } catch (err) {
    console.error(' Error loading stats:', err.message);
  }
}

async function handleSaveStats(e) {
  e.preventDefault();
  
  const statsData = {
    id: 1,
    population: parseInt(document.getElementById('stat-population').value) || 0,
    households: parseInt(document.getElementById('stat-households').value) || 0,
    children: parseInt(document.getElementById('stat-children').value) || 0,
    elderly: parseInt(document.getElementById('stat-elderly').value) || 0,
    disabled: parseInt(document.getElementById('stat-disabled').value) || 0,
    vulnerable: parseInt(document.getElementById('stat-vulnerable').value) || 0,
    updated_at: new Date().toISOString()
  };

  try {
    const { error } = await supabaseClient
      .from('village_stats')
      .upsert(statsData);

    if (error) throw error;
    alert('✅ บันทึกข้อมูลสถิติเรียบร้อยแล้ว!');
  } catch (err) {
    alert('❌ เกิดข้อผิดพลาดในการบันทึก: ' + err.message);
  }
}

// ==========================================
// 2. จัดการกิจกรรม (Activities)
// ==========================================
async function loadActivities() {
  const tbody = document.getElementById('activity-table-body');
  if (!tbody) return;

  tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">⏳ กำลังโหลดข้อมูล...</td></tr>';

  try {
    const { data, error } = await supabaseClient
      .from('activities')
      .select('*')
      .order('date', { ascending: false });

    if (error) throw error;

    if (!data || data.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">ยังไม่มีรายการกิจกรรม</td></tr>';
      return;
    }

    tbody.innerHTML = data.map(act => `
      <tr>
        <td><strong>${act.title}</strong></td>
        <td>${act.date}</td>
        <td>${act.location || '-'}</td>
        <td>
          <button class="btn btn-secondary" style="padding: 4px 8px; font-size: 12px;" onclick="editActivity('${act.id}', '${escapeHtml(act.title)}', '${act.date}', '${escapeHtml(act.location)}', ${act.participants})">✏️ แก้ไข</button>
          <button class="btn btn-danger" style="padding: 4px 8px; font-size: 12px;" onclick="deleteActivity('${act.id}')">🗑️ ลบ</button>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:red;">❌ โหลดข้อมูลล้มเหลว: ${err.message}</td></tr>`;
  }
}

async function handleSaveActivity(e) {
  e.preventDefault();

  const id = document.getElementById('activity-id').value;
  const title = document.getElementById('act-title').value.trim();
  const date = document.getElementById('act-date').value;
  const location = document.getElementById('act-location').value.trim();
  const participants = parseInt(document.getElementById('act-participants').value) || 0;

  const payload = {
    title,
    date,
    location,
    participants,
    updated_at: new Date().toISOString()
  };

  try {
    if (id) {
      // แก้ไขกิจกรรม
      const { error } = await supabaseClient
        .from('activities')
        .update(payload)
        .eq('id', id);
      if (error) throw error;
      alert('✅ แก้ไขกิจกรรมเรียบร้อยแล้ว!');
    } else {
      // เพิ่มกิจกรรมใหม่
      const { error } = await supabaseClient
        .from('activities')
        .insert([payload]);
      if (error) throw error;
      alert('✅ เพิ่มกิจกรรมใหม่เรียบร้อยแล้ว!');
    }

    resetActivityForm();
    loadActivities();
  } catch (err) {
    alert('❌ เกิดข้อผิดพลาด: ' + err.message);
  }
}

function editActivity(id, title, date, location, participants) {
  document.getElementById('activity-id').value = id;
  document.getElementById('act-title').value = title;
  document.getElementById('act-date').value = date;
  document.getElementById('act-location').value = location;
  document.getElementById('act-participants').value = participants;

  document.getElementById('btn-save-activity').innerText = 'อัปเดตกิจกรรม';
  document.getElementById('btn-cancel-edit').style.display = 'inline-block';
}

function resetActivityForm() {
  document.getElementById('activity-id').value = '';
  document.getElementById('activity-form').reset();
  document.getElementById('btn-save-activity').innerText = 'บันทึกกิจกรรม';
  document.getElementById('btn-cancel-edit').style.display = 'none';
}

async function deleteActivity(id) {
  if (!confirm('คุณต้องการลบกิจกรรมนี้ใช่หรือไม่?')) return;

  try {
    const { error } = await supabaseClient
      .from('activities')
      .delete()
      .eq('id', id);

    if (error) throw error;
    alert('🗑️ ลบกิจกรรมเรียบร้อยแล้ว');
    loadActivities();
  } catch (err) {
    alert('❌ ลบไม่สำเร็จ: ' + err.message);
  }
}

function escapeHtml(str) {
  return (str || '').replace(/'/g, "\\'").replace(/"/g, '&quot;');
}
