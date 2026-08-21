// app.js - ดึงข้อมูล Real-time มาแสดงหน้าเว็บหลัก

document.addEventListener('DOMContentLoaded', () => {
  fetchVillageStats();
  fetchLatestActivities();
});

// 1. ดึงสถิติหมู่บ้านมาอัปเดตที่การ์ดสถิติ
async function fetchVillageStats() {
  try {
    const { data, error } = await supabaseClient
      .from('village_stats')
      .select('*')
      .eq('id', 1)
      .single();

    if (error) throw error;
    if (!data) return;

    // อัปเดตตัวเลขใน Element ตาม ID (เช็คชื่อ ID ให้ตรงกับหน้า HTML)
    updateElementText('stat-population', data.population?.toLocaleString());
    updateElementText('stat-households', data.households?.toLocaleString());
    updateElementText('stat-children', data.children?.toLocaleString());
    updateElementText('stat-elderly', data.elderly?.toLocaleString());
    updateElementText('stat-disabled', data.disabled?.toLocaleString());
    updateElementText('stat-vulnerable', data.vulnerable?.toLocaleString());
  } catch (err) {
    console.error('Error loading stats:', err.message);
  }
}

// 2. ดึงกิจกรรมล่าสุด 4 รายการแรกมาแสดง
async function fetchLatestActivities() {
  try {
    const { data: activities, error } = await supabaseClient
      .from('activities')
      .select('*')
      .order('event_date', { ascending: false })
      .limit(4);

    if (error) throw error;

    const container = document.getElementById('latest-activities-container');
    if (!container || !activities) return;

    // สร้าง HTML การ์ดกิจกรรมตามโครงสร้างเดิมของหน้าเว็บ
    container.innerHTML = activities.map(act => `
      <div class="activity-item">
        ${act.image_url ? `<img src="${act.image_url}" alt="${act.title}" class="activity-thumb">` : ''}
        <div class="activity-details">
          <h4>${act.title}</h4>
          <p class="activity-meta">
            📅 ${formatThaiDate(act.event_date)} | 📍 ${act.location} | 👥 ${act.participants_count} คน
          </p>
        </div>
      </div>
    `).join('');
  } catch (err) {
    console.error('Error loading activities:', err.message);
  }
}

// ฟังก์ชั่นแปลงวันที่เป็น พ.ศ. แบบไทย
function formatThaiDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('th-TH', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

function updateElementText(id, text) {
  const el = document.getElementById(id);
  if (el && text !== undefined) el.textContent = text;
}
