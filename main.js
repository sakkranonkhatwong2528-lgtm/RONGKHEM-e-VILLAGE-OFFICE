import supabaseClient from "./supabase-config.js";


// ========================================
// โหลดข่าวสาร
// ========================================

async function loadNews() {

  const container =
    document.getElementById("newsContainer");

  if (!container) return;


  try {

    const {
      data,
      error
    } = await supabaseClient
      .from("news")
      .select("*")
      .order(
        "published_at",
        {
          ascending:false
        }
      )
      .limit(6);


    if (error) {

      throw error;

    }


    if (!data || data.length === 0) {

      container.innerHTML = `
        <p>ยังไม่มีข่าวสาร</p>
      `;

      return;

    }


    container.innerHTML =
      data.map(item => `

        <div class="news-card">

          ${
            item.image_url
            ? `
              <img
                src="${item.image_url}"
                alt="${escapeHtml(item.title)}"
              >
            `
            : ""
          }

          <div class="news-content">

            <h3>
              ${escapeHtml(item.title)}
            </h3>

            <p>
              ${escapeHtml(
                item.content || ""
              )}
            </p>

          </div>

        </div>

      `).join("");


  }
  catch (error) {

    console.error(error);

    container.innerHTML = `
      <p>
        ไม่สามารถโหลดข่าวสารได้
      </p>
    `;

  }

}


// ========================================
// LOAD ACTIVITIES
// ========================================

async function loadActivities() {

  const container =
    document.getElementById(
      "activitiesContainer"
    );

  if (!container) return;


  try {

    const {
      data,
      error
    } = await supabaseClient
      .from("activities")
      .select("*")
      .order(
        "id",
        {
          ascending:false
        }
      )
      .limit(6);


    if (error) {

      throw error;

    }


    if (!data || data.length === 0) {

      container.innerHTML =
        "<p>ยังไม่มีกิจกรรม</p>";

      return;

    }


    container.innerHTML =
      data.map(item => `

        <div class="activity-card">

          ${
            item.image_url
            ? `
              <img
                src="${item.image_url}"
                alt="${escapeHtml(item.title)}"
              >
            `
            : ""
          }

          <h3>
            ${escapeHtml(item.title)}
          </h3>

          <p>
            ${escapeHtml(
              item.description || ""
            )}
          </p>

        </div>

      `).join("");


  }
  catch (error) {

    console.error(error);

    container.innerHTML =
      "<p>ไม่สามารถโหลดกิจกรรมได้</p>";

  }

}


// ========================================
// LOAD PROJECTS
// ========================================

async function loadProjects() {

  const container =
    document.getElementById(
      "projectsContainer"
    );

  if (!container) return;


  try {

    const {
      data,
      error
    } = await supabaseClient
      .from("projects")
      .select("*")
      .order(
        "id",
        {
          ascending:false
        }
      )
      .limit(6);


    if (error) {

      throw error;

    }


    if (!data || data.length === 0) {

      container.innerHTML =
        "<p>ยังไม่มีโครงการ</p>";

      return;

    }


    container.innerHTML =
      data.map(item => `

        <div class="project-card">

          ${
            item.image_url
            ? `
              <img
                src="${item.image_url}"
                alt="${escapeHtml(item.title)}"
              >
            `
            : ""
          }

          <h3>
            ${escapeHtml(item.title)}
          </h3>

          <p>
            ${escapeHtml(
              item.description || ""
            )}
          </p>

        </div>

      `).join("");


  }
  catch (error) {

    console.error(error);

    container.innerHTML =
      "<p>ไม่สามารถโหลดโครงการได้</p>";

  }

}


// ========================================
// ESCAPE HTML
// ========================================

function escapeHtml(text) {

  const div =
    document.createElement("div");

  div.textContent =
    text || "";

  return div.innerHTML;

}


// ========================================
// START
// ========================================

loadNews();

loadActivities();

loadProjects();
