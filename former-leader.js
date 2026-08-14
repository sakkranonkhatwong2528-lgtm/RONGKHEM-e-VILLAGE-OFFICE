/* =========================================================
   RONGKHEM e-VILLAGE OFFICE
   former-leader.js
   ทำเนียบอดีตผู้ใหญ่บ้าน บ้านร่องเข็ม หมู่ 6
   ========================================================= */

"use strict";

(() => {

const STORAGE_KEY = "rongkhem_former_leaders_v1";

let formerLeaders = [];
let currentImageData = "";


/* =========================================================
   ข้อมูลเริ่มต้นจากข้อมูลที่ได้รับ
   ========================================================= */

const defaultFormerLeaders = [

  {
    id: "former-001",
    order: 1,
    name: "นายคำมี นามจิต",
    start: "2518",
    end: "2523",
    work: "",
    bio: "",
    image: "",
    current: false
  },

  {
    id: "former-002",
    order: 2,
    name: "นายผล นามจิต",
    start: "2523",
    end: "2532",
    work: "",
    bio: "",
    image: "",
    current: false
  },

  {
    id: "former-003",
    order: 3,
    name: "นายดวงคำ วังมูล",
    start: "2532",
    end: "2536",
    work: "",
    bio: "",
    image: "",
    current: false
  },

  {
    id: "former-004",
    order: 4,
    name: "นายทิน ศรีวิใจ",
    start: "2536",
    end: "2541",
    work: "",
    bio: "",
    image: "",
    current: false
  },

  {
    id: "former-005",
    order: 5,
    name: "นายมา วังมูล",
    start: "2541",
    end: "2546",
    work: "",
    bio: "",
    image: "",
    current: false
  },

  {
    id: "former-006",
    order: 6,
    name: "นายสมาน ศรีเมือง",
    start: "2546",
    end: "2549",
    work: "",
    bio: "",
    image: "",
    current: false
  },

  {
    id: "former-007",
    order: 7,
    name: "นายสาคร ศรีชัยอินทร์",
    start: "2549",
    end: "2557",
    work: "",
    bio: "",
    image: "",
    current: false
  },

  {
    id: "former-008",
    order: 8,
    name: "นายบุญธรรม ศรีเมือง",
    start: "2557",
    end: "2559",
    work: "",
    bio: "",
    image: "",
    current: false
  },

  {
    id: "former-009",
    order: 9,
    name: "นายสมเกียรติ อุปเสน",
    start: "2559",
    end: "2568",
    work: "",
    bio: "",
    image: "",
    current: false
  },

  {
    id: "former-010",
    order: 10,
    name: "นายศักรนนทน์ ขัติย์วงศ์",
    start: "2568",
    end: "ปัจจุบัน",
    work: "",
    bio: "",
    image: "",
    current: true
  }

];


/* =========================================================
   เริ่มระบบ
   ========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  init
);


function init() {

  loadFormerLeaders();

  setupForm();

  setupClock();

  renderFormerLeaders();

}


/* =========================================================
   โหลดข้อมูล
   ========================================================= */

function loadFormerLeaders() {

  try {

    const saved =
      localStorage.getItem(
        STORAGE_KEY
      );

    if (saved) {

      const parsed =
        JSON.parse(saved);

      if (
        Array.isArray(parsed) &&
        parsed.length > 0
      ) {

        formerLeaders = parsed;

        return;

      }

    }

  } catch (error) {

    console.error(
      "โหลดข้อมูลไม่สำเร็จ:",
      error
    );

  }


  formerLeaders =
    JSON.parse(
      JSON.stringify(
        defaultFormerLeaders
      )
    );


  saveFormerLeaders();

}


/* =========================================================
   บันทึกข้อมูล
   ========================================================= */

function saveFormerLeaders() {

  try {

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(
        formerLeaders
      )
    );

  } catch (error) {

    console.error(
      "บันทึกข้อมูลไม่สำเร็จ:",
      error
    );

    alert(
      "ไม่สามารถบันทึกข้อมูลได้\n" +
      "พื้นที่จัดเก็บอาจเต็ม"
    );

  }

}


/* =========================================================
   แสดงข้อมูล
   ========================================================= */

window.renderFormerLeaders =
function() {

  const timeline =
    document.getElementById(
      "formerTimeline"
    );

  if (!timeline) return;


  const search =
    document.getElementById(
      "formerSearch"
    );


  const keyword =
    search
      ? search.value
          .trim()
          .toLowerCase()
      : "";


  let data =
    formerLeaders.filter(item => {

      if (!keyword) {
        return true;
      }


      const text = [

        item.name,
        item.start,
        item.end,
        item.work,
        item.bio

      ]
      .join(" ")
      .toLowerCase();


      return text.includes(
        keyword
      );

    });


  data.sort(
    (a,b) =>
      Number(a.order || 999) -
      Number(b.order || 999)
  );


  if (data.length === 0) {

    timeline.innerHTML = `

      <div class="emptyBox">

        <div class="emptyIcon">
          🔎
        </div>

        <h3>
          ไม่พบข้อมูล
        </h3>

        <p>
          ไม่พบรายชื่อที่ตรงกับการค้นหา
        </p>

      </div>

    `;

    return;

  }


  timeline.innerHTML =
    data
      .map(
        createFormerCard
      )
      .join("");

};


/* =========================================================
   สร้าง Card
   ========================================================= */

function createFormerCard(item) {

  const image =
    item.image ||
    "https://via.placeholder.com/700x500?text=RONGKHEM";


  const currentBadge =
    item.current

      ? `
        <div style="
          display:inline-block;
          background:#059669;
          color:#fff;
          padding:5px 10px;
          border-radius:8px;
          font-size:12px;
          font-weight:800;
          margin-bottom:8px;
        ">
          ● ดำรงตำแหน่งปัจจุบัน
        </div>
      `

      : "";


  const work =
    item.work
      ? `
        <div style="margin-top:8px">
          <strong>ผลงาน / เหตุการณ์สำคัญ:</strong><br>
          ${escapeHTML(item.work)}
        </div>
      `
      : "";


  const bio =
    item.bio
      ? `
        <div style="margin-top:8px">
          <strong>ประวัติ:</strong><br>
          ${escapeHTML(item.bio)}
        </div>
      `
      : "";


  return `

    <div class="formerItem">

      <div class="timelineDot"></div>

      <article class="formerCard">

        <img
          class="formerPhoto"
          src="${image}"
          alt="${escapeHTML(item.name)}"
          onerror="
            this.src='https://via.placeholder.com/700x500?text=RONGKHEM'
          "
        >

        <div class="formerInfo">

          ${currentBadge}

          <div class="formerOrder">
            ลำดับที่ ${escapeHTML(item.order)}
          </div>

          <div class="formerName">
            ${escapeHTML(item.name)}
          </div>

          <div class="formerTerm">
            พ.ศ. ${escapeHTML(item.start)}
            –
            ${escapeHTML(item.end)}
          </div>

          <div class="formerDetail">

            ${work}

            ${bio}

          </div>


          <div class="actions">

            <button
              class="btn btnEdit"
              onclick="
                editFormerLeader('${item.id}')
              "
            >
              ✏️ แก้ไข
            </button>

            <button
              class="btn btnDelete"
              onclick="
                deleteFormerLeader('${item.id}')
              "
            >
              🗑️ ลบ
            </button>

          </div>

        </div>

      </article>

    </div>

  `;

}


/* =========================================================
   เปิดฟอร์มเพิ่ม
   ========================================================= */

window.openFormerLeaderForm =
function() {

  const modal =
    document.getElementById(
      "formerModal"
    );

  const form =
    document.getElementById(
      "formerForm"
    );


  if (!modal || !form) return;


  form.reset();


  document.getElementById(
    "formerId"
  ).value = "";


  document.getElementById(
    "formerFormTitle"
  ).textContent =
    "➕ เพิ่มอดีตผู้ใหญ่บ้าน";


  currentImageData = "";


  const preview =
    document.getElementById(
      "formerPreview"
    );


  if (preview) {

    preview.src =
      "https://via.placeholder.com/300x300?text=PHOTO";

  }


  modal.classList.add(
    "show"
  );

};


/* =========================================================
   ปิดฟอร์ม
   ========================================================= */

window.closeFormerLeaderForm =
function() {

  const modal =
    document.getElementById(
      "formerModal"
    );


  if (modal) {

    modal.classList.remove(
      "show"
    );

  }

};


/* =========================================================
   แก้ไข
   ========================================================= */

window.editFormerLeader =
function(id) {

  const item =
    formerLeaders.find(
      x =>
        String(x.id) ===
        String(id)
    );


  if (!item) {

    alert(
      "ไม่พบข้อมูล"
    );

    return;

  }


  document.getElementById(
    "formerId"
  ).value =
    item.id;


  document.getElementById(
    "formerOrder"
  ).value =
    item.order || "";


  document.getElementById(
    "formerName"
  ).value =
    item.name || "";


  document.getElementById(
    "formerStart"
  ).value =
    item.start || "";


  document.getElementById(
    "formerEnd"
  ).value =
    item.end || "";


  document.getElementById(
    "formerWork"
  ).value =
    item.work || "";


  document.getElementById(
    "formerBio"
  ).value =
    item.bio || "";


  const preview =
    document.getElementById(
      "formerPreview"
    );


  if (preview) {

    preview.src =
      item.image ||
      "https://via.placeholder.com/300x300?text=PHOTO";

  }


  currentImageData =
    item.image || "";


  document.getElementById(
    "formerFormTitle"
  ).textContent =
    "✏️ แก้ไขข้อมูลอดีตผู้ใหญ่บ้าน";


  document
    .getElementById(
      "formerModal"
    )
    .classList.add(
      "show"
    );

};


/* =========================================================
   ลบ
   ========================================================= */

window.deleteFormerLeader =
function(id) {

  const item =
    formerLeaders.find(
      x =>
        String(x.id) ===
        String(id)
    );


  if (!item) return;


  const ok =
    confirm(
      "ยืนยันการลบข้อมูล?\n\n" +
      item.name +
      "\n" +
      "พ.ศ. " +
      item.start +
      " - " +
      item.end
    );


  if (!ok) return;


  formerLeaders =
    formerLeaders.filter(
      x =>
        String(x.id) !==
        String(id)
    );


  saveFormerLeaders();

  renderFormerLeaders();


  alert(
    "ลบข้อมูลเรียบร้อยแล้ว"
  );

};


/* =========================================================
   อัปโหลดรูป
   ========================================================= */

window.previewFormerImage =
function(event) {

  const file =
    event.target.files &&
    event.target.files[0];


  if (!file) return;


  if (
    !file.type.startsWith(
      "image/"
    )
  ) {

    alert(
      "กรุณาเลือกไฟล์รูปภาพ"
    );

    event.target.value = "";

    return;

  }


  if (
    file.size >
    8 * 1024 * 1024
  ) {

    alert(
      "ไฟล์รูปมีขนาดใหญ่เกินไป\n" +
      "กรุณาเลือกไฟล์ไม่เกิน 8 MB"
    );

    event.target.value = "";

    return;

  }


  const reader =
    new FileReader();


  reader.onload =
  function(event) {

    const image =
      new Image();


    image.onload =
    function() {

      const maxWidth =
        1200;

      const maxHeight =
        1200;


      let width =
        image.width;

      let height =
        image.height;


      if (
        width >
        maxWidth
      ) {

        height =
          height *
          maxWidth /
          width;

        width =
          maxWidth;

      }


      if (
        height >
        maxHeight
      ) {

        width =
          width *
          maxHeight /
          height;

        height =
          maxHeight;

      }


      const canvas =
        document.createElement(
          "canvas"
        );


      canvas.width =
        Math.round(width);

      canvas.height =
        Math.round(height);


      const ctx =
        canvas.getContext(
          "2d"
        );


      ctx.drawImage(
        image,
        0,
        0,
        canvas.width,
        canvas.height
      );


      currentImageData =
        canvas.toDataURL(
          "image/jpeg",
          0.82
        );


      const preview =
        document.getElementById(
          "formerPreview"
        );


      if (preview) {

        preview.src =
          currentImageData;

      }

    };


    image.src =
      event.target.result;

  };


  reader.readAsDataURL(
    file
  );

};


/* =========================================================
   บันทึกข้อมูล
   ========================================================= */

function setupForm() {

  const form =
    document.getElementById(
      "formerForm"
    );


  if (!form) return;


  form.addEventListener(
    "submit",
    function(event) {

      event.preventDefault();


      const id =
        document.getElementById(
          "formerId"
        ).value.trim();


      const order =
        Number(
          document.getElementById(
            "formerOrder"
          ).value
        ) || (
          formerLeaders.length + 1
        );


      const name =
        document.getElementById(
          "formerName"
        ).value.trim();


      const start =
        document.getElementById(
          "formerStart"
        ).value.trim();


      const end =
        document.getElementById(
          "formerEnd"
        ).value.trim();


      const work =
        document.getElementById(
          "formerWork"
        ).value.trim();


      const bio =
        document.getElementById(
          "formerBio"
        ).value.trim();


      if (!name) {

        alert(
          "กรุณากรอกชื่อ-นามสกุล"
        );

        return;

      }


      /* --------------------------------
         แก้ไข
         -------------------------------- */

      if (id) {

        const index =
          formerLeaders.findIndex(
            x =>
              String(x.id) ===
              String(id)
          );


        if (index === -1) {

          alert(
            "ไม่พบข้อมูลเดิม"
          );

          return;

        }


        formerLeaders[index] = {

          ...formerLeaders[index],

          order,
          name,
          start,
          end,
          work,
          bio,

          image:
            currentImageData ||
            formerLeaders[index].image ||
            ""

        };


        saveFormerLeaders();

        renderFormerLeaders();

        closeFormerLeaderForm();


        alert(
          "แก้ไขข้อมูลเรียบร้อยแล้ว"
        );


        return;

      }


      /* --------------------------------
         เพิ่ม
         -------------------------------- */

      const newItem = {

        id:
          "former-" +
          Date.now(),

        order,

        name,

        start,

        end,

        work,

        bio,

        image:
          currentImageData || "",

        current:
          end === "ปัจจุบัน"

      };


      formerLeaders.push(
        newItem
      );


      saveFormerLeaders();

      renderFormerLeaders();

      closeFormerLeaderForm();


      alert(
        "เพิ่มข้อมูลเรียบร้อยแล้ว"
      );

    }
  );

}


/* =========================================================
   คลิกพื้นหลังปิด
   ========================================================= */

document.addEventListener(
  "click",
  function(event) {

    const modal =
      document.getElementById(
        "formerModal"
      );


    if (
      modal &&
      event.target === modal
    ) {

      closeFormerLeaderForm();

    }

  }
);


/* =========================================================
   ESC ปิด
   ========================================================= */

document.addEventListener(
  "keydown",
  function(event) {

    if (
      event.key !== "Escape"
    ) return;


    const modal =
      document.getElementById(
        "formerModal"
      );


    if (
      modal &&
      modal.classList.contains(
        "show"
      )
    ) {

      closeFormerLeaderForm();

    }

  }
);


/* =========================================================
   นาฬิกา
   ========================================================= */

function setupClock() {

  updateClock();

  setInterval(
    updateClock,
    1000
  );

}


function updateClock() {

  const clock =
    document.getElementById(
      "clock"
    );

  const date =
    document.getElementById(
      "date"
    );


  const now =
    new Date();


  if (clock) {

    clock.textContent =
      now.toLocaleTimeString(
        "th-TH",
        {
          hour:"2-digit",
          minute:"2-digit",
          second:"2-digit"
        }
      );

  }


  if (date) {

    date.textContent =
      now.toLocaleDateString(
        "th-TH",
        {
          weekday:"long",
          day:"numeric",
          month:"long",
          year:"numeric"
        }
      );

  }

}


/* =========================================================
   สำรองข้อมูล JSON
   ========================================================= */

window.exportFormerLeaders =
function() {

  const json =
    JSON.stringify(
      formerLeaders,
      null,
      2
    );


  const blob =
    new Blob(
      [json],
      {
        type:
          "application/json"
      }
    );


  const url =
    URL.createObjectURL(
      blob
    );


  const a =
    document.createElement(
      "a"
    );


  a.href =
    url;

  a.download =
    "rongkhem-former-leaders.json";


  document.body.appendChild(a);

  a.click();

  a.remove();


  URL.revokeObjectURL(
    url
  );

};


/* =========================================================
   นำเข้าข้อมูล
   ========================================================= */

window.importFormerLeaders =
function(file) {

  if (!file) return;


  const reader =
    new FileReader();


  reader.onload =
  function(event) {

    try {

      const data =
        JSON.parse(
          event.target.result
        );


      if (
        !Array.isArray(data)
      ) {

        throw new Error(
          "ข้อมูลไม่ถูกต้อง"
        );

      }


      formerLeaders =
        data;


      saveFormerLeaders();

      renderFormerLeaders();


      alert(
        "นำเข้าข้อมูลเรียบร้อยแล้ว"
      );


    } catch(error) {

      console.error(
        error
      );

      alert(
        "ไม่สามารถนำเข้าข้อมูลได้"
      );

    }

  };


  reader.readAsText(
    file
  );

};


/* =========================================================
   คืนค่ารายชื่อ 10 คน
   ========================================================= */

window.resetFormerLeaders =
function() {

  const ok =
    confirm(
      "ต้องการคืนค่ารายชื่อผู้ใหญ่บ้านทั้ง 10 คนหรือไม่?"
    );


  if (!ok) return;


  formerLeaders =
    JSON.parse(
      JSON.stringify(
        defaultFormerLeaders
      )
    );


  saveFormerLeaders();

  renderFormerLeaders();


  alert(
    "คืนค่ารายชื่อเรียบร้อยแล้ว"
  );

};


/* =========================================================
   Escape HTML
   ========================================================= */

function escapeHTML(value) {

  return String(
    value ?? ""
  )

  .replaceAll(
    "&",
    "&amp;"
  )

  .replaceAll(
    "<",
    "&lt;"
  )

  .replaceAll(
    ">",
    "&gt;"
  )

  .replaceAll(
    '"',
    "&quot;"
  )

  .replaceAll(
    "'",
    "&#039;"
  );

}


/* =========================================================
   API
   ========================================================= */

window.RONGKHEM_FORMER_LEADERS = {

  getAll() {

    return formerLeaders;

  },

  save() {

    saveFormerLeaders();

  },

  reload() {

    loadFormerLeaders();

    renderFormerLeaders();

  }

};

})();
