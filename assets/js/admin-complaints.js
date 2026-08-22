const RK_KEY = 'rongkhem_cms_v1';

const RK_DEFAULT = {
  services: [
    { id: 'village', name: 'ข้อมูลหมู่บ้าน', icon: 'home', color: '#195bb2', url: '#' },
    { id: 'household', name: 'ข้อมูลครัวเรือน', icon: 'family_home', color: '#e87722', url: '#' },
    { id: 'committee', name: 'คณะกรรมการหมู่บ้าน', icon: 'groups', color: '#6f42c1', url: '#' },
    { id: 'news', name: 'ข่าวสาร/ประกาศ', icon: 'campaign', color: '#dc3545', url: '#ข่าวสาร' },
    { id: 'request', name: 'ยื่นคำร้องออนไลน์', icon: 'description', color: '#198754', url: '#' },
    { id: 'health', name: 'อสม. / สุขภาพชุมชน', icon: 'favorite', color: '#dc3545', url: '#' },
    { id: 'elderly', name: 'ผู้สูงอายุ', icon: 'elderly', color: '#6f42c1', url: '#' },
    { id: 'vulnerable', name: 'กลุ่มเปราะบาง', icon: 'diversity_3', color: '#d63384', url: '#' },
    { id: 'environment', name: 'สิ่งแวดล้อม / PM2.5', icon: 'eco', color: '#82c91e', url: '#' },
    { id: 'subnam', name: 'แหล่งซับน้ำจำ', icon: 'water_drop', color: '#228be6', url: '#' },
    { id: 'agriculture', name: 'การเกษตร', icon: 'agriculture', color: '#fab005', url: '#' },
    { id: 'security', name: 'ชรบ. / ความปลอดภัย', icon: 'security', color: '#195bb2', url: '#' },
    { id: 'market', name: 'ร้านค้าในชุมชน', icon: 'storefront', color: '#2b8a3e', url: '#' },
    { id: 'map', name: 'แผนที่หมู่บ้าน', icon: 'location_on', color: '#339af0', url: '#' },
    { id: 'contact', name: 'ติดต่อผู้ใหญ่บ้าน', icon: 'call', color: '#087f5b', url: '#' },
    { id: 'emergency', name: 'แจ้งเหตุฉุกเฉิน', icon: 'emergency', color: '#e03131', url: '#' }
  ],

  news: [
    {
      title: 'ประชุมประจำเดือนหมู่บ้าน',
      detail: 'ติดตามข่าวสารและกิจกรรมของชุมชน',
      image: '',
      date: 'อัปเดตล่าสุด'
    },
    {
      title: 'โครงการรณรงค์งดการเผา',
      detail: 'ร่วมกันลดฝุ่น PM2.5 และดูแลสิ่งแวดล้อม',
      image: '',
      date: 'ประชาสัมพันธ์'
    },
    {
      title: 'โครงการแหล่งซับน้ำจำ',
      detail: 'ร่วมอนุรักษ์ ฟื้นฟู แหล่งน้ำชุมชน',
      image: '',
      date: 'กิจกรรมชุมชน'
    }
  ],

  announcements: [
    {
      title: 'ประกาศห้ามเผาในที่โล่งทุกชนิด',
      detail: 'โปรดติดตามช่วงเวลาห้ามเผาตามประกาศของทางราชการ'
    },
    {
      title: 'ประชาสัมพันธ์การฉีดวัคซีนป้องกันโรคพิษสุนัขบ้า',
      detail: 'ติดต่อผู้ใหญ่บ้านหรือ อสม. ประจำหมู่บ้าน'
    },
    {
      title: 'การชำระภาษีที่ดินและสิ่งปลูกสร้าง',
      detail: 'ตรวจสอบรายละเอียดกับหน่วยงานที่เกี่ยวข้อง'
    }
  ],

  featured: {
    title: 'กิจกรรมเด่นของชุมชน',
    detail: 'ร่วมแรงร่วมใจ พัฒนาบ้านร่องเข็ม',
    image: ''
  },

  stats: [
    {
      label: 'ครัวเรือนทั้งหมด',
      value: '350',
      unit: 'ครัวเรือน',
      icon: 'home',
      color: '#339af0'
    },
    {
      label: 'ประชากรทั้งหมด',
      value: '1,247',
      unit: 'คน',
      icon: 'groups',
      color: '#e87722'
    },
    {
      label: 'พื้นที่หมู่บ้าน',
      value: '2.15',
      unit: 'ตร.กม.',
      icon: 'map',
      color: '#198754'
    }
  ]
};

function rkClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function rkLoad() {
  try {
    return JSON.parse(localStorage.getItem(RK_KEY)) || rkClone(RK_DEFAULT);
  } catch (error) {
    return rkClone(RK_DEFAULT);
  }
}

function rkSave(data) {
  localStorage.setItem(RK_KEY, JSON.stringify(data));
}

function rkEscape(value = '') {
  return String(value).replace(/[&<>"']/g, character => {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[character];
  });
}

function rkImage(url) {
  return url
    ? `style="background-image:url('${rkEscape(url)}')"`
    : '';
}

function rkRender() {
  const data = rkLoad();

  /* =========================
     เมนูบริการ
  ========================== */

  const grid = document.getElementById('serviceGrid');

  if (grid) {
    grid.innerHTML = data.services.map(item => `
      <a
        class="flex flex-col items-center justify-center
        bg-surface-bright rounded-2xl p-6
        hover:shadow-md transition-shadow
        border border-surface-variant
        hover:border-primary-fixed-dim"
        href="${rkEscape(item.url || '#')}"
      >
        <span
          class="material-symbols-outlined text-5xl mb-4"
          style="
            color:${rkEscape(item.color || '#195bb2')};
            font-variation-settings:'FILL' 1
          "
        >
          ${rkEscape(item.icon || 'apps')}
        </span>

        <span class="font-body-md text-body-md text-center text-on-surface font-medium">
          ${rkEscape(item.name)}
        </span>
      </a>
    `).join('');
  }

  /* =========================
     ข่าวประชาสัมพันธ์
  ========================== */

  const news = document.getElementById('newsList');

  if (news) {
    news.innerHTML = data.news.map(item => `
      <div class="flex gap-4 items-start">

        <div
          class="w-24 h-16 rounded-lg overflow-hidden
          flex-shrink-0 bg-surface-variant"
          ${rkImage(item.image)}
        >
          ${
            item.image
              ? ''
              : `
                <span class="material-symbols-outlined
                w-full h-full flex items-center
                justify-center text-3xl">
                  image
                </span>
              `
          }
        </div>

        <div>
          <h4 class="font-body-md text-body-md
          text-on-surface line-clamp-2 font-medium">
            ${rkEscape(item.title)}
          </h4>

          <p class="font-caption text-caption
          text-on-surface-variant mt-1">
            ${rkEscape(item.detail || item.date || '')}
          </p>
        </div>

      </div>
    `).join('');
  }

  /* =========================
     ประกาศสำคัญ
  ========================== */

  const announcements = document.getElementById('announcementList');

  if (announcements) {
    announcements.innerHTML = data.announcements.map(item => `
      <div class="flex gap-4 items-start">

        <span
          class="material-symbols-outlined
          text-[#dc3545]
          flex-shrink-0 mt-1 text-2xl"
          style="font-variation-settings:'FILL' 1"
        >
          campaign
        </span>

        <div>
          <h4 class="font-body-md text-body-md
          text-on-surface font-medium">
            ${rkEscape(item.title)}
          </h4>

          <p class="font-caption text-caption
          text-on-surface-variant mt-1">
            ${rkEscape(item.detail || '')}
          </p>
        </div>

      </div>
    `).join('');
  }

  /* =========================
     กิจกรรมเด่น
  ========================== */

  const featured = document.getElementById('featuredActivity');

  if (featured) {
    const item = data.featured;

    featured.innerHTML = `
      <div
        class="absolute inset-0 bg-cover bg-center bg-surface-variant"
        ${rkImage(item.image)}
      ></div>

      <div
        class="absolute inset-x-0 bottom-0
        bg-gradient-to-t from-black/90 to-transparent
        p-4 pt-12 text-center"
      >
        <h4 class="font-body-lg text-body-lg text-white font-bold">
          ${rkEscape(item.title)}
        </h4>

        <p class="font-body-sm text-body-sm text-white/90 mt-1">
          ${rkEscape(item.detail)}
        </p>
      </div>
    `;
  }

  /* =========================
     สถิติหมู่บ้าน
  ========================== */

  const stats = document.getElementById('statsList');

  if (stats) {
    stats.innerHTML =
      data.stats.map(item => `
        <div
          class="flex justify-between items-center
          bg-surface-bright p-3 rounded-xl
          border border-surface-variant"
        >

          <div class="flex items-center gap-3">

            <div
              class="w-10 h-10 rounded-lg
              bg-opacity-20 flex items-center
              justify-center"
              style="color:${rkEscape(item.color || '#195bb2')}"
            >
              <span
                class="material-symbols-outlined"
                style="font-variation-settings:'FILL' 1"
              >
                ${rkEscape(item.icon || 'bar_chart')}
              </span>
            </div>

            <span
              class="font-body-md text-body-md
              text-on-surface font-medium"
            >
              ${rkEscape(item.label)}
            </span>

          </div>

          <span
            class="font-headline-sm text-headline-sm
            font-bold text-primary"
          >
            ${rkEscape(item.value)}

            <span
              class="font-body-sm text-body-sm
              font-normal text-on-surface-variant"
            >
              ${rkEscape(item.unit || '')}
            </span>
          </span>

        </div>
      `).join('')

      +

      `
      <div
        class="mt-auto pt-4 border-t
        border-surface-variant flex items-center
        gap-2 text-on-surface-variant"
      >
        <span class="material-symbols-outlined text-sm">
          update
        </span>

        <span class="font-caption text-caption">
          อัปเดตล่าสุดจากระบบหลังบ้าน
        </span>
      </div>
      `;
  }
}

document.addEventListener('DOMContentLoaded', rkRender);
