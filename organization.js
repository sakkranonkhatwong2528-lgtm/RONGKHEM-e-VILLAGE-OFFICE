/* =========================================================
   RONGKHEM e-VILLAGE OFFICE
   organization.js
   ระบบองค์กรและกลุ่มชุมชน

   รองรับ:
   - ชรบ.
   - อปพร.
   - อสม.
   - กลุ่มผู้สูงอายุ
   - กลุ่มแม่บ้าน
   - เพิ่ม
   - แก้ไข
   - ลบ
   - ค้นหา
   - อัปโหลดรูป
   - สำรองข้อมูล
   - นำเข้าข้อมูล
   ========================================================= */

"use strict";

(() => {

  const STORAGE_KEY = "rongkhem_organizations_v1";

  let members = [];
  let currentType = "ชรบ.";
  let currentImageData = "";


  /* =======================================================
     ชื่อองค์กร
     ======================================================= */

  const organizationInfo = {

    "ชรบ.": {
      title: "🛡️ ชุดรักษาความปลอดภัยหมู่บ้าน (ชรบ.)",
      icon: "🛡️"
    },

    "อปพร.": {
      title: "🚒 อาสาสมัครป้องกันภัยฝ่ายพลเรือน (อปพร.)",
      icon: "🚒"
    },

    "อสม.": {
      title: "🩺 อาสาสมัครสาธารณสุขประจำหมู่บ้าน (อสม.)",
      icon: "🩺"
    },

    "ผู้สูงอายุ": {
      title: "👴 กลุ่มผู้สูงอายุ",
      icon: "👴"
    },

    "แม่บ้าน": {
      title: "👩‍🌾 กลุ่มแม่บ้าน",
      icon: "👩‍🌾"
    }

  };


  /* =======================================================
     ข้อมูลเริ่มต้น
     ======================================================= */

  const defaultMembers = [

    {
      id: "org-001",
      name: "ตัวอย่างสมาชิก ชรบ.",
      type: "ชรบ.",
      role: "สมาชิก",
      gender: "ชาย",
      phone: "",
      status: "ปฏิบัติงาน",
      bio: "ข้อมูลตัวอย่าง สามารถแก้ไขหรือลบได้",
      image: "",
      createdAt: new Date().toISOString()
    }

  ];


  /* =======================================================
     เริ่มระบบ
     ======================================================= */

  document.addEventListener(
    "DOMContentLoaded",
    init
  );


  function init() {

    loadMembers();

    setupForm();

    setupClock();

    detectTypeFromURL();

    renderMembers();

    updateSummary();

  }


  /* =======================================================
     โหลดข้อมูล
     ======================================================= */

  function loadMembers() {

    try {

      const saved =
        localStorage.getItem(STORAGE_KEY);

      if (saved) {

        const parsed =
          JSON.parse(saved);

        if (Array.isArray(parsed)) {

          members = parsed;

          return;

        }

      }

    } catch (error) {

      console.error(
        "โหลดข้อมูลองค์กรไม่สำเร็จ",
        error
      );

    }


    members =
      JSON.parse(
        JSON.stringify(defaultMembers)
      );


    saveMembers();

  }


  /* =======================================================
     บันทึก
     ======================================================= */

  function saveMembers() {

    try {

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(members)
      );

    } catch (error) {

      console.error(
        "บันทึกข้อมูลไม่สำเร็จ",
        error
      );

      alert(
        "ไม่สามารถบันทึกข้อมูลได้\n\n" +
        "อาจเป็นเพราะพื้นที่จัดเก็บรูปภาพเต็ม"
      );

    }

  }


  /* =======================================================
     ตรวจสอบ ?type=
     เช่น organization.html?type=อปพร.
     ======================================================= */

  function detectTypeFromURL() {

    const params =
      new URLSearchParams(
        window.location.search
      );

    const type =
      params.get("type");

    if (
      type &&
      organizationInfo[type]
    ) {

      currentType = type;

    }


    updateTabs();

  }


  /* =======================================================
     เปลี่ยนองค์กร
     ======================================================= */

  window.switchOrganization =
    function(type) {

      if (!organizationInfo[type]) {
        return;
      }


      currentType = type;


      updateTabs();

      renderMembers();

      updateSummary();

      updateTitle();


      const search =
        document.getElementById(
          "memberSearch"
        );

      if (search) {
        search.value = "";
      }

    };


  /* =======================================================
     ปรับปุ่ม Tab
     ======================================================= */

  function updateTabs() {

    document
      .querySelectorAll(".orgTab")
      .forEach(button => {

        const type =
          button.dataset.type;

        button.classList.toggle(
          "active",
          type === currentType
        );

      });

  }


  /* =======================================================
     หัวข้อ
     ======================================================= */

  function updateTitle() {

    const title =
      document.getElementById(
        "organizationTitle"
      );

    if (!title) return;


    const info =
      organizationInfo[currentType];

    if (!info) return;


    title.textContent =
      info.title;

  }


  /* =======================================================
     แสดงสมาชิก
     ======================================================= */

  window.renderMembers =
    function() {

      const grid =
        document.getElementById(
          "memberGrid"
        );

      if (!grid) return;


      const search =
        document.getElementById(
          "memberSearch"
        );


      const keyword =
        search
          ? search.value
              .trim()
              .toLowerCase()
          : "";


      const filtered =
        members.filter(item => {

          if (
            item.type !== currentType
          ) {

            return false;

          }


          if (!keyword) {

            return true;

          }


          const text = [

            item.name,
            item.role,
            item.phone,
            item.status,
            item.bio

          ]
          .join(" ")
          .toLowerCase();


          return text.includes(
            keyword
          );

        });


      if (filtered.length === 0) {

        grid.innerHTML = `

          <div class="emptyBox">

            <div class="icon">
              ${organizationInfo[currentType]?.icon || "👥"}
            </div>

            <h3>
              ยังไม่มีข้อมูลสมาชิก
            </h3>

            <p>
              กดปุ่ม
              "➕ เพิ่มสมาชิก"
              เพื่อเพิ่มข้อมูล
            </p>

          </div>

        `;

        return;

      }


      grid.innerHTML =
        filtered
          .map(
            createMemberCard
          )
          .join("");

    };


  /* =======================================================
     สร้าง Card
     ======================================================= */

  function createMemberCard(item) {

    const image =
      item.image ||
      "https://via.placeholder.com/600x450?text=RONGKHEM";


    const statusClass =
      item.status === "ปฏิบัติงาน"
        ? "color:#059669;"
        : "color:#dc2626;";


    return `

      <article class="memberCard">

        <img
          class="memberPhoto"
          src="${image}"
          alt="${escapeHTML(item.name)}"
          onerror="
            this.src='https://via.placeholder.com/600x450?text=RONGKHEM'
          "
        >

        <div class="memberInfo">

          <div class="memberRole">
            ${escapeHTML(item.type || "-")}
          </div>

          <div class="memberName">
            ${escapeHTML(item.name || "-")}
          </div>

          <div class="memberDetail">

            <div>
              <strong>หน้าที่:</strong>
              ${escapeHTML(item.role || "-")}
            </div>

            <div>
              <strong>เพศ:</strong>
              ${escapeHTML(item.gender || "-")}
            </div>

            <div>
              <strong>โทรศัพท์:</strong>
              ${escapeHTML(item.phone || "-")}
            </div>

            <div style="${statusClass};font-weight:700;margin-top:5px;">
              ● ${escapeHTML(item.status || "-")}
            </div>

            <div style="margin-top:8px;">
              ${escapeHTML(item.bio || "")}
            </div>

          </div>


          <div class="actions">

            <button
              class="btn btnEdit"
              onclick="
                editMember('${item.id}')
              "
            >
              ✏️ แก้ไข
            </button>


            <button
              class="btn btnDelete"
              onclick="
                deleteMember('${item.id}')
              "
            >
              🗑️ ลบ
            </button>

          </div>

        </div>

      </article>

    `;

  }


  /* =======================================================
     สรุปจำนวน
     ======================================================= */

  function updateSummary() {

    const data =
      members.filter(
        item =>
          item.type === currentType
      );


    let male = 0;

    let female = 0;

    let active = 0;


    data.forEach(item => {

      if (item.gender === "ชาย") {
        male++;
      }

      if (item.gender === "หญิง") {
        female++;
      }

      if (item.status === "ปฏิบัติงาน") {
        active++;
      }

    });


    setText(
      "countMembers",
      data.length
    );

    setText(
      "countMale",
      male
    );

    setText(
      "countFemale",
      female
    );

    setText(
      "countActive",
      active
    );

  }


  function setText(id, value) {

    const element =
      document.getElementById(id);

    if (element) {

      element.textContent =
        value;

    }

  }


  /* =======================================================
     เปิดฟอร์ม
     ======================================================= */

  window.openMemberForm =
    function() {

      const modal =
        document.getElementById(
          "memberModal"
        );

      const form =
        document.getElementById(
          "memberForm"
        );


      if (!modal || !form) {
        return;
      }


      form.reset();


      document.getElementById(
        "memberId"
      ).value = "";


      document.getElementById(
        "memberType"
      ).value =
        currentType;


      document.getElementById(
        "memberFormTitle"
      ).textContent =
        "➕ เพิ่มสมาชิก";


      currentImageData = "";


      const preview =
        document.getElementById(
          "memberPreview"
        );


      if (preview) {

        preview.src =
          "https://via.placeholder.com/300x300?text=PHOTO";

      }


      modal.classList.add(
        "show"
      );

    };


  /* =======================================================
     ปิดฟอร์ม
     ======================================================= */

  window.closeMemberForm =
    function() {

      const modal =
        document.getElementById(
          "memberModal"
        );


      if (modal) {

        modal.classList.remove(
          "show"
        );

      }

    };


  /* =======================================================
     แก้ไขสมาชิก
     ======================================================= */

  window.editMember =
    function(id) {

      const item =
        members.find(
          member =>
            String(member.id) ===
            String(id)
        );


      if (!item) {

        alert(
          "ไม่พบข้อมูลสมาชิก"
        );

        return;

      }


      document.getElementById(
        "memberId"
      ).value =
        item.id;


      document.getElementById(
        "memberName"
      ).value =
        item.name || "";


      document.getElementById(
        "memberType"
      ).value =
        item.type || currentType;


      document.getElementById(
        "memberRole"
      ).value =
        item.role || "";


      document.getElementById(
        "memberGender"
      ).value =
        item.gender || "ชาย";


      document.getElementById(
        "memberPhone"
      ).value =
        item.phone || "";


      document.getElementById(
        "memberStatus"
      ).value =
        item.status || "ปฏิบัติงาน";


      document.getElementById(
        "memberBio"
      ).value =
        item.bio || "";


      const preview =
        document.getElementById(
          "memberPreview"
        );


      if (preview) {

        preview.src =
          item.image ||
          "https://via.placeholder.com/300x300?text=PHOTO";

      }


      currentImageData =
        item.image || "";


      document.getElementById(
        "memberFormTitle"
      ).textContent =
        "✏️ แก้ไขข้อมูลสมาชิก";


      document
        .getElementById(
          "memberModal"
        )
        .classList.add(
          "show"
        );

    };


  /* =======================================================
     ลบสมาชิก
     ======================================================= */

  window.deleteMember =
    function(id) {

      const item =
        members.find(
          member =>
            String(member.id) ===
            String(id)
        );


      if (!item) {
        return;
      }


      const ok =
        confirm(
          "ยืนยันการลบข้อมูล?\n\n" +
          item.name +
          "\n" +
          item.type
        );


      if (!ok) {
        return;
      }


      members =
        members.filter(
          member =>
            String(member.id) !==
            String(id)
        );


      saveMembers();

      renderMembers();

      updateSummary();


      alert(
        "ลบข้อมูลเรียบร้อยแล้ว"
      );

    };


  /* =======================================================
     Preview รูป
     ======================================================= */

  window.previewMemberImage =
    function(event) {

      const file =
        event.target.files &&
        event.target.files[0];


      if (!file) {
        return;
      }


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
          "ไฟล์รูปใหญ่เกินไป\n" +
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
                1000;

              const maxHeight =
                1000;


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
                  "memberPreview"
                );


              if (preview) {

                preview.src =
                  currentImageData;

              }

            };


          image.src =
            event.target.result;

        };


      reader.readAsDataURL(file);

    };


  /* =======================================================
     Submit Form
     ======================================================= */

  function setupForm() {

    const form =
      document.getElementById(
        "memberForm"
      );


    if (!form) {
      return;
    }


    form.addEventListener(
      "submit",
      function(event) {

        event.preventDefault();


        const id =
          document.getElementById(
            "memberId"
          ).value.trim();


        const name =
          document.getElementById(
            "memberName"
          ).value.trim();


        const type =
          document.getElementById(
            "memberType"
          ).value;


        const role =
          document.getElementById(
            "memberRole"
          ).value.trim();


        const gender =
          document.getElementById(
            "memberGender"
          ).value;


        const phone =
          document.getElementById(
            "memberPhone"
          ).value.trim();


        const status =
          document.getElementById(
            "memberStatus"
          ).value;


        const bio =
          document.getElementById(
            "memberBio"
          ).value.trim();


        if (!name) {

          alert(
            "กรุณากรอกชื่อ-นามสกุล"
          );

          return;

        }


        /* -------------------------------
           แก้ไข
           ------------------------------- */

        if (id) {

          const index =
            members.findIndex(
              item =>
                String(item.id) ===
                String(id)
            );


          if (index === -1) {

            alert(
              "ไม่พบข้อมูลเดิม"
            );

            return;

          }


          members[index] = {

            ...members[index],

            name,
            type,
            role,
            gender,
            phone,
            status,
            bio,

            image:
              currentImageData ||
              members[index].image ||
              ""

          };


          saveMembers();

          currentType = type;

          updateTabs();

          updateTitle();

          renderMembers();

          updateSummary();

          closeMemberForm();


          alert(
            "แก้ไขข้อมูลเรียบร้อยแล้ว"
          );


          return;

        }


        /* -------------------------------
           เพิ่ม
           ------------------------------- */

        const newMember = {

          id:
            "org-" +
            Date.now() +
            "-" +
            Math.random()
              .toString(36)
              .slice(2,7),

          name,
          type,
          role,
          gender,
          phone,
          status,
          bio,

          image:
            currentImageData || "",

          createdAt:
            new Date().toISOString()

        };


        members.unshift(
          newMember
        );


        saveMembers();


        currentType =
          type;


        updateTabs();

        updateTitle();

        renderMembers();

        updateSummary();

        closeMemberForm();


        alert(
          "เพิ่มข้อมูลเรียบร้อยแล้ว"
        );

      }
    );

  }


  /* =======================================================
     ปิด Modal เมื่อคลิกพื้นหลัง
     ======================================================= */

  document.addEventListener(
    "click",
    function(event) {

      const modal =
        document.getElementById(
          "memberModal"
        );


      if (
        modal &&
        event.target === modal
      ) {

        closeMemberForm();

      }

    }
  );


  /* =======================================================
     ESC
     ======================================================= */

  document.addEventListener(
    "keydown",
    function(event) {

      if (
        event.key !== "Escape"
      ) {
        return;
      }


      const modal =
        document.getElementById(
          "memberModal"
        );


      if (
        modal &&
        modal.classList.contains(
          "show"
        )
      ) {

        closeMemberForm();

      }

    }
  );


  /* =======================================================
     นาฬิกา
     ======================================================= */

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


  /* =======================================================
     สำรองข้อมูล
     ======================================================= */

  window.exportOrganizations =
    function() {

      const data =
        JSON.stringify(
          members,
          null,
          2
        );


      const blob =
        new Blob(
          [data],
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
        "rongkhem-organizations-backup.json";


      document.body.appendChild(a);

      a.click();

      a.remove();


      URL.revokeObjectURL(
        url
      );

    };


  /* =======================================================
     นำเข้าข้อมูล
     ======================================================= */

  window.importOrganizations =
    function(file) {

      if (!file) {
        return;
      }


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
                "รูปแบบไม่ถูกต้อง"
              );

            }


            members =
              data;


            saveMembers();

            renderMembers();

            updateSummary();


            alert(
              "นำเข้าข้อมูลเรียบร้อยแล้ว"
            );


          } catch(error) {

            console.error(
              error
            );

            alert(
              "ไฟล์ข้อมูลไม่ถูกต้อง"
            );

          }

        };


      reader.readAsText(
        file
      );

    };


  /* =======================================================
     ลบข้อมูลขององค์กรปัจจุบันทั้งหมด
     ======================================================= */

  window.deleteCurrentOrganization =
    function() {

      const count =
        members.filter(
          item =>
            item.type ===
            currentType
        ).length;


      if (!count) {

        alert(
          "ไม่มีข้อมูลให้ลบ"
        );

        return;

      }


      const ok =
        confirm(
          "⚠️ ระวัง\n\n" +
          "ต้องการลบสมาชิกทั้งหมดของ\n" +
          currentType +
          "\nจำนวน " +
          count +
          " รายการหรือไม่?"
        );


      if (!ok) {
        return;
      }


      members =
        members.filter(
          item =>
            item.type !==
            currentType
        );


      saveMembers();

      renderMembers();

      updateSummary();


      alert(
        "ลบข้อมูลทั้งหมดเรียบร้อยแล้ว"
      );

    };


  /* =======================================================
     ล้างข้อมูลตัวอย่าง
     ======================================================= */

  window.resetOrganizations =
    function() {

      const ok =
        confirm(
          "ต้องการคืนค่าข้อมูลเริ่มต้นหรือไม่?"
        );


      if (!ok) {
        return;
      }


      members =
        JSON.parse(
          JSON.stringify(
            defaultMembers
          )
        );


      saveMembers();

      renderMembers();

      updateSummary();


      alert(
        "คืนค่าข้อมูลเรียบร้อยแล้ว"
      );

    };


  /* =======================================================
     Escape HTML
     ======================================================= */

  function escapeHTML(value) {

    return String(value || "")

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


  /* =======================================================
     API สำหรับระบบอื่น
     ======================================================= */

  window.RONGKHEM_ORGANIZATIONS = {

    getAll() {

      return members;

    },


    getByType(type) {

      return members.filter(
        item =>
          item.type === type
      );

    },


    save() {

      saveMembers();

    },


    reload() {

      loadMembers();

      renderMembers();

      updateSummary();

    }

  };

})();
