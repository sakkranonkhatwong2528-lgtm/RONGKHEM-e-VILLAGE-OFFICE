/* =========================================================
   RONGKHEM e-VILLAGE OFFICE
   APP.JS — UNIVERSAL CONTENT MANAGER
   ส่วนที่ 1 / ...
   ========================================================= */

(function () {
    "use strict";

    /* =====================================================
       ตัวช่วยพื้นฐาน
       ===================================================== */

    const DATA = window.RONGKHEM_DATA || {};
    const CONFIG = window.RONGKHEM_CONFIG || {};

    const $ = (id) => document.getElementById(id);

    function escapeHTML(value) {
        return String(value ?? "")
            .replace(/[&<>"']/g, function (char) {
                return {
                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    '"': "&quot;",
                    "'": "&#039;"
                }[char];
            });
    }

    function getJSON(key, fallback) {
        try {
            const raw = localStorage.getItem(key);

            if (!raw) {
                return fallback;
            }

            return JSON.parse(raw);

        } catch (error) {

            console.error(
                "ไม่สามารถอ่านข้อมูล:",
                key,
                error
            );

            return fallback;
        }
    }

    function saveJSON(key, value) {

        try {

            localStorage.setItem(
                key,
                JSON.stringify(value)
            );

            return true;

        } catch (error) {

            console.error(
                "ไม่สามารถบันทึกข้อมูล:",
                key,
                error
            );

            alert(
                "ไม่สามารถบันทึกข้อมูลได้\n" +
                "พื้นที่จัดเก็บของเบราว์เซอร์อาจเต็ม"
            );

            return false;
        }
    }

    function createID() {

        return (
            Date.now().toString(36) +
            Math.random()
                .toString(36)
                .substring(2, 9)
        );
    }


    /* =====================================================
       เมนูทั้งหมดของระบบ
       ===================================================== */

    const MENU = {

        population: {

            title: "👤 ข้อมูลประชาชน",

            icon: "👤",

            storage:
                "RONGKHEM_POPULATION_ITEMS",

            fields: [
                "title",
                "detail",
                "number",
                "category"
            ]
        },


        households: {

            title: "🏠 ข้อมูลครัวเรือน",

            icon: "🏠",

            storage:
                "RONGKHEM_HOUSEHOLD_ITEMS",

            fields: [
                "title",
                "detail",
                "number",
                "category"
            ]
        },


        leaders: {

            title: "👥 ผู้นำชุมชน",

            icon: "👥",

            storage:
                "RONGKHEM_LEADERS_ITEMS",

            fields: [
                "title",
                "detail",
                "position",
                "phone"
            ]
        },


        news: {

            title: "📢 ข่าวประชาสัมพันธ์",

            icon: "📢",

            storage:
                "RONGKHEM_NEWS",

            fields: [
                "title",
                "detail",
                "date",
                "time"
            ]
        },


        activity: {

            title: "📅 กิจกรรม / ปฏิทิน",

            icon: "📅",

            storage:
                "RONGKHEM_ACTIVITY",

            fields: [
                "title",
                "detail",
                "date",
                "time",
                "location"
            ]
        },


        alert: {

            title: "🚨 แจ้งเหตุ / ร้องเรียน",

            icon: "🚨",

            storage:
                "RONGKHEM_COMPLAINT",

            fields: [
                "title",
                "detail",
                "date",
                "time",
                "contact"
            ]
        },


        services: {

            title: "🤝 บริการประชาชน",

            icon: "🤝",

            storage:
                "RONGKHEM_SERVICES",

            fields: [
                "title",
                "detail",
                "phone",
                "url"
            ]
        },


        projects: {

            title: "🏡 โครงการพัฒนาหมู่บ้าน",

            icon: "🏡",

            storage:
                "RONGKHEM_PROJECTS",

            fields: [
                "title",
                "detail",
                "date",
                "budget",
                "status"
            ]
        },


        pm: {

            title: "🌿 สิ่งแวดล้อม / PM2.5",

            icon: "🌿",

            storage:
                "RONGKHEM_ENVIRONMENT_ITEMS",

            fields: [
                "title",
                "detail",
                "date",
                "value",
                "status"
            ]
        },


        wetland: {

            title: "💧 แหล่งซับน้ำจำ",

            icon: "💧",

            storage:
                "RONGKHEM_WETLAND_ITEMS",

            fields: [
                "title",
                "detail",
                "date",
                "location",
                "status"
            ]
        },


        rice: {

            title: "🍚 กลุ่มข้าวสาร",

            icon: "🍚",

            storage:
                "RONGKHEM_RICE_ITEMS",

            fields: [
                "title",
                "detail",
                "date",
                "number",
                "status"
            ]
        },


        statistics: {

            title: "📊 สถิติหมู่บ้าน",

            icon: "📊",

            storage:
                "RONGKHEM_STATISTICS_ITEMS",

            fields: [
                "title",
                "detail",
                "number",
                "category"
            ]
        }

    };


    /* =====================================================
       ชื่อฟิลด์
       ===================================================== */

    const FIELD_LABEL = {

        title:
            "หัวข้อ / ชื่อข้อมูล",

        detail:
            "รายละเอียด",

        number:
            "จำนวน / ตัวเลข",

        category:
            "ประเภท",

        position:
            "ตำแหน่ง",

        phone:
            "โทรศัพท์",

        date:
            "วันที่",

        time:
            "เวลา",

        location:
            "สถานที่",

        contact:
            "ช่องทางติดต่อ",

        url:
            "ลิงก์ / URL",

        budget:
            "งบประมาณ",

        status:
            "สถานะ",

        value:
            "ค่าที่ตรวจวัด"

    };


    /* =====================================================
       Placeholder
       ===================================================== */

    const FIELD_PLACEHOLDER = {

        title:
            "กรอกหัวข้อหรือชื่อข้อมูล",

        detail:
            "กรอกรายละเอียดข้อมูล",

        number:
            "เช่น 352",

        category:
            "เช่น ผู้สูงอายุ / ครัวเรือน",

        position:
            "เช่น ผู้ใหญ่บ้าน",

        phone:
            "เช่น 080-1202529",

        location:
            "เช่น อาคารอเนกประสงค์ หมู่ 6",

        contact:
            "เบอร์โทร / LINE / ช่องทางติดต่อ",

        url:
            "https://...",

        budget:
            "เช่น 100000 บาท",

        status:
            "เช่น กำลังดำเนินการ",

        value:
            "เช่น 4.8"

    };


    /* =====================================================
       เวลา / วันที่
       ===================================================== */

    function updateClock() {

        const now = new Date();

        const clock =
            $("clock");

        const date =
            $("date");

        if (clock) {

            clock.textContent =
                now.toLocaleTimeString(
                    "th-TH",
                    {
                        hour12: false,
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


    /* =====================================================
       ข้อมูลผู้ใหญ่บ้าน
       ===================================================== */

    const DEFAULT_LEADER = {

        name:
            "นายศักรนนทน์ ขัติย์วงศ์",

        phone:
            "080-1202529",

        line:
            "rongkhem.village"

    };


    function getSettings() {

        const settings =
            getJSON(
                "RONGKHEM_SETTINGS",
                {}
            );

        return {

            name:
                settings.name ||
                DEFAULT_LEADER.name,

            phone:
                settings.phone ||
                DEFAULT_LEADER.phone,

            line:
                settings.line ||
                DEFAULT_LEADER.line

        };
    }


    function loadLeader() {

        const settings =
            getSettings();

        const leaderName =
            $("leaderName");

        if (leaderName) {

            leaderName.textContent =
                settings.name;
        }
    }


    /* =====================================================
       แก้ชื่อเก่าที่อาจค้างอยู่
       ===================================================== */

    function normalizeLeaderName() {

        const settings =
            getJSON(
                "RONGKHEM_SETTINGS",
                {}
            );

        const oldNames = [

            "นายศักรนนท์ ขัติ์วงศ์",

            "นายศักรนนท์ ขัติย์วงศ์",

            "นายศักรนนทน์ ขัติ์วงศ์"

        ];

        if (
            settings.name &&
            oldNames.includes(
                settings.name
            )
        ) {

            settings.name =
                DEFAULT_LEADER.name;

            saveJSON(
                "RONGKHEM_SETTINGS",
                settings
            );
        }
    }


    /* =====================================================
       รูปผู้ใหญ่บ้าน
       ===================================================== */

    function loadLeaderPhoto() {

        const image =
            localStorage.getItem(
                "RONGKHEM_LEADER_PHOTO"
            );

        const box =
            $("profilePic");

        if (
            image &&
            box
        ) {

            box.innerHTML =
                `
                <img
                    src="${escapeHTML(image)}"
                    alt="ผู้ใหญ่บ้าน"
                    style="
                        width:100%;
                        height:100%;
                        object-fit:cover;
                        border-radius:50%;
                    "
                >
                `;
        }
    }


    /* =====================================================
       จบส่วนที่ 1
       ส่วนถัดไปเป็น:
       - Modal
       - เพิ่มข้อมูล
       - แก้ไขข้อมูล
       - ลบข้อมูล
       - อัปโหลดรูป
       ===================================================== */

})();
/* =========================================================
   APP.JS — ส่วนที่ 2
   UNIVERSAL CRUD MANAGER
   ========================================================= */


/* =====================================================
   MODAL
   ===================================================== */

function openModal(html) {

    const modal =
        $("modal");

    const box =
        $("modalBox");

    if (!modal || !box) {

        console.error(
            "ไม่พบ #modal หรือ #modalBox"
        );

        return;
    }

    box.innerHTML =
        html;

    modal.classList.add(
        "show"
    );

    document.body.classList.add(
        "modal-open"
    );
}


window.closeModal =
function () {

    const modal =
        $("modal");

    if (modal) {

        modal.classList.remove(
            "show"
        );
    }

    document.body.classList.remove(
        "modal-open"
    );
};


/* =====================================================
   อ่านข้อมูลของแต่ละเมนู
   ===================================================== */

function getMenuItems(
    type
) {

    const config =
        MENU[type];

    if (!config) {

        return [];
    }

    return getJSON(
        config.storage,
        []
    );
}


/* =====================================================
   บันทึกข้อมูลของแต่ละเมนู
   ===================================================== */

function saveMenuItems(
    type,
    items
) {

    const config =
        MENU[type];

    if (!config) {

        return false;
    }

    return saveJSON(
        config.storage,
        items
    );
}


/* =====================================================
   สร้าง ID
   ===================================================== */

function createItemID() {

    return (
        Date.now()
        .toString(36)
        +
        Math.random()
        .toString(36)
        .substring(2, 8)
    );
}


/* =====================================================
   สร้างช่องกรอกข้อมูล
   ===================================================== */

function createField(
    field,
    item
) {

    item =
        item || {};

    const label =
        FIELD_LABEL[field]
        || field;

    const value =
        item[field]
        || "";

    const placeholder =
        FIELD_PLACEHOLDER[field]
        || "";


    /* รายละเอียด */

    if (
        field ===
        "detail"
    ) {

        return `
        <div class="formGroup">

            <label>
                ${escapeHTML(label)}
            </label>

            <textarea
                id="field_${field}"
                placeholder="${escapeHTML(
                    placeholder
                )}"
                rows="5"
            >${escapeHTML(value)}</textarea>

        </div>
        `;
    }


    /* วันที่ */

    if (
        field ===
        "date"
    ) {

        return `
        <div class="formGroup">

            <label>
                ${escapeHTML(label)}
            </label>

            <input
                id="field_${field}"
                type="date"
                value="${escapeHTML(value)}"
            >

        </div>
        `;
    }


    /* เวลา */

    if (
        field ===
        "time"
    ) {

        return `
        <div class="formGroup">

            <label>
                ${escapeHTML(label)}
            </label>

            <input
                id="field_${field}"
                type="time"
                value="${escapeHTML(value)}"
            >

        </div>
        `;
    }


    /* URL */

    if (
        field ===
        "url"
    ) {

        return `
        <div class="formGroup">

            <label>
                ${escapeHTML(label)}
            </label>

            <input
                id="field_${field}"
                type="url"
                value="${escapeHTML(value)}"
                placeholder="${escapeHTML(
                    placeholder
                )}"
            >

        </div>
        `;
    }


    /* ช่องทั่วไป */

    return `
    <div class="formGroup">

        <label>
            ${escapeHTML(label)}
        </label>

        <input
            id="field_${field}"
            type="text"
            value="${escapeHTML(value)}"
            placeholder="${escapeHTML(
                placeholder
            )}"
        >

    </div>
    `;
}


/* =====================================================
   เปิดหน้าจอจัดการเมนู
   ===================================================== */

window.openManager =
function (type) {

    const config =
        MENU[type];

    if (!config) {

        alert(
            "ไม่พบเมนูที่ต้องการจัดการ"
        );

        return;
    }

    renderManager(
        type
    );
};


/* =====================================================
   แสดงรายการทั้งหมด
   ===================================================== */

function renderManager(
    type
) {

    const config =
        MENU[type];

    const items =
        getMenuItems(
            type
        );


    let html =
        `
        <div class="manager">

            <div class="managerHeader">

                <div>

                    <h2>
                        ${config.title}
                    </h2>

                    <p>
                        เพิ่ม แก้ไข อัปโหลดรูป
                        และลบข้อมูล
                    </p>

                </div>

                <button
                    type="button"
                    class="btn green"
                    onclick="
                        openItemForm('${type}')
                    "
                >
                    ＋ เพิ่มข้อมูล
                </button>

            </div>

            <div class="managerList">
        `;


    if (
        !items.length
    ) {

        html +=
            `
            <div class="emptyManager">

                <div class="emptyManagerIcon">
                    ${config.icon}
                </div>

                <h3>
                    ยังไม่มีข้อมูล
                </h3>

                <p>
                    กดปุ่ม
                    “＋ เพิ่มข้อมูล”
                    เพื่อเพิ่มรายการ
                </p>

            </div>
            `;

    } else {

        items.forEach(
            item => {

                html +=
                    renderManagerItem(
                        type,
                        item
                    );
            }
        );
    }


    html +=
        `
            </div>

            <div class="managerFooter">

                <button
                    type="button"
                    class="btn gray"
                    onclick="closeModal()"
                >
                    ปิด
                </button>

            </div>

        </div>
        `;


    openModal(
        html
    );
}


/* =====================================================
   รายการแต่ละรายการ
   ===================================================== */

function renderManagerItem(
    type,
    item
) {

    const config =
        MENU[type];


    let imageHTML =
        `
        <div class="managerThumb">
            <span>
                ${config.icon}
            </span>
        </div>
        `;


    if (
        item.image
    ) {

        imageHTML =
            `
            <div class="managerThumb">

                <img
                    src="${escapeHTML(
                        item.image
                    )}"
                    alt=""
                >

            </div>
            `;
    }


    let meta =
        "";


    if (
        item.position
    ) {

        meta +=
            `
            <div>
                <b>ตำแหน่ง:</b>
                ${escapeHTML(
                    item.position
                )}
            </div>
            `;
    }


    if (
        item.date
    ) {

        meta +=
            `
            <div>
                <b>วันที่:</b>
                ${escapeHTML(
                    item.date
                )}
            </div>
            `;
    }


    if (
        item.time
    ) {

        meta +=
            `
            <div>
                <b>เวลา:</b>
                ${escapeHTML(
                    item.time
                )}
            </div>
            `;
    }


    if (
        item.location
    ) {

        meta +=
            `
            <div>
                <b>สถานที่:</b>
                ${escapeHTML(
                    item.location
                )}
            </div>
            `;
    }


    if (
        item.phone
    ) {

        meta +=
            `
            <div>
                <b>โทร:</b>
                ${escapeHTML(
                    item.phone
                )}
            </div>
            `;
    }


    if (
        item.status
    ) {

        meta +=
            `
            <div>
                <b>สถานะ:</b>
                ${escapeHTML(
                    item.status
                )}
            </div>
            `;
    }


    if (
        item.number !== undefined &&
        item.number !== ""
    ) {

        meta +=
            `
            <div>
                <b>จำนวน:</b>
                ${escapeHTML(
                    item.number
                )}
            </div>
            `;
    }


    return `
    <article
        class="managerItem"
        data-id="${escapeHTML(
            item.id
        )}"
    >

        ${imageHTML}

        <div class="managerContent">

            <h3>
                ${config.icon}
                ${escapeHTML(
                    item.title ||
                    "ไม่มีชื่อ"
                )}
            </h3>

            <div class="managerMeta">
                ${meta}
            </div>

            ${
                item.detail
                ?
                `
                <p>
                    ${escapeHTML(
                        item.detail
                    )}
                </p>
                `
                :
                ""
            }

        </div>


        <div class="managerActions">

            <button
                type="button"
                class="btn blue"
                onclick="
                    openItemForm(
                        '${type}',
                        '${escapeHTML(
                            item.id
                        )}'
                    )
                "
            >
                ✏️ แก้ไข
            </button>


            <button
                type="button"
                class="btn red"
                onclick="
                    deleteItem(
                        '${type}',
                        '${escapeHTML(
                            item.id
                        )}'
                    )
                "
            >
                🗑️ ลบ
            </button>

        </div>

    </article>
    `;
}


/* =====================================================
   เปิดฟอร์มเพิ่ม / แก้ไข
   ===================================================== */

window.openItemForm =
function (
    type,
    id
) {

    const config =
        MENU[type];

    if (!config) {

        return;
    }


    const items =
        getMenuItems(
            type
        );


    let item =
        {};


    if (id) {

        item =
            items.find(
                x =>
                    String(x.id) ===
                    String(id)
            )
            ||
            {};
    }


    let formHTML =
        `
        <div class="manager">

            <div class="managerHeader">

                <div>

                    <h2>
                        ${
                            id
                            ?
                            "✏️ แก้ไขข้อมูล"
                            :
                            "＋ เพิ่มข้อมูล"
                        }
                    </h2>

                    <p>
                        ${config.title}
                    </p>

                </div>

            </div>

            <div class="formGrid">
        `;


    config.fields.forEach(
        field => {

            formHTML +=
                createField(
                    field,
                    item
                );
        }
    );


    formHTML +=
        `
            </div>

            <div class="formGroup">

                <label>
                    📷 รูปภาพประกอบ
                </label>

                <input
                    id="field_image"
                    type="file"
                    accept="image/*"
                >

                <small>
                    รองรับ JPG, PNG, WEBP
                    ขนาดไม่เกิน 10 MB
                </small>

            </div>
        `;


    if (
        item.image
    ) {

        formHTML +=
            `
            <div class="currentImage">

                <div>
                    รูปภาพปัจจุบัน
                </div>

                <img
                    src="${escapeHTML(
                        item.image
                    )}"
                    alt=""
                >

                <button
                    type="button"
                    class="btn red"
                    onclick="
                        removeCurrentImage(
                            '${type}',
                            '${escapeHTML(
                                item.id
                            )}'
                        )
                    "
                >
                    🗑️ ลบรูปนี้
                </button>

            </div>
            `;
    }


    formHTML +=
        `
            <input
                type="hidden"
                id="editingId"
                value="${escapeHTML(
                    id || ""
                )}"
            >

            <div class="managerFooter">

                <button
                    type="button"
                    class="btn gray"
                    onclick="
                        openManager(
                            '${type}'
                        )
                    "
                >
                    ← ยกเลิก
                </button>

                <button
                    type="button"
                    class="btn green"
                    onclick="
                        saveItem(
                            '${type}'
                        )
                    "
                >
                    💾 บันทึกข้อมูล
                </button>

            </div>

        </div>
        `;


    openModal(
        formHTML
    );
}


/* =====================================================
   อ่านไฟล์รูป
   ===================================================== */

function readImageFile(
    file,
    callback
) {

    if (!file) {

        callback(
            null
        );

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

        callback(
            null
        );

        return;
    }


    if (
        file.size >
        10 * 1024 * 1024
    ) {

        alert(
            "รูปภาพต้องมีขนาดไม่เกิน 10 MB"
        );

        callback(
            null
        );

        return;
    }


    const reader =
        new FileReader();


    reader.onload =
        function (event) {

            callback(
                event.target.result
            );
        };


    reader.onerror =
        function () {

            alert(
                "ไม่สามารถอ่านไฟล์รูปภาพได้"
            );

            callback(
                null
            );
        };


    reader.readAsDataURL(
        file
    );
}


/* =====================================================
   บันทึกข้อมูล
   ===================================================== */

window.saveItem =
function (type) {

    const config =
        MENU[type];

    if (!config) {

        return;
    }


    const items =
        getMenuItems(
            type
        );


    const editingId =
        $("editingId")?.value
        || "";


    const existing =
        items.find(
            x =>
                String(x.id) ===
                String(editingId)
        );


    const title =
        $("field_title")
        ?.value
        ?.trim()
        || "";


    if (!title) {

        alert(
            "กรุณากรอกหัวข้อ / ชื่อข้อมูล"
        );

        $("field_title")
            ?.focus();

        return;
    }


    const item =
        existing
        ?
        {
            ...existing
        }
        :
        {
            id:
                createItemID(),

            createdAt:
                new Date()
                    .toISOString()
        };


    item.updatedAt =
        new Date()
            .toISOString();


    config.fields.forEach(
        field => {

            const element =
                $("field_" + field);

            if (element) {

                item[field] =
                    element.value
                        .trim();
            }
        }
    );


    const file =
        $("field_image")
        ?.files
        ?. [0];


    const finish =
        function (image) {

            if (image) {

                item.image =
                    image;
            }


            const index =
                items.findIndex(
                    x =>
                        String(x.id) ===
                        String(item.id)
                );


            if (
                index >= 0
            ) {

                items[index] =
                    item;

            } else {

                items.unshift(
                    item
                );
            }


            if (
                saveMenuItems(
                    type,
                    items
                )
            ) {

                closeModal();

                refreshPublicView(
                    type
                );

                alert(
                    editingId
                    ?
                    "แก้ไขข้อมูลเรียบร้อยแล้ว"
                    :
                    "เพิ่มข้อมูลเรียบร้อยแล้ว"
                );
            }
        };


    if (file) {

        readImageFile(
            file,
            finish
        );

    } else {

        finish(
            existing?.image
            ||
            null
        );
    }
}


/* =====================================================
   ลบข้อมูล
   ===================================================== */

window.deleteItem =
function (
    type,
    id
) {

    const items =
        getMenuItems(
            type
        );


    const item =
        items.find(
            x =>
                String(x.id) ===
                String(id)
        );


    if (!item) {

        alert(
            "ไม่พบข้อมูลรายการนี้"
        );

        return;
    }


    const name =
        item.title ||
        "รายการนี้";


    const confirmed =
        confirm(
            "⚠️ ยืนยันการลบข้อมูล\n\n" +
            name +
            "\n\n" +
            "ข้อมูลที่ลบแล้วจะไม่สามารถกู้คืนจากหน้านี้ได้"
        );


    if (!confirmed) {

        return;
    }


    const newItems =
        items.filter(
            x =>
                String(x.id) !==
                String(id)
        );


    if (
        saveMenuItems(
            type,
            newItems
        )
    ) {

        renderManager(
            type
        );

        refreshPublicView(
            type
        );

        alert(
            "ลบข้อมูลเรียบร้อยแล้ว"
        );
    }
};


/* =====================================================
   ลบรูปปัจจุบัน
   ===================================================== */

window.removeCurrentImage =
function (
    type,
    id
) {

    const items =
        getMenuItems(
            type
        );


    const index =
        items.findIndex(
            x =>
                String(x.id) ===
                String(id)
        );


    if (
        index < 0
    ) {

        return;
    }


    const confirmed =
        confirm(
            "ต้องการลบรูปภาพนี้หรือไม่?"
        );


    if (!confirmed) {

        return;
    }


    delete items[index].image;


    saveMenuItems(
        type,
        items
    );


    openItemForm(
        type,
        id
    );
};


/* =====================================================
   จบส่วนที่ 2
   ส่วนที่ 3 จะเป็น:
   - เชื่อมเมนูทั้งหมด
   - แหล่งซับน้ำจำ
   - กลุ่มข้าวสาร
   - สถิติ
   - ประกาศ
   - กิจกรรม
   - แจ้งเหตุ
   - Weather
   - PM2.5
   ===================================================== */
/* =========================================================
   APP.JS — ส่วนที่ 3
   เชื่อมเมนูทั้งหมด + Dashboard + Weather + PM2.5
   ========================================================= */


/* =====================================================
   แสดงข้อมูลกลับบน Dashboard
   ===================================================== */

function refreshPublicView(type) {

    if (type === "news") {
        loadNews();
    }

    if (type === "activity") {
        loadActivities();
    }

    if (type === "alert") {
        loadAlerts();
    }
}


/* =====================================================
   ข่าวประชาสัมพันธ์
   ===================================================== */

function loadNews() {

    const box =
        $("newsList");

    if (!box) {
        return;
    }


    const items =
        getMenuItems("news");


    if (!items.length) {

        box.className =
            "empty";

        box.innerHTML =
            `
            <span class="emptyIcon">
                📣
            </span>

            ยังไม่มีข้อมูลประกาศ<br>

            ระบบพร้อมรับข้อมูล
            ที่เพิ่มภายหลัง<br>

            <button
                class="add"
                onclick="
                    openManager('news')
                "
            >
                ＋ เพิ่มประกาศ
            </button>
            `;

        return;
    }


    box.className =
        "publicDataList";


    box.innerHTML =
        items
            .slice(0, 5)
            .map(item => {

                return `
                <div class="publicItem">

                    ${
                        item.image
                        ?
                        `
                        <img
                            src="${escapeHTML(
                                item.image
                            )}"
                            alt=""
                        >
                        `
                        :
                        `
                        <div class="publicItemIcon">
                            📢
                        </div>
                        `
                    }

                    <div>

                        <b>
                            ${escapeHTML(
                                item.title
                            )}
                        </b>

                        ${
                            item.date
                            ?
                            `
                            <small>
                                ${escapeHTML(
                                    item.date
                                )}
                            </small>
                            `
                            :
                            ""
                        }

                        ${
                            item.detail
                            ?
                            `
                            <p>
                                ${escapeHTML(
                                    item.detail
                                )}
                            </p>
                            `
                            :
                            ""
                        }

                    </div>

                </div>
                `;

            })
            .join("")
            +

            `
            <button
                class="add"
                onclick="
                    openManager('news')
                "
            >
                ⚙️ จัดการประกาศ
            </button>
            `;
}


/* =====================================================
   กิจกรรม
   ===================================================== */

function loadActivities() {

    const box =
        $("activityList");

    if (!box) {
        return;
    }


    const items =
        getMenuItems(
            "activity"
        );


    if (!items.length) {

        box.className =
            "empty";

        box.innerHTML =
            `
            <span class="emptyIcon">
                🗓️
            </span>

            ยังไม่มีข้อมูลกิจกรรม<br>

            กรุณาเพิ่มข้อมูลกิจกรรมภายหลัง<br>

            <button
                class="add"
                onclick="
                    openManager('activity')
                "
            >
                ＋ เพิ่มกิจกรรม
            </button>
            `;

        return;
    }


    box.className =
        "publicDataList";


    box.innerHTML =
        items
            .slice(0, 5)
            .map(item => {

                return `
                <div class="publicItem">

                    ${
                        item.image
                        ?
                        `
                        <img
                            src="${escapeHTML(
                                item.image
                            )}"
                            alt=""
                        >
                        `
                        :
                        `
                        <div class="publicItemIcon">
                            📅
                        </div>
                        `
                    }

                    <div>

                        <b>
                            ${escapeHTML(
                                item.title
                            )}
                        </b>

                        ${
                            item.date ||
                            item.time
                            ?
                            `
                            <small>
                                ${escapeHTML(
                                    item.date || ""
                                )}

                                ${
                                    item.time
                                    ?
                                    " " +
                                    escapeHTML(
                                        item.time
                                    )
                                    :
                                    ""
                                }
                            </small>
                            `
                            :
                            ""
                        }

                        ${
                            item.location
                            ?
                            `
                            <small>
                                📍
                                ${escapeHTML(
                                    item.location
                                )}
                            </small>
                            `
                            :
                            ""
                        }

                        ${
                            item.detail
                            ?
                            `
                            <p>
                                ${escapeHTML(
                                    item.detail
                                )}
                            </p>
                            `
                            :
                            ""
                        }

                    </div>

                </div>
                `;

            })
            .join("")
            +

            `
            <button
                class="add"
                onclick="
                    openManager('activity')
                "
            >
                ⚙️ จัดการกิจกรรม
            </button>
            `;
}


/* =====================================================
   แจ้งเหตุ / ร้องเรียน
   ===================================================== */

function loadAlerts() {

    const box =
        $("alertList");

    if (!box) {
        return;
    }


    const items =
        getMenuItems(
            "alert"
        );


    if (!items.length) {

        box.innerHTML =
            `
            <div class="empty">

                <span class="emptyIcon">
                    🚨
                </span>

                ยังไม่มีข้อมูลแจ้งเหตุ

                <br><br>

                <button
                    class="add"
                    onclick="
                        openManager('alert')
                    "
                >
                    ＋ เพิ่มแจ้งเหตุ
                </button>

            </div>
            `;

        return;
    }


    box.innerHTML =
        items
            .slice(0, 5)
            .map(item => {

                return `
                <div class="alert">

                    <b>
                        🚨
                        ${escapeHTML(
                            item.title
                        )}
                    </b>

                    ${
                        item.date ||
                        item.time
                        ?
                        `
                        <small>
                            ${escapeHTML(
                                item.date || ""
                            )}

                            ${
                                item.time
                                ?
                                " " +
                                escapeHTML(
                                    item.time
                                )
                                :
                                ""
                            }
                        </small>
                        `
                        :
                        ""
                    }

                    ${
                        item.detail
                        ?
                        `
                        <p>
                            ${escapeHTML(
                                item.detail
                            )}
                        </p>
                        `
                        :
                        ""
                    }

                </div>
                `;

            })
            .join("")
            +

            `
            <button
                class="add"
                onclick="
                    openManager('alert')
                "
            >
                ⚙️ จัดการแจ้งเหตุ
            </button>
            `;
}


/* =====================================================
   ผูกเมนูด้านซ้ายทั้งหมด
   ===================================================== */

function bindAllMenus() {

    const navs =
        document.querySelectorAll(
            ".sidebar .nav"
        );


    navs.forEach(
        nav => {

            const text =
                nav.textContent
                    .replace(
                        /\s+/g,
                        " "
                    )
                    .trim();


            /* ผู้นำ */

            if (
                text.includes(
                    "ผู้นำชุมชน"
                )
            ) {

                nav.href =
                    "#leaders";

                nav.onclick =
                    function (event) {

                        event.preventDefault();

                        openManager(
                            "leaders"
                        );
                    };
            }


            /* บริการประชาชน */

            if (
                text.includes(
                    "บริการประชาชน"
                )
            ) {

                nav.href =
                    "#services";

                nav.onclick =
                    function (event) {

                        event.preventDefault();

                        openManager(
                            "services"
                        );
                    };
            }


            /* โครงการ */

            if (
                text.includes(
                    "โครงการพัฒนาหมู่บ้าน"
                )
            ) {

                nav.href =
                    "#projects";

                nav.onclick =
                    function (event) {

                        event.preventDefault();

                        openManager(
                            "projects"
                        );
                    };
            }


            /* สิ่งแวดล้อม */

            if (
                text.includes(
                    "สิ่งแวดล้อม"
                )
            ) {

                nav.href =
                    "#pm";

                nav.onclick =
                    function (event) {

                        event.preventDefault();

                        openManager(
                            "pm"
                        );
                    };
            }


            /* แหล่งซับน้ำจำ */

            if (
                text.includes(
                    "แหล่งซับน้ำจำ"
                )
            ) {

                nav.href =
                    "#wetland";

                nav.onclick =
                    function (event) {

                        event.preventDefault();

                        openManager(
                            "wetland"
                        );
                    };
            }


            /* กลุ่มข้าวสาร */

            if (
                text.includes(
                    "กลุ่มข้าวสาร"
                )
            ) {

                nav.href =
                    "#rice";

                nav.onclick =
                    function (event) {

                        event.preventDefault();

                        openManager(
                            "rice"
                        );
                    };
            }


            /* สถิติ */

            if (
                text.includes(
                    "สถิติหมู่บ้าน"
                )
            ) {

                nav.href =
                    "#statistics";

                nav.onclick =
                    function (event) {

                        event.preventDefault();

                        openManager(
                            "statistics"
                        );
                    };
            }

        }
    );
}


/* =====================================================
   เพิ่มปุ่มจัดการข้อมูลบนการ์ด
   ===================================================== */

function addManagementButtons() {

    const population =
        $("population");

    if (
        population &&
        !population.dataset.manager
    ) {

        population.dataset.manager =
            "true";


        const button =
            document.createElement(
                "button"
            );


        button.type =
            "button";

        button.className =
            "view dashboardManage";

        button.textContent =
            "⚙️ จัดการ";


        button.onclick =
            function () {

                openManager(
                    "population"
                );
            };


        population.prepend(
            button
        );
    }


    const households =
        $("households");


    if (
        households &&
        !households.dataset.manager
    ) {

        households.dataset.manager =
            "true";


        const button =
            document.createElement(
                "button"
            );


        button.type =
            "button";

        button.className =
            "view dashboardManage";

        button.textContent =
            "⚙️ จัดการ";


        button.onclick =
            function () {

                openManager(
                    "households"
                );
            };


        households.prepend(
            button
        );
    }
}


/* =====================================================
   HERO IMAGE
   ===================================================== */

const HERO_STORAGE =
    "RONGKHEM_HERO_IMAGE";


function loadHeroImage() {

    const hero =
        $("heroBanner");

    if (!hero) {
        return;
    }


    const image =
        localStorage.getItem(
            HERO_STORAGE
        );


    if (
        image
    ) {

        hero.style.backgroundImage =
            `url("${image}")`;

        hero.style.backgroundSize =
            "cover";

        hero.style.backgroundPosition =
            "center";

        hero.style.backgroundRepeat =
            "no-repeat";
    }
}


/* =====================================================
   เปลี่ยนรูป Hero
   ===================================================== */

window.openHeroUpload =
function () {

    const input =
        document.createElement(
            "input"
        );


    input.type =
        "file";

    input.accept =
        "image/*";


    input.onchange =
        function () {

            const file =
                input.files?.[0];


            if (!file) {
                return;
            }


            readImageFile(
                file,
                function (image) {

                    if (!image) {
                        return;
                    }


                    localStorage.setItem(
                        HERO_STORAGE,
                        image
                    );


                    loadHeroImage();


                    alert(
                        "เปลี่ยนรูปหน้าเว็บเรียบร้อยแล้ว"
                    );

                }
            );
        };


    input.click();
};


/* =====================================================
   WEATHER
   ===================================================== */

async function loadWeather() {

    const weather =
        CONFIG.weather ||
        {};


    if (
        weather.enabled === false
    ) {

        return;
    }


    const latitude =
        weather.latitude ??
        19.1667;


    const longitude =
        weather.longitude ??
        99.9019;


    const url =
        "https://api.open-meteo.com/v1/forecast" +
        "?latitude=" +
        latitude +
        "&longitude=" +
        longitude +
        "&current=" +
        "temperature_2m," +
        "relative_humidity_2m," +
        "precipitation," +
        "wind_speed_10m," +
        "weather_code" +
        "&hourly=precipitation_probability" +
        "&timezone=Asia%2FBangkok";


    try {

        const response =
            await fetch(
                url
            );


        if (
            !response.ok
        ) {

            throw new Error(
                "Weather API error"
            );
        }


        const data =
            await response.json();


        const current =
            data.current;


        const temperature =
            Math.round(
                current.temperature_2m
            );


        const humidity =
            current.relative_humidity_2m;


        const wind =
            Math.round(
                current.wind_speed_10m
            );


        const weatherCode =
            current.weather_code;


        const rain =
            data.hourly
                ?.precipitation_probability
                ?. [0];


        if ($("temp")) {

            $("temp").textContent =
                temperature +
                "°C";
        }


        if ($("topTemp")) {

            $("topTemp").textContent =
                temperature +
                "°C";
        }


        if ($("hum")) {

            $("hum").textContent =
                humidity +
                "%";
        }


        if ($("wind")) {

            $("wind").textContent =
                wind +
                " km/h";
        }


        if (
            $("weatherText")
        ) {

            $("weatherText")
                .textContent =
                weatherDescription(
                    weatherCode
                );
        }


        const rainElement =
            document.querySelector(
                ".weather3 div:nth-child(2) b"
            );


        if (
            rainElement &&
            rain !== undefined
        ) {

            rainElement.textContent =
                rain +
                "%";
        }

    } catch (error) {

        console.error(
            "Weather:",
            error
        );


        if (
            $("weatherText")
        ) {

            $("weatherText")
                .textContent =
                "ไม่สามารถโหลดข้อมูลสดได้";
        }
    }
}


/* =====================================================
   แปลสภาพอากาศ
   ===================================================== */

function weatherDescription(
    code
) {

    if (
        code === 0
    ) {
        return "ท้องฟ้าแจ่มใส";
    }


    if (
        code === 1 ||
        code === 2
    ) {
        return "มีเมฆบางส่วน";
    }


    if (
        code === 3
    ) {
        return "มีเมฆมาก";
    }


    if (
        code >= 51 &&
        code <= 67
    ) {
        return "มีฝน";
    }


    if (
        code >= 80 &&
        code <= 82
    ) {
        return "ฝนตก";
    }


    if (
        code >= 95
    ) {
        return "ฝนฟ้าคะนอง";
    }


    return "สภาพอากาศปัจจุบัน";
}


/* =====================================================
   PM2.5
   ===================================================== */

async function loadPM25() {

    const pm =
        CONFIG.pm25 ||
        {};


    if (
        pm.enabled === false
    ) {

        return;
    }


    const latitude =
        pm.latitude ??
        19.1667;


    const longitude =
        pm.longitude ??
        99.9019;


    const url =
        "https://air-quality-api.open-meteo.com/v1/air-quality" +
        "?latitude=" +
        latitude +
        "&longitude=" +
        longitude +
        "&current=pm2_5" +
        "&timezone=Asia%2FBangkok";


    try {

        const response =
            await fetch(
                url
            );


        if (
            !response.ok
        ) {

            throw new Error(
                "PM2.5 API error"
            );
        }


        const data =
            await response.json();


        const value =
            Number(
                data.current.pm2_5
            );


        if ($("pmv")) {

            $("pmv").textContent =
                value.toFixed(1);
        }


        if (
            $("pmStatus")
        ) {

            $("pmStatus")
                .textContent =
                getPMStatus(
                    value
                );
        }

    } catch (error) {

        console.error(
            "PM2.5:",
            error
        );


        if (
            $("pmStatus")
        ) {

            $("pmStatus")
                .textContent =
                "ไม่สามารถโหลดข้อมูลสดได้";
        }
    }
}


/* =====================================================
   สถานะ PM2.5
   ===================================================== */

function getPMStatus(
    value
) {

    if (
        value <= 25
    ) {

        return "ดีมาก";
    }


    if (
        value <= 37
    ) {

        return "ดี";
    }


    if (
        value <= 50
    ) {

        return "ปานกลาง";
    }


    if (
        value <= 90
    ) {

        return "เริ่มมีผลกระทบ";
    }


    return "มีผลกระทบต่อสุขภาพ";
}


/* =====================================================
   จบส่วนที่ 3
   ===================================================== */
/* =========================================================
   APP.JS — ส่วนที่ 4 / ส่วนสุดท้าย
   AI + SETTINGS + INIT
   ========================================================= */


/* =====================================================
   AI ผู้ช่วยผู้ใหญ่บ้าน
   ===================================================== */

window.askAI = function () {

    const question = prompt(
        "🤖 AI ผู้ช่วยผู้ใหญ่บ้าน\n\n" +
        "ถามข้อมูลหมู่บ้านได้เลย เช่น\n\n" +
        "• ประชาชนมีกี่คน\n" +
        "• ครัวเรือนมีกี่หลัง\n" +
        "• ผู้สูงอายุมีกี่คน\n" +
        "• ผู้ใหญ่บ้านชื่ออะไร\n" +
        "• แหล่งซับน้ำจำมีข้อมูลอะไร\n" +
        "• กลุ่มข้าวสารมีข้อมูลหรือไม่\n"
    );


    if (!question) {
        return;
    }


    const q =
        question
            .toLowerCase()
            .trim();


    let answer =
        "ขออภัยครับ ขณะนี้ยังไม่พบข้อมูลที่ตรงกับคำถาม";


    /* ประชาชน */

    if (
        q.includes("ประชาชน") ||
        q.includes("ประชากร")
    ) {

        const total =
            DATA.population?.total ??
            960;


        const male =
            DATA.population?.male ??
            471;


        const female =
            DATA.population?.female ??
            489;


        answer =
            `บ้านร่องเข็มมีประชาชน ${total} คน ` +
            `(ชาย ${male} คน / หญิง ${female} คน)`;
    }


    /* ครัวเรือน */

    else if (
        q.includes("ครัวเรือน") ||
        q.includes("บ้าน")
    ) {

        const total =
            DATA.households?.total ??
            352;


        answer =
            `บ้านร่องเข็มมี ${total} ครัวเรือน`;
    }


    /* ผู้สูงอายุ */

    else if (
        q.includes("ผู้สูงอายุ") ||
        q.includes("คนแก่")
    ) {

        const total =
            DATA.survey?.elderly60Plus ??
            92;


        answer =
            `ข้อมูล Dashboard ระบุผู้สูงอายุอายุ 60 ปีขึ้นไป ` +
            `${total} คน`;
    }


    /* กลุ่มเปราะบาง */

    else if (
        q.includes("เปราะบาง")
    ) {

        const total =
            DATA.survey?.vulnerableSelections ??
            95;


        answer =
            `ข้อมูลกลุ่มเปราะบางใน Dashboard ` +
            `${total} รายการ`;
    }


    /* ผู้ใหญ่บ้าน */

    else if (
        q.includes("ผู้ใหญ่บ้าน") ||
        q.includes("ผู้นำ")
    ) {

        const settings =
            getSettings();


        answer =
            `ผู้ใหญ่บ้านบ้านร่องเข็ม หมู่ที่ 6 ` +
            `คือ ${settings.name}`;
    }


    /* เบอร์โทร */

    else if (
        q.includes("เบอร์") ||
        q.includes("โทรศัพท์")
    ) {

        const settings =
            getSettings();


        answer =
            `สามารถติดต่อที่ทำการผู้ใหญ่บ้านได้ที่ ` +
            `${settings.phone}`;
    }


    /* แหล่งซับน้ำจำ */

    else if (
        q.includes("ซับน้ำจำ")
    ) {

        const items =
            getMenuItems(
                "wetland"
            );


        if (
            items.length
        ) {

            answer =
                `ระบบมีข้อมูลแหล่งซับน้ำจำ ` +
                `${items.length} รายการ`;

        } else {

            answer =
                "ขณะนี้ยังไม่มีข้อมูลแหล่งซับน้ำจำ " +
                "ในระบบ สามารถกดเมนูแหล่งซับน้ำจำ " +
                "แล้วเพิ่มข้อมูลได้ครับ";
        }
    }


    /* กลุ่มข้าวสาร */

    else if (
        q.includes("ข้าวสาร") ||
        q.includes("กลุ่มข้าว")
    ) {

        const items =
            getMenuItems(
                "rice"
            );


        if (
            items.length
        ) {

            answer =
                `ระบบมีข้อมูลกลุ่มข้าวสาร ` +
                `${items.length} รายการ`;

        } else {

            answer =
                "ขณะนี้ยังไม่มีข้อมูลกลุ่มข้าวสาร " +
                "ใน Dashboard";
        }
    }


    /* ข่าว */

    else if (
        q.includes("ข่าว") ||
        q.includes("ประกาศ")
    ) {

        const items =
            getMenuItems(
                "news"
            );


        answer =
            items.length
            ?
            `ขณะนี้มีประกาศ ${items.length} รายการ`
            :
            "ขณะนี้ยังไม่มีประกาศในระบบ";
    }


    /* กิจกรรม */

    else if (
        q.includes("กิจกรรม") ||
        q.includes("ปฏิทิน")
    ) {

        const items =
            getMenuItems(
                "activity"
            );


        answer =
            items.length
            ?
            `ขณะนี้มีกิจกรรม ${items.length} รายการ`
            :
            "ขณะนี้ยังไม่มีข้อมูลกิจกรรม";
    }


    /* PM2.5 */

    else if (
        q.includes("pm") ||
        q.includes("ฝุ่น") ||
        q.includes("pm2.5")
    ) {

        const pm =
            $("pmv")?.textContent
            || "--";


        const status =
            $("pmStatus")?.textContent
            || "กำลังตรวจสอบ";


        answer =
            `ค่า PM2.5 ล่าสุดที่ Dashboard แสดง ` +
            `${pm} µg/m³ ระดับ ${status}`;
    }


    /* แสดงคำตอบ */

    const ai =
        $("aiText");


    if (ai) {

        ai.innerHTML =
            `
            <b>🤖 AI ผู้ช่วยผู้ใหญ่บ้าน</b>
            <br><br>
            ${escapeHTML(answer)}
            `;
    }

};


/* =====================================================
   ตั้งค่าระบบ
   ===================================================== */

window.openSettings =
function () {

    const settings =
        getSettings();


    openModal(
        `
        <div class="manager">

            <div class="managerHeader">

                <div>

                    <h2>
                        ⚙️ ตั้งค่าระบบ
                    </h2>

                    <p>
                        แก้ไขข้อมูลผู้ใหญ่บ้าน
                        และข้อมูลติดต่อ
                    </p>

                </div>

            </div>


            <div class="formGrid">

                <div class="formGroup">

                    <label>
                        ชื่อผู้ใหญ่บ้าน
                    </label>

                    <input
                        id="settingName"
                        type="text"
                        value="${escapeHTML(
                            settings.name
                        )}"
                    >

                </div>


                <div class="formGroup">

                    <label>
                        📞 เบอร์โทรศัพท์
                    </label>

                    <input
                        id="settingPhone"
                        type="text"
                        value="${escapeHTML(
                            settings.phone
                        )}"
                    >

                </div>


                <div class="formGroup">

                    <label>
                        💬 LINE
                    </label>

                    <input
                        id="settingLine"
                        type="text"
                        value="${escapeHTML(
                            settings.line
                        )}"
                    >

                </div>


                <div class="formGroup">

                    <label>
                        📷 รูปผู้ใหญ่บ้าน
                    </label>

                    <input
                        id="leaderPhotoFile"
                        type="file"
                        accept="image/*"
                    >

                </div>

            </div>


            <div class="managerFooter">

                <button
                    class="btn gray"
                    type="button"
                    onclick="
                        closeModal()
                    "
                >
                    ปิด
                </button>


                <button
                    class="btn green"
                    type="button"
                    onclick="
                        saveSettings()
                    "
                >
                    💾 บันทึก
                </button>

            </div>

        </div>
        `
    );
};


/* =====================================================
   บันทึกการตั้งค่า
   ===================================================== */

window.saveSettings =
function () {

    const name =
        $("settingName")
            ?.value
            ?.trim()
            ||
            DEFAULT_LEADER.name;


    const phone =
        $("settingPhone")
            ?.value
            ?.trim()
            ||
            DEFAULT_LEADER.phone;


    const line =
        $("settingLine")
            ?.value
            ?.trim()
            ||
            DEFAULT_LEADER.line;


    const settings = {

        name:
            name,

        phone:
            phone,

        line:
            line

    };


    saveJSON(
        "RONGKHEM_SETTINGS",
        settings
    );


    if (
        $("leaderName")
    ) {

        $("leaderName")
            .textContent =
            settings.name;
    }


    const file =
        $("leaderPhotoFile")
            ?.files
            ?. [0];


    if (file) {

        readImageFile(
            file,
            function (image) {

                if (image) {

                    localStorage.setItem(
                        "RONGKHEM_LEADER_PHOTO",
                        image
                    );

                    loadLeaderPhoto();
                }

                closeModal();

                alert(
                    "บันทึกการตั้งค่าเรียบร้อยแล้ว"
                );
            }
        );

        return;
    }


    closeModal();


    alert(
        "บันทึกการตั้งค่าเรียบร้อยแล้ว"
    );
};


/* =====================================================
   คลิกนอกหน้าต่าง Modal = ปิด
   ===================================================== */

document.addEventListener(
    "click",
    function (event) {

        const modal =
            $("modal");


        if (
            modal &&
            event.target === modal
        ) {

            closeModal();
        }
    }
);


/* =====================================================
   กด ESC = ปิด Modal
   ===================================================== */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key ===
            "Escape"
        ) {

            closeModal();
        }
    }
);


/* =====================================================
   เริ่มระบบ
   ===================================================== */

function initRongkhemApp() {

    console.log(
        "🏛️ RONGKHEM e-VILLAGE OFFICE"
    );

    console.log(
        "ระบบ Universal Content Manager เริ่มทำงาน"
    );


    /* แก้ชื่อเก่าที่อาจค้างในเครื่อง */

    normalizeLeaderName();


    /* เวลา */

    updateClock();

    setInterval(
        updateClock,
        1000
    );


    /* ผู้ใหญ่บ้าน */

    loadLeader();

    loadLeaderPhoto();


    /* ภาพ Hero */

    loadHeroImage();


    /* ข่าว */

    loadNews();


    /* กิจกรรม */

    loadActivities();


    /* แจ้งเหตุ */

    loadAlerts();


    /* ผูกเมนู */

    bindAllMenus();


    /* ปุ่มจัดการ */

    addManagementButtons();


    /* อากาศ */

    loadWeather();


    /* PM2.5 */

    loadPM25();


    /* อัปเดตอากาศทุก 5 นาที */

    setInterval(
        loadWeather,
        5 * 60 * 1000
    );


    /* อัปเดต PM2.5 ทุก 5 นาที */

    setInterval(
        loadPM25,
        5 * 60 * 1000
    );


    console.log(
        "✅ RONGKHEM e-VILLAGE OFFICE พร้อมใช้งาน"
    );
}


/* =====================================================
   เริ่มเมื่อหน้าเว็บโหลดเสร็จ
   ===================================================== */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initRongkhemApp
    );

} else {

    initRongkhemApp();
}


/* =====================================================
   จบ APP.JS
   ===================================================== */

})();
