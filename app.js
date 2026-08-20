import { supabase } from './supabase-config.js';


// =====================================
// ป้องกัน HTML
// =====================================

function escapeHtml(value) {

    return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');

}


// =====================================
// ดึงข้อมูลทั่วไป
// =====================================

async function getData(tableName, limit = 100) {

    const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .order('id', {
            ascending: false
        })
        .limit(limit);

    if (error) {

        console.error(
            `โหลด ${tableName} ไม่สำเร็จ:`,
            error.message
        );

        return [];

    }

    return data || [];

}


// =====================================
// ข่าวสาร
// =====================================

async function loadNews() {

    const container =
        document.getElementById('newsContainer');

    if (!container) return;

    container.innerHTML = `
        <div class="loading">
            กำลังโหลดข่าวสาร...
        </div>
    `;

    const data =
        await getData('news', 6);

    if (!data.length) {

        container.innerHTML = `
            <div class="empty-data">
                ยังไม่มีข่าวสาร
            </div>
        `;

        return;

    }

    container.innerHTML =
        data.map(item => `

            <article class="news-card">

                ${
                    item.image_url
                    ? `
                        <img
                            src="${item.image_url}"
                            alt="${escapeHtml(item.title)}"
                            loading="lazy"
                        >
                    `
                    : ''
                }

                <div class="news-content">

                    <h3>
                        ${escapeHtml(item.title)}
                    </h3>

                    <p>
                        ${escapeHtml(item.detail)}
                    </p>

                </div>

            </article>

        `).join('');

}


// =====================================
// กิจกรรม
// =====================================

async function loadActivities() {

    const container =
        document.getElementById(
            'activityContainer'
        );

    if (!container) return;

    const data =
        await getData('activity', 6);

    if (!data.length) {

        container.innerHTML = `
            <div class="empty-data">
                ยังไม่มีกิจกรรม
            </div>
        `;

        return;

    }

    container.innerHTML =
        data.map(item => `

            <article class="activity-card">

                ${
                    item.image_url
                    ? `
                        <img
                            src="${item.image_url}"
                            alt="${escapeHtml(item.title)}"
                            loading="lazy"
                        >
                    `
                    : ''
                }

                <div class="activity-content">

                    <h3>
                        ${escapeHtml(item.title)}
                    </h3>

                    <p>
                        ${escapeHtml(item.detail)}
                    </p>

                </div>

            </article>

        `).join('');

}


// =====================================
// โครงการหมู่บ้าน
// =====================================

async function loadProjects() {

    const container =
        document.getElementById(
            'projectContainer'
        );

    if (!container) return;

    const data =
        await getData('project', 6);

    if (!data.length) {

        container.innerHTML = `
            <div class="empty-data">
                ยังไม่มีโครงการ
            </div>
        `;

        return;

    }

    container.innerHTML =
        data.map(item => `

            <article class="project-card">

                ${
                    item.image_url
                    ? `
                        <img
                            src="${item.image_url}"
                            alt="${escapeHtml(item.title)}"
                            loading="lazy"
                        >
                    `
                    : ''
                }

                <div class="project-content">

                    <h3>
                        ${escapeHtml(item.title)}
                    </h3>

                    <p>
                        ${escapeHtml(item.detail)}
                    </p>

                </div>

            </article>

        `).join('');

}


// =====================================
// เหตุการณ์ / แจ้งเตือน
// =====================================

async function loadIncidents() {

    const container =
        document.getElementById(
            'incidentContainer'
        );

    if (!container) return;

    const data =
        await getData('incident', 5);

    if (!data.length) {

        container.innerHTML = `
            <div class="empty-data">
                ไม่มีการแจ้งเตือน
            </div>
        `;

        return;

    }

    container.innerHTML =
        data.map(item => `

            <div class="incident-card">

                <h4>
                    ⚠️ ${escapeHtml(item.title)}
                </h4>

                <p>
                    ${escapeHtml(item.detail)}
                </p>

            </div>

        `).join('');

}


// =====================================
// เรื่องร้องเรียน
// =====================================

async function loadComplaints() {

    const container =
        document.getElementById(
            'complaintContainer'
        );

    if (!container) return;

    const data =
        await getData('complaint', 10);

    if (!data.length) {

        container.innerHTML = `
            <div class="empty-data">
                ยังไม่มีข้อมูล
            </div>
        `;

        return;

    }

    container.innerHTML =
        data.map(item => `

            <div class="complaint-card">

                <h3>
                    ${escapeHtml(item.title)}
                </h3>

                <p>
                    ${escapeHtml(item.detail)}
                </p>

            </div>

        `).join('');

}


// =====================================
// เริ่มโหลดระบบ
// =====================================

document.addEventListener(
    'DOMContentLoaded',
    async () => {

        await Promise.all([

            loadNews(),

            loadActivities(),

            loadProjects(),

            loadIncidents(),

            loadComplaints()

        ]);

    }
);
