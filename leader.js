/* =========================================================
   RONGKHEM e-VILLAGE OFFICE
   leader.js
   ระบบทำเนียบผู้นำ
   เพิ่ม / แก้ไข / ลบ / ค้นหา / อัปโหลดรูป
   ========================================================= */

(() => {

"use strict";

/* =========================================================
   ตั้งค่า
   ========================================================= */

const STORAGE_KEY = "rongkhem_leaders_v1";

let leaders = [];
let currentImageData = "";


/* =========================================================
   ข้อมูลเริ่มต้น
   ========================================================= */

const defaultLeaders = [
  {
    id: "leader-001",
    name: "นายศักรนนทน์ ขัติย์วงศ์",
    role: "ผู้ใหญ่บ้าน",
    duty: "ผู้นำหมู่บ้านและประธานคณะกรรมการหมู่บ้าน",
    phone: "080-1202529",
    bio: "ผู้ใหญ่บ้านบ้านร่องเข็ม หมู่ที่ 6 ตำบลจำป่าหวาย อำเภอเมืองพะเยา จังหวัดพะเยา",
    image: "",
    createdAt: new Date().toISOString()
  }
];


/* =========================================================
   เริ่มระบบ
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  loadLeaders();

  renderLeaders();

  setupLeaderForm();

  setupClock();

});


/* =========================================================
   โหลดข้อมูล
   ========================================================= */

function loadLeaders() {

  try {

    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {

      const parsed = JSON.parse(saved);

      if (Array.isArray(parsed)) {

        leaders = parsed;

        return;

      }

    }

  } catch (error) {

    console.error("ไม่สามารถโหลดข้อมูลผู้นำ:", error);

  }


  leaders = JSON.parse(
    JSON.stringify(defaultLeaders)
  );

  saveLeaders();

}


/* =========================================================
   บันทึกข้อมูล
   ========================================================= */

function saveLeaders() {

  try {

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(leaders)
    );

  } catch (error) {

    console.error("ไม่สามารถบันทึกข้อมูล:", error);

    alert(
      "ไม่สามารถบันทึกข้อมูลได้\n" +
      "พื้นที่จัดเก็บของเบราว์เซอร์อาจเต็ม"
    );

  }

}


/* =========================================================
   แสดงรายการ
   ========================================================= */

window.renderLeaders = function() {

  const container =
    document.getElementById("leaderGrid");

  if (!container) return;


  const searchInput =
    document.getElementById("searchLeader");

  const keyword =
    searchInput
      ? searchInput.value.trim().toLowerCase()
      : "";


  let filtered = leaders.filter(item => {

    if (!keyword) return true;

    return (

      String(item.name || "")
        .toLowerCase()
        .includes(keyword)

      ||

      String(item.role || "")
        .toLowerCase()
        .includes(keyword)

      ||

      String(item.duty || "")
        .toLowerCase()
        .includes(keyword)

    );

  });


  if (filtered.length === 0) {

    container.innerHTML = `
      <div style="
        grid-column:1/-1;
        text-align:center;
        padding:50px;
        background:#fff;
        border-radius:18px;
        color:#64748b;
      ">
        <div style="font-size:50px">🔎</div>
        <h3>ไม่พบข้อมูล</h3>
        <p>ลองค้นหาด้วยชื่อหรือตำแหน่งอื่น</p>
      </div>
    `;

    return;

  }


  container.innerHTML =
    filtered
      .map(createLeaderCard)
      .join("");

};


/* =========================================================
   สร้าง Card
   ========================================================= */

function createLeaderCard(item) {

  const image =
    item.image ||
    "https://via.placeholder.com/600x450?text=RONGKHEM";


  const safeName =
    escapeHTML(item.name || "-");

  const safeRole =
    escapeHTML(item.role || "-");

  const safeDuty =
    escapeHTML(item.duty || "-");

  const safePhone =
    escapeHTML(item.phone || "-");

  const safeBio =
    escapeHTML(item.bio || "-");


  return `
    <article class="leaderCard">

      <img
        class="leaderPhoto"
        src="${image}"
        alt="${safeName}"
        onerror="this.src='https://via.placeholder.com/600x450?text=RONGKHEM'"
      >

      <div class="leaderInfo">

        <div class="leaderRole">
          ${safeRole}
        </div>

        <div class="leaderName">
          ${safeName}
        </div>

        <div class="leaderDetail">

          <div>
            <strong>หน้าที่:</strong>
            ${safeDuty}
          </div>

          <div>
            <strong>โทรศัพท์:</strong>
            ${safePhone}
          </div>

          <div style="margin-top:8px">
            ${safeBio}
          </div>

        </div>

        <div class="cardActions">

          <button
            class="btn btnEdit"
            onclick="editLeader('${item.id}')">
            ✏️ แก้ไข
          </button>

          <button
            class="btn btnDelete"
            onclick="deleteLeader('${item.id}')">
            🗑️ ลบ
          </button>

        </div>

      </div>

    </article>
  `;

}


/* =========================================================
   เปิดฟอร์มเพิ่ม
   ========================================================= */

window.openLeaderForm = function() {

  const modal =
    document.getElementById("leaderModal");

  const form =
    document.getElementById("leaderForm");

  if (!modal || !form) return;


  form.reset();


  document.getElementById("leaderId").value = "";

  document.getElementById("formTitle").textContent =
    "➕ เพิ่มบุคลากร";


  const preview =
    document.getElementById("previewImage");

  if (preview) {

    preview.src =
      "https://via.placeholder.com/300x300?text=PHOTO";

  }


  currentImageData = "";


  modal.classList.add("show");

};


/* =========================================================
   ปิดฟอร์ม
   ========================================================= */

window.closeLeaderForm = function() {

  const modal =
    document.getElementById("leaderModal");

  if (modal) {

    modal.classList.remove("show");

  }

};


/* =========================================================
   แก้ไข
   ========================================================= */

window.editLeader = function(id) {

  const item =
    leaders.find(
      leader => String(leader.id) === String(id)
    );


  if (!item) {

    alert("ไม่พบข้อมูลบุคลากร");

    return;

  }


  document.getElementById("leaderId").value =
    item.id;

  document.getElementById("leaderNameInput").value =
    item.name || "";

  document.getElementById("leaderRoleInput").value =
    item.role || "ผู้ใหญ่บ้าน";

  document.getElementById("leaderDutyInput").value =
    item.duty || "";

  document.getElementById("leaderPhoneInput").value =
    item.phone || "";

  document.getElementById("leaderBioInput").value =
    item.bio || "";


  const preview =
    document.getElementById("previewImage");


  if (preview) {

    preview.src =
      item.image ||
      "https://via.placeholder.com/300x300?text=PHOTO";

  }


  currentImageData =
    item.image || "";


  document.getElementById("formTitle").textContent =
    "✏️ แก้ไขข้อมูลบุคลากร";


  document
    .getElementById("leaderModal")
    .classList.add("show");

};


/* =========================================================
   ลบ
   ========================================================= */

window.deleteLeader = function(id) {

  const item =
    leaders.find(
      leader => String(leader.id) === String(id)
    );


  if (!item) return;


  const confirmDelete =
    confirm(
      "ต้องการลบข้อมูลนี้หรือไม่?\n\n" +
      item.name +
      "\n" +
      item.role
    );


  if (!confirmDelete) return;


  leaders =
    leaders.filter(
      leader =>
        String(leader.id) !== String(id)
    );


  saveLeaders();

  renderLeaders();


  alert("ลบข้อมูลเรียบร้อยแล้ว");

};


/* =========================================================
   Preview รูป
   ========================================================= */

window.previewLeaderImage = function(event) {

  const file =
    event.target.files &&
    event.target.files[0];


  if (!file) return;


  if (!file.type.startsWith("image/")) {

    alert("กรุณาเลือกไฟล์รูปภาพ");

    event.target.value = "";

    return;

  }


  /*
   จำกัดขนาดไฟล์ต้นฉบับ
  */

  if (file.size > 8 * 1024 * 1024) {

    alert(
      "รูปภาพมีขนาดใหญ่เกินไป\n" +
      "กรุณาเลือกไฟล์ไม่เกิน 8 MB"
    );

    event.target.value = "";

    return;

  }


  const reader =
    new FileReader();


  reader.onload = function(e) {

    const image =
      new Image();


    image.onload = function() {

      /*
       * ย่อรูปก่อนเก็บลง localStorage
       * เพื่อป้องกันพื้นที่เต็ม
       */

      const maxWidth = 1000;
      const maxHeight = 1000;

      let width =
        image.width;

      let height =
        image.height;


      if (width > maxWidth) {

        height =
          height * maxWidth / width;

        width =
          maxWidth;

      }


      if (height > maxHeight) {

        width =
          width * maxHeight / height;

        height =
          maxHeight;

      }


      const canvas =
        document.createElement("canvas");


      canvas.width =
        Math.round(width);

      canvas.height =
        Math.round(height);


      const ctx =
        canvas.getContext("2d");


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
        document.getElementById("previewImage");


      if (preview) {

        preview.src =
          currentImageData;

      }

    };


    image.src =
      e.target.result;

  };


  reader.readAsDataURL(file);

};


/* =========================================================
   บันทึกฟอร์ม
   ========================================================= */

function setupLeaderForm() {

  const form =
    document.getElementById("leaderForm");


  if (!form) return;


  form.addEventListener(
    "submit",
    function(event) {

      event.preventDefault();


      const id =
        document
          .getElementById("leaderId")
          .value
          .trim();


      const name =
        document
          .getElementById("leaderNameInput")
          .value
          .trim();


      const role =
        document
          .getElementById("leaderRoleInput")
          .value
          .trim();


      const duty =
        document
          .getElementById("leaderDutyInput")
          .value
          .trim();


      const phone =
        document
          .getElementById("leaderPhoneInput")
          .value
          .trim();


      const bio =
        document
          .getElementById("leaderBioInput")
          .value
          .trim();


      if (!name) {

        alert("กรุณากรอกชื่อ-นามสกุล");

        return;

      }


      /*
       * แก้ไขข้อมูลเดิม
       */

      if (id) {

        const index =
          leaders.findIndex(
            item =>
              String(item.id) === String(id)
          );


        if (index === -1) {

          alert("ไม่พบข้อมูลเดิม");

          return;

        }


        leaders[index] = {

          ...leaders[index],

          name,
          role,
          duty,
          phone,
          bio,

          image:
            currentImageData ||
            leaders[index].image ||
            ""

        };


        saveLeaders();

        renderLeaders();

        closeLeaderForm();

        alert("แก้ไขข้อมูลเรียบร้อยแล้ว");

        return;

      }


      /*
       * เพิ่มข้อมูลใหม่
       */

      const newLeader = {

        id:
          "leader-" +
          Date.now(),

        name,
        role,
        duty,
        phone,
        bio,

        image:
          currentImageData || "",

        createdAt:
          new Date().toISOString()

      };


      leaders.unshift(
        newLeader
      );


      saveLeaders();

      renderLeaders();

      closeLeaderForm();


      alert("เพิ่มข้อมูลเรียบร้อยแล้ว");

    }
  );

}


/* =========================================================
   ปิด Modal เมื่อคลิกพื้นหลัง
   ========================================================= */

document.addEventListener(
  "click",
  function(event) {

    const modal =
      document.getElementById("leaderModal");


    if (
      modal &&
      event.target === modal
    ) {

      closeLeaderForm();

    }

  }
);


/* =========================================================
   ESC ปิด Modal
   ========================================================= */

document.addEventListener(
  "keydown",
  function(event) {

    if (event.key !== "Escape") return;


    const modal =
      document.getElementById("leaderModal");


    if (
      modal &&
      modal.classList.contains("show")
    ) {

      closeLeaderForm();

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
    document.getElementById("clock");

  const date =
    document.getElementById("date");


  if (!clock && !date) return;


  const now =
    new Date();


  if (clock) {

    clock.textContent =
      now.toLocaleTimeString(
        "th-TH",
        {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        }
      );

  }


  if (date) {

    date.textContent =
      now.toLocaleDateString(
        "th-TH",
        {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric"
        }
      );

  }

}


/* =========================================================
   ป้องกัน HTML Injection ในข้อมูลข้อความ
   ========================================================= */

function escapeHTML(value) {

  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}


/* =========================================================
   Export ข้อมูล
   ========================================================= */

window.exportLeaders = function() {

  const blob =
    new Blob(
      [
        JSON.stringify(
          leaders,
          null,
          2
        )
      ],
      {
        type: "application/json"
      }
    );


  const url =
    URL.createObjectURL(blob);


  const a =
    document.createElement("a");


  a.href = url;

  a.download =
    "rongkhem-leaders-backup.json";


  document.body.appendChild(a);

  a.click();

  a.remove();


  URL.revokeObjectURL(url);

};


/* =========================================================
   Import ข้อมูล
   ========================================================= */

window.importLeaders = function(file) {

  if (!file) return;


  const reader =
    new FileReader();


  reader.onload = function(event) {

    try {

      const imported =
        JSON.parse(
          event.target.result
        );


      if (!Array.isArray(imported)) {

        throw new Error(
          "รูปแบบข้อมูลไม่ถูกต้อง"
        );

      }


      leaders =
        imported;


      saveLeaders();

      renderLeaders();


      alert(
        "นำเข้าข้อมูลเรียบร้อยแล้ว"
      );


    } catch (error) {

      console.error(error);

      alert(
        "ไม่สามารถนำเข้าข้อมูลได้"
      );

    }

  };


  reader.readAsText(file);

};


/* =========================================================
   เปิดหน้าจอรายละเอียด
   ========================================================= */

window.viewLeader = function(id) {

  const item =
    leaders.find(
      leader =>
        String(leader.id) === String(id)
    );


  if (!item) return;


  alert(
    "ชื่อ: " + item.name +
    "\nตำแหน่ง: " + item.role +
    "\nหน้าที่: " + item.duty +
    "\nโทรศัพท์: " + item.phone +
    "\n\nประวัติ:\n" +
    item.bio
  );

};


/* =========================================================
   Debug
   ========================================================= */

window.RONGKHEM_LEADERS = {

  getAll() {

    return leaders;

  },

  save() {

    saveLeaders();

  },

  reload() {

    loadLeaders();

    renderLeaders();

  }

};

})();
