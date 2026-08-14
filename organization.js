/* =========================================================
   RONGKHEM e-VILLAGE OFFICE
   organization.js
   โครงสร้างองค์กรและกลุ่มชุมชน บ้านร่องเข็ม หมู่ 6
   ========================================================= */

"use strict";

(() => {

const STORAGE_KEY = "rongkhem_community_organizations_v1";

let organizations = [];


/* =========================================================
   ข้อมูลเริ่มต้น
   ========================================================= */

const defaultOrganizations = [

  {
    id: "leaders",
    icon: "👔",
    title: "กลุ่มผู้นำชุมชน",
    description:
      "ผู้นำชุมชนที่ทำหน้าที่ดูแล ปกครอง พัฒนาชุมชน และประสานงานกับหน่วยงานภายนอก",
    type: "ทางการ",

    members: [

      {
        id: "leader-001",
        name: "นายศักรนนทน์ ขัติย์วงศ์",
        position: "ผู้ใหญ่บ้าน"
      },

      {
        id: "leader-002",
        name: "นายจักร์กวัส ประพลรัตนัง",
        position: "ผู้ช่วยผู้ใหญ่บ้าน"
      },

      {
        id: "leader-003",
        name: "นางสาวสุภาพร วังมูล",
        position: "ผู้ช่วยผู้ใหญ่บ้าน"
      }

    ]

  },


  {
    id: "village-committee",
    icon: "🏛️",
    title: "คณะกรรมการหมู่บ้าน",
    description:
      "คณะกรรมการที่ช่วยงานผู้ใหญ่บ้าน และปฏิบัติหน้าที่ตามแบบแผนของทางราชการหรือที่นายอำเภอมอบหมาย",
    type: "ทางการ",

    members: [

      {
        id: "committee-001",
        name: "นายอัครวัฒน์ วรพิพัฒน์ผัดดี",
        position: "กรรมการ"
      },

      {
        id: "committee-002",
        name: "นายยนต์ บุญธิวงศ์",
        position: "กรรมการ"
      },

      {
        id: "committee-003",
        name: "นางสาวนวกชมณ ปิงเมือง",
        position: "กรรมการ"
      },

      {
        id: "committee-004",
        name: "นายประจักษ์ งานดี",
        position: "กรรมการ"
      },

      {
        id: "committee-005",
        name: "นายยรรยง ผัดดี",
        position: "กรรมการ"
      },

      {
        id: "committee-006",
        name: "นายผัด เครือนวล",
        position: "กรรมการ"
      },

      {
        id: "committee-007",
        name: "นายสุนิตย์ ไข่หนู",
        position: "กรรมการ"
      },

      {
        id: "committee-008",
        name: "นายทวัน ทาฤทธิ์",
        position: "กรรมการ"
      }

    ]

  },


  {
    id: "village-fund",
    icon: "💰",
    title: "กองทุนหมู่บ้าน",
    description:
      "แหล่งเงินทุนหมุนเวียนสำหรับการลงทุนเพื่อพัฒนาอาชีพ สร้างงาน และสร้างรายได้ในชุมชน",
    type: "ทางการ",

    members: [

      {
        id: "fund-001",
        name: "นายสมเกียรติ อุปเสน",
        position: "สมาชิก"
      },

      {
        id: "fund-002",
        name: "นายวันชัย บุญเก่ง",
        position: "สมาชิก"
      },

      {
        id: "fund-003",
        name: "นายธวัชชัย บุญเก่ง",
        position: "สมาชิก"
      },

      {
        id: "fund-004",
        name: "นางไสว ศรีไชยอิน",
        position: "สมาชิก"
      },

      {
        id: "fund-005",
        name: "นายภาณุพงษ์ ผัดดี",
        position: "สมาชิก"
      },

      {
        id: "fund-006",
        name: "นายธนารันทกร ทินนา",
        position: "สมาชิก"
      },

      {
        id: "fund-007",
        name: "นางอัมพร ปิงเมือง",
        position: "สมาชิก"
      },

      {
        id: "fund-008",
        name: "นายมา วังมูล",
        position: "สมาชิก"
      },

      {
        id: "fund-009",
        name: "นายสนาน วังมูล",
        position: "สมาชิก"
      }

    ]

  },


  {
    id: "village-health-volunteers",
    icon: "❤️",
    title: "อาสาสมัครสาธารณสุขประจำหมู่บ้าน (อสม.)",
    description:
      "กลุ่มอาสาสมัครสาธารณสุขประจำหมู่บ้าน จำนวน 26 คน ทำหน้าที่ด้านสุขภาพและประสานงานกับหน่วยบริการสาธารณสุข",
    type: "ทางการ",

    members: [

      {
        id: "osm-001",
        name: "นางดวงแข จันทร์มูล",
        position: "ประธาน อสม."
      },

      {
        id: "osm-002",
        name: "นางเกษร ผัดดี",
        position: "สมาชิก"
      },

      {
        id: "osm-003",
        name: "นางศศิธร เข็มแก้ว",
        position: "สมาชิก"
      },

      {
        id: "osm-004",
        name: "นางบัวจีน ปันใจ",
        position: "สมาชิก"
      },

      {
        id: "osm-005",
        name: "นายพัฒนศักดิ์ ดีกัลป์ลา",
        position: "สมาชิก"
      },

      {
        id: "osm-006",
        name: "นางอำพร ปิงเมือง",
        position: "สมาชิก"
      },

      {
        id: "osm-007",
        name: "นางจันทร์สม ปิงเมือง",
        position: "สมาชิก"
      },

      {
        id: "osm-008",
        name: "นางกรรณิการ์ นาแพร่",
        position: "สมาชิก"
      },

      {
        id: "osm-009",
        name: "นายชุมพล ใฝ่ใจ",
        position: "สมาชิก"
      },

      {
        id: "osm-010",
        name: "นางแสงเดือน จันทร์มูล",
        position: "สมาชิก"
      },

      {
        id: "osm-011",
        name: "นางบัวหนอง ขัติย์ษิ",
        position: "สมาชิก"
      },

      {
        id: "osm-012",
        name: "นางทวีพร จันทร์มูล",
        position: "สมาชิก"
      },

      {
        id: "osm-013",
        name: "นายแก้วมูล ทินนา",
        position: "สมาชิก"
      },

      {
        id: "osm-014",
        name: "นางอลิษา ใฝ่จิตต์",
        position: "สมาชิก"
      },

      {
        id: "osm-015",
        name: "นางเขียว งามจิต",
        position: "สมาชิก"
      },

      {
        id: "osm-016",
        name: "นางเพ็ญศรี งามจิต",
        position: "สมาชิก"
      },

      {
        id: "osm-017",
        name: "นางจันทร์ฉาม วงค์ปัญญา",
        position: "สมาชิก"
      },

      {
        id: "osm-018",
        name: "นางบัวหนา ทาฤทธ์",
        position: "สมาชิก"
      },

      {
        id: "osm-019",
        name: "นายอิ่ม จักจุ่ม",
        position: "สมาชิก"
      },

      {
        id: "osm-020",
        name: "นายปัน ผัดดี",
        position: "สมาชิก"
      },

      {
        id: "osm-021",
        name: "นายสุพัศน์ ปันใจ",
        position: "สมาชิก"
      },

      {
        id: "osm-022",
        name: "นายธนวัฒน์ ปันใจ",
        position: "สมาชิก"
      },

      {
        id: "osm-023",
        name: "นางอำไพวิทย์ ปัญญา",
        position: "สมาชิก"
      },

      {
        id: "osm-024",
        name: "นางอำภา งามจิต",
        position: "สมาชิก"
      },

      {
        id: "osm-025",
        name: "นายพิพัฒน์ ใฝ่ใจ",
        position: "สมาชิก"
      },

      {
        id: "osm-026",
        name: "นายประจักร งานดี",
        position: "สมาชิก"
      }

    ]

  },


  {
    id: "housewives",
    icon: "👩‍🌾",
    title: "กลุ่มแม่บ้าน",
    description:
      "กลุ่มที่รวมตัวของผู้หญิงในหมู่บ้าน เพื่อทำงานร่วมกันในกิจกรรมต่าง ๆ ของชุมชน",
    type: "ไม่เป็นทางการ",

    members: [

      {
        id: "housewife-001",
        name: "นางสาวจีรวรรณ ผัดดี",
        position: "ประธาน"
      },

      {
        id: "housewife-002",
        name: "นางสำรอง มหาวรรณศรี",
        position: "รองประธาน"
      },

      {
        id: "housewife-003",
        name: "นางสุภาวดี วังมูล",
        position: "เลขาฯ"
      },

      {
        id: "housewife-004",
        name: "นางอารีย์ ประพลรัตนัง",
        position: "เหรัญญิก"
      },

      {
        id: "housewife-005",
        name: "นางเดือนฉาย เครือวัลย์",
        position: "กรรมการ"
      },

      {
        id: "housewife-006",
        name: "นางวิลาวรรณ วังมูล",
        position: "กรรมการ"
      },

      {
        id: "housewife-007",
        name: "นางนงคราญ ยะนา",
        position: "กรรมการ"
      },

      {
        id: "housewife-008",
        name: "นางอาลิษา กอเตอะ",
        position: "กรรมการ"
      },

      {
        id: "housewife-009",
        name: "นางสุพรรณี บุญส่ง",
        position: "กรรมการ"
      },

      {
        id: "housewife-010",
        name: "นางสุปราณี ถิ่นลำปาง",
        position: "กรรมการ"
      },

      {
        id: "housewife-011",
        name: "นางปวีณา มิ่งขวัญ",
        position: "กรรมการ"
      },

      {
        id: "housewife-012",
        name: "นางสุดา บุญเก่ง",
        position: "กรรมการ"
      },

      {
        id: "housewife-013",
        name: "นางบรรณาลักษณ์ พลูคำ",
        position: "กรรมการ"
      },

      {
        id: "housewife-014",
        name: "นางกรรณิการ์ นาแพร่",
        position: "กรรมการ"
      },

      {
        id: "housewife-015",
        name: "นางกรรณิกา บุญเก่ง",
        position: "กรรมการ"
      }

    ]

  },


  {
    id: "security",
    icon: "🛡️",
    title: "ชุดรักษาความปลอดภัยหมู่บ้าน (ชรบ.)",
    description:
      "ชุดรักษาความปลอดภัยหมู่บ้าน ทำหน้าที่สนับสนุนการรักษาความสงบเรียบร้อยและความปลอดภัยในชุมชน",
    type: "ไม่เป็นทางการ",

    members: [

      {
        id: "security-001",
        name: "นายวันชัย บุญเก่ง",
        position: "สมาชิก"
      },

      {
        id: "security-002",
        name: "นายผัด เครือนวล",
        position: "สมาชิก"
      },

      {
        id: "security-003",
        name: "นายสรชัย ใฝ่ใจ",
        position: "สมาชิก"
      },

      {
        id: "security-004",
        name: "นายอินทอง บุญธิวงค์",
        position: "สมาชิก"
      },

      {
        id: "security-005",
        name: "นายชุมพล ใฝ่ใจ",
        position: "สมาชิก"
      },

      {
        id: "security-006",
        name: "นายศักรนนทน์ ขัติย์วงศ์",
        position: "สมาชิก"
      },

      {
        id: "security-007",
        name: "นายจักรวัส ประพลรัตนัง",
        position: "สมาชิก"
      },

      {
        id: "security-008",
        name: "นายยรรยง ผัดดี",
        position: "สมาชิก"
      },

      {
        id: "security-009",
        name: "นายประจักร งานดี",
        position: "สมาชิก"
      },

      {
        id: "security-010",
        name: "นางสาวสุภาพร วังมูล",
        position: "สมาชิก"
      },

      {
        id: "security-011",
        name: "นายธวัชชัย ทาทอง",
        position: "สมาชิก"
      },

      {
        id: "security-012",
        name: "นายธวัชชัย บุญเก่ง",
        position: "สมาชิก"
      }

    ]

  },


  {
    id: "funeral",
    icon: "⚰️",
    title: "กลุ่มฌาปนกิจ",
    description:
      "กลุ่มที่ร่วมกับหมู่บ้าน เมื่อมีสมาชิกเสียชีวิต จะเก็บเงินจากสมาชิกหลังคาเรือนละ 100 บาทต่อศพ และรวบรวมมอบให้ครอบครัวของสมาชิกที่เสียชีวิต",
    type: "ไม่เป็นทางการ",

    members: []

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

  loadOrganizations();

  renderOrganizations();

}


/* =========================================================
   โหลดข้อมูล
   ========================================================= */

function loadOrganizations() {

  try {

    const saved =
      localStorage.getItem(
        STORAGE_KEY
      );

    if (saved) {

      const parsed =
        JSON.parse(saved);

      if (
        Array.isArray(parsed)
      ) {

        organizations =
          parsed;

        return;

      }

    }

  } catch(error) {

    console.error(
      "โหลดข้อมูลองค์กรไม่สำเร็จ",
      error
    );

  }


  organizations =
    JSON.parse(
      JSON.stringify(
        defaultOrganizations
      )
    );


  saveOrganizations();

}


/* =========================================================
   บันทึกข้อมูล
   ========================================================= */

function saveOrganizations() {

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(
      organizations
    )
  );

}


/* =========================================================
   แสดงองค์กร
   ========================================================= */

window.renderOrganizations =
function() {

  const container =
    document.getElementById(
      "organizationList"
    );


  if (!container) return;


  if (
    organizations.length === 0
  ) {

    container.innerHTML = `

      <div class="orgEmpty">

        <div>👥</div>

        <h3>
          ยังไม่มีข้อมูลองค์กรชุมชน
        </h3>

        <button
          onclick="addOrganization()"
          class="orgBtn orgAdd"
        >
          ➕ เพิ่มองค์กร
        </button>

      </div>

    `;

    return;

  }


  container.innerHTML =
    organizations
      .map(
        renderOrganizationCard
      )
      .join("");

};


/* =========================================================
   Card องค์กร
   ========================================================= */

function renderOrganizationCard(org) {

  const count =
    org.members
      ? org.members.length
      : 0;


  const membersHTML =
    count > 0

      ? org.members
          .map(
            (
              member,
              index
            ) => `

              <div
                class="memberRow"
                data-member-id="${escapeHTML(member.id)}"
              >

                <div class="memberNumber">
                  ${index + 1}
                </div>

                <div class="memberAvatar">
                  ${org.icon}
                </div>

                <div class="memberInfo">

                  <strong>
                    ${escapeHTML(member.name)}
                  </strong>

                  <small>
                    ${escapeHTML(member.position || "สมาชิก")}
                  </small>

                </div>

                <div class="memberActions">

                  <button
                    class="miniEdit"
                    onclick="
                      editMember(
                        '${org.id}',
                        '${member.id}'
                      )
                    "
                  >
                    ✏️
                  </button>

                  <button
                    class="miniDelete"
                    onclick="
                      deleteMember(
                        '${org.id}',
                        '${member.id}'
                      )
                    "
                  >
                    🗑️
                  </button>

                </div>

              </div>

            `
          )
          .join("")

      : `

          <div class="noMembers">

            📋 ยังไม่มีรายชื่อสมาชิก

          </div>

        `;


  return `

    <article
      class="organizationCard"
      id="org-${org.id}"
    >

      <div class="organizationHeader">

        <div class="organizationIcon">
          ${org.icon}
        </div>

        <div class="organizationTitle">

          <div class="organizationType">
            ${escapeHTML(org.type)}
          </div>

          <h2>
            ${escapeHTML(org.title)}
          </h2>

          <p>
            ${escapeHTML(org.description)}
          </p>

        </div>

        <div class="organizationCount">

          <strong>
            ${count}
          </strong>

          <span>
            คน
          </span>

        </div>

      </div>


      <div class="organizationToolbar">

        <button
          class="orgBtn orgAdd"
          onclick="
            addMember('${org.id}')
          "
        >
          ➕ เพิ่มสมาชิก
        </button>

        <button
          class="orgBtn orgEdit"
          onclick="
            editOrganization('${org.id}')
          "
        >
          ✏️ แก้ไของค์กร
        </button>

        <button
          class="orgBtn orgDelete"
          onclick="
            deleteOrganization('${org.id}')
          "
        >
          🗑️ ลบองค์กร
        </button>

      </div>


      <div class="memberList">

        ${membersHTML}

      </div>

    </article>

  `;

}


/* =========================================================
   เพิ่มสมาชิก
   ========================================================= */

window.addMember =
function(orgId) {

  const org =
    organizations.find(
      x => x.id === orgId
    );


  if (!org) return;


  const name =
    prompt(
      "กรอกชื่อ-นามสกุลสมาชิก"
    );


  if (!name) return;


  const position =
    prompt(
      "กรอกตำแหน่ง",
      "สมาชิก"
    ) || "สมาชิก";


  org.members =
    org.members || [];


  org.members.push({

    id:
      "member-" +
      Date.now(),

    name:
      name.trim(),

    position:
      position.trim()

  });


  saveOrganizations();

  renderOrganizations();

};


/* =========================================================
   แก้ไขสมาชิก
   ========================================================= */

window.editMember =
function(
  orgId,
  memberId
) {

  const org =
    organizations.find(
      x => x.id === orgId
    );


  if (!org) return;


  const member =
    org.members.find(
      x =>
        String(x.id) ===
        String(memberId)
    );


  if (!member) return;


  const name =
    prompt(
      "แก้ไขชื่อ-นามสกุล",
      member.name
    );


  if (
    name === null
  ) return;


  const position =
    prompt(
      "แก้ไขตำแหน่ง",
      member.position || "สมาชิก"
    );


  if (
    position === null
  ) return;


  member.name =
    name.trim();


  member.position =
    position.trim();


  saveOrganizations();

  renderOrganizations();

};


/* =========================================================
   ลบสมาชิก
   ========================================================= */

window.deleteMember =
function(
  orgId,
  memberId
) {

  const org =
    organizations.find(
      x => x.id === orgId
    );


  if (!org) return;


  const member =
    org.members.find(
      x =>
        String(x.id) ===
        String(memberId)
    );


  if (!member) return;


  const ok =
    confirm(
      "ยืนยันการลบสมาชิก\n\n" +
      member.name
    );


  if (!ok) return;


  org.members =
    org.members.filter(
      x =>
        String(x.id) !==
        String(memberId)
    );


  saveOrganizations();

  renderOrganizations();

};


/* =========================================================
   เพิ่มองค์กร
   ========================================================= */

window.addOrganization =
function() {

  const title =
    prompt(
      "ชื่อองค์กร / กลุ่มชุมชน"
    );


  if (!title) return;


  const description =
    prompt(
      "รายละเอียดองค์กร",
      ""
    ) || "";


  const icon =
    prompt(
      "ไอคอน",
      "👥"
    ) || "👥";


  const type =
    prompt(
      "ประเภทองค์กร",
      "ไม่เป็นทางการ"
    ) || "ไม่เป็นทางการ";


  organizations.push({

    id:
      "org-" +
      Date.now(),

    icon,

    title:
      title.trim(),

    description:
      description.trim(),

    type:
      type.trim(),

    members: []

  });


  saveOrganizations();

  renderOrganizations();

};


/* =========================================================
   แก้ไของค์กร
   ========================================================= */

window.editOrganization =
function(id) {

  const org =
    organizations.find(
      x => x.id === id
    );


  if (!org) return;


  const title =
    prompt(
      "แก้ไขชื่อองค์กร",
      org.title
    );


  if (
    title === null
  ) return;


  const description =
    prompt(
      "แก้ไขรายละเอียด",
      org.description
    );


  if (
    description === null
  ) return;


  const icon =
    prompt(
      "แก้ไขไอคอน",
      org.icon
    );


  if (
    icon === null
  ) return;


  org.title =
    title.trim();


  org.description =
    description.trim();


  org.icon =
    icon.trim() ||
    "👥";


  saveOrganizations();

  renderOrganizations();

};


/* =========================================================
   ลบองค์กร
   ========================================================= */

window.deleteOrganization =
function(id) {

  const org =
    organizations.find(
      x => x.id === id
    );


  if (!org) return;


  const ok =
    confirm(
      "ยืนยันการลบองค์กรนี้?\n\n" +
      org.title +
      "\n\n" +
      "รายชื่อสมาชิกทั้งหมดจะถูกลบออกจากข้อมูลนี้ด้วย"
    );


  if (!ok) return;


  organizations =
    organizations.filter(
      x => x.id !== id
    );


  saveOrganizations();

  renderOrganizations();

};


/* =========================================================
   ค้นหาองค์กร / สมาชิก
   ========================================================= */

window.searchOrganizations =
function(keyword) {

  const cards =
    document.querySelectorAll(
      ".organizationCard"
    );


  const q =
    String(keyword || "")
      .trim()
      .toLowerCase();


  cards.forEach(card => {

    if (!q) {

      card.style.display =
        "";

      return;

    }


    const text =
      card.textContent
        .toLowerCase();


    card.style.display =
      text.includes(q)
        ? ""
        : "none";

  });

};


/* =========================================================
   ส่งออกข้อมูล
   ========================================================= */

window.exportOrganizations =
function() {

  const data =
    JSON.stringify(
      organizations,
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


  const link =
    document.createElement(
      "a"
    );


  link.href =
    url;


  link.download =
    "rongkhem-organizations.json";


  document.body.appendChild(
    link
  );


  link.click();

  link.remove();


  URL.revokeObjectURL(
    url
  );

};


/* =========================================================
   นำเข้าข้อมูล
   ========================================================= */

window.importOrganizations =
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
          "รูปแบบข้อมูลไม่ถูกต้อง"
        );

      }


      organizations =
        data;


      saveOrganizations();

      renderOrganizations();


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
   คืนค่าข้อมูลตั้งต้น
   ========================================================= */

window.resetOrganizations =
function() {

  const ok =
    confirm(
      "ต้องการคืนค่าข้อมูลองค์กรทั้งหมดตามข้อมูลตั้งต้นหรือไม่?"
    );


  if (!ok) return;


  organizations =
    JSON.parse(
      JSON.stringify(
        defaultOrganizations
      )
    );


  saveOrganizations();

  renderOrganizations();


  alert(
    "คืนค่าข้อมูลเรียบร้อยแล้ว"
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
   API สำหรับไฟล์อื่น
   ========================================================= */

window.RONGKHEM_ORGANIZATIONS = {

  getAll() {

    return organizations;

  },

  get(id) {

    return organizations.find(
      x => x.id === id
    );

  },

  save() {

    saveOrganizations();

  },

  render() {

    renderOrganizations();

  }

};

})();
