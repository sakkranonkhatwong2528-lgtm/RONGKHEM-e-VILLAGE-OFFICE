/* =========================================================
   RONGKHEM e-VILLAGE OFFICE
   APP.JS — UNIVERSAL CONTENT MANAGER
   ========================================================= */

(function () {
    "use strict";

    /* =====================================================
       ตัวช่วยพื้นฐาน
       ===================================================== */

    const DATA =
        window.RONGKHEM_DATA || {};

    const CONFIG =
        window.RONGKHEM_CONFIG || {};

    const $ =
        (id) =>
            document.getElementById(id);


    /* =====================================================
       ป้องกัน HTML Injection
       ===================================================== */

    function escapeHTML(value) {

        return String(value ?? "")
            .replace(
                /[&<>"']/g,
                function (char) {

                    return {
                        "&": "&amp;",
                        "<": "&lt;",
                        ">": "&gt;",
                        '"': "&quot;",
                        "'": "&#039;"
                    }[char];

                }
            );

    }


    /* =====================================================
       LocalStorage
       ===================================================== */

    function getJSON(
        key,
        fallback
    ) {

        try {

            const raw =
                localStorage.getItem(
                    key
                );

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


    function saveJSON(
        key,
        value
    ) {

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


    /* =====================================================
       สร้าง ID
       ===================================================== */

    function createID() {

        return (
            Date.now()
                .toString(36)
            +
            Math.random()
                .toString(36)
                .substring(2, 9)
        );

    }


    /* =====================================================
       MENU
       ===================================================== */

    const MENU = {

        population: {

            title:
                "👤 ข้อมูลประชาชน",

            icon:
                "👤",

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

            title:
                "🏠 ข้อมูลครัวเรือน",

            icon:
                "🏠",

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

            title:
                "👥 ผู้นำชุมชน",

            icon:
                "👥",

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

            title:
                "📢 ข่าวประชาสัมพันธ์",

            icon:
                "📢",

            storage:
                "RONGKHEM_NEWS_ITEMS",

            fields: [
                "title",
                "detail",
                "date",
                "url"
            ]

        },


        activity: {

            title:
                "📅 กิจกรรมหมู่บ้าน",

            icon:
                "📅",

            storage:
                "RONGKHEM_ACTIVITY_ITEMS",

            fields: [
                "title",
                "detail",
                "date",
                "time"
            ]

        },


        alert: {

            title:
                "🚨 แจ้งเหตุ / แจ้งปัญหา",

            icon:
                "🚨",

            storage:
                "RONGKHEM_ALERT_ITEMS",

            fields: [
                "title",
                "detail",
                "date",
                "category"
            ]

        },


        /* =================================================
           ❤️ กองทุนแม่ของแผ่นดิน
           ================================================= */

        motherFund: {

            title:
                "❤️ กองทุนแม่ของแผ่นดิน",

            icon:
                "❤️",

            storage:
                "RONGKHEM_MOTHER_FUND_ITEMS",

            fields: [
                "title",
                "detail",
                "number",
                "category",
                "date"
            ]

        },


        /* =================================================
           💧 แหล่งซับน้ำจำ
           ================================================= */

        subnamjam: {

            title:
                "💧 แหล่งซับน้ำจำ",

            icon:
                "💧",

            storage:
                "RONGKHEM_SUBNAMJAM_ITEMS",

            fields: [
                "title",
                "detail",
                "number",
                "category"
            ]

        },


        /* =================================================
           🍚 กลุ่มข้าวสาร
           ================================================= */

        rice: {

            title:
                "🍚 กลุ่มข้าวสาร",

            icon:
                "🍚",

            storage:
                "RONGKHEM_RICE_ITEMS",

            fields: [
                "title",
                "detail",
                "number",
                "category"
            ]

        }

    };


    /* =====================================================
       ป้ายชื่อช่องกรอก
       ===================================================== */

    const FIELD_LABEL = {

        title:
            "ชื่อรายการ",

        detail:
            "รายละเอียด",

        number:
            "จำนวน",

        category:
            "หมวดหมู่",

        position:
            "ตำแหน่ง",

        phone:
            "เบอร์โทรศัพท์",

        date:
            "วันที่",

        time:
            "เวลา",

        url:
            "ลิงก์"

    };


    /* =====================================================
       Placeholder
       ===================================================== */

    const FIELD_PLACEHOLDER = {

        title:
            "กรอกชื่อรายการ",

        detail:
            "กรอกรายละเอียด",

        number:
            "กรอกจำนวน",

        category:
            "กรอกหมวดหมู่",

        position:
            "เช่น ผู้ใหญ่บ้าน",

        phone:
            "เช่น 080-000-0000",

        date:
            "",

        time:
            "",

        url:
            "https://"

    };


    /* =====================================================
       เวลา / วันที่
       ===================================================== */

    function updateClock() {

        const now =
            new Date();

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


    setInterval(
        updateClock,
        1000
    );

    updateClock();


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

            box.innerHTML = `

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
       MODAL
       ===================================================== */

    window.openModal =
        function (html) {

            const modal =
                $("modal");

            const box =
                $("modalBox");


            if (
                !modal ||
                !box
            ) {

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

        };


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
       อ่านข้อมูล
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
       บันทึกข้อมูล
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
       สร้างช่องกรอกข้อมูล
       ===================================================== */

    function createField(
        field,
        item
    ) {

        item =
            item || {};


        const label =
            FIELD_LABEL[field] ||
            field;


        const value =
            item[field] ||
            "";


        const placeholder =
            FIELD_PLACEHOLDER[field] ||
            "";


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
       เปิดหน้าจอจัดการ
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
       แสดงรายการ
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


        let html = `

            <div class="manager">

                <div class="managerHeader">

                    <div>

                        <h2>
                            ${config.icon}
                            ${config.title}
                        </h2>

                        <p>
                            เพิ่ม แก้ไข
                            อัปโหลดรูป
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

            html += `

                <div class="emptyManager">

                    <div
                        class="emptyManagerIcon"
                    >
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


        html += `

                </div>

            </div>

        `;


        openModal(
            html
        );

    }


    /* =====================================================
       แสดงแต่ละรายการ
       ===================================================== */

    function renderManagerItem(
        type,
        item
    ) {

        const title =
            item.title ||
            "ไม่มีชื่อ";


        const detail =
            item.detail ||
            "";


        return `

            <div class="managerItem">

                ${
                    item.image
                    ?
                    `
                    <img
                        src="${escapeHTML(
                            item.image
                        )}"
                        class="managerImage"
                        alt=""
                    >
                    `
                    :
                    `
                    <div class="managerIcon">
                        ${MENU[type].icon}
                    </div>
                    `
                }


                <div class="managerContent">

                    <h3>
                        ${escapeHTML(title)}
                    </h3>

                    <p>
                        ${escapeHTML(detail)}
                    </p>

                </div>


                <div class="managerActions">

                    <button
                        class="btn"
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

            </div>

        `;

    }


    /* =====================================================
       เพิ่ม / แก้ไขข้อมูล
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


            const item =
                id
                    ?
                    items.find(
                        x =>
                            String(x.id) ===
                            String(id)
                    )
                    :
                    {};


            let fields = "";


            config.fields.forEach(
                field => {

                    fields +=
                        createField(
                            field,
                            item
                        );

                }
            );


            const html = `

                <div class="formModal">

                    <h2>
                        ${id ? "✏️ แก้ไขข้อมูล" : "➕ เพิ่มข้อมูล"}
                    </h2>


                    <div class="formBody">

                        ${fields}


                        <div class="formGroup">

                            <label>
                                📷 รูปภาพ
                            </label>

                            <input
                                id="field_image"
                                type="file"
                                accept="image/*"
                            >

                        </div>


                        ${
                            item.image
                            ?
                            `
                            <div>

                                <img
                                    src="${escapeHTML(
                                        item.image
                                    )}"
                                    style="
                                        max-width:180px;
                                        border-radius:16px;
                                    "
                                >

                            </div>
                            `
                            :
                            ""
                        }

                    </div>


                    <div class="formActions">

                        <button
                            class="btn green"
                            onclick="
                                saveItem(
                                    '${type}',
                                    '${id || ""}'
                                )
                            "
                        >
                            💾 บันทึก
                        </button>


                        <button
                            class="btn"
                            onclick="
                                renderManager(
                                    '${type}'
                                )
                            "
                        >
                            ยกเลิก
                        </button>

                    </div>

                </div>

            `;


            openModal(
                html
            );

        };


    /* =====================================================
       บันทึกข้อมูล
       ===================================================== */

    window.saveItem =
        async function (
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


            const data = {

                id:
                    id ||
                    createID(),

                updatedAt:
                    new Date()
                        .toISOString()

            };


            config.fields.forEach(
                field => {

                    const element =
                        $(
                            "field_" +
                            field
                        );


                    if (element) {

                        data[field] =
                            element.value
                                .trim();

                    }

                }
            );


            const imageInput =
                $("field_image");


            if (
                imageInput &&
                imageInput.files &&
                imageInput.files[0]
            ) {

                data.image =
                    await readImageFile(
                        imageInput.files[0]
                    );

            } else if (id) {

                const old =
                    items.find(
                        x =>
                            String(x.id) ===
                            String(id)
                    );

                if (old?.image) {
                    data.image =
                        old.image;
                }

            }


            const index =
                items.findIndex(
                    x =>
                        String(x.id) ===
                        String(data.id)
                );


            if (
                index >= 0
            ) {

                items[index] =
                    {
                        ...items[index],
                        ...data
                    };

            } else {

                items.unshift(
                    data
                );

            }


            if (
                saveMenuItems(
                    type,
                    items
                )
            ) {

                renderManager(
                    type
                );

                refreshPublicView(
                    type
                );

                alert(
                    "✅ บันทึกข้อมูลเรียบร้อยแล้ว"
                );

            }

        };


    /* =====================================================
       อ่านรูป
       ===================================================== */

    function readImageFile(
        file
    ) {

        return new Promise(
            (
                resolve,
                reject
            ) => {

                const reader =
                    new FileReader();


                reader.onload =
                    () =>
                        resolve(
                            reader.result
                        );


                reader.onerror =
                    reject;


                reader.readAsDataURL(
                    file
                );

            }
        );

    }


    /* =====================================================
       ลบข้อมูล
       ===================================================== */

    window.deleteItem =
        function (
            type,
            id
        ) {

            const confirmed =
                confirm(
                    "ต้องการลบข้อมูลรายการนี้หรือไม่?"
                );


            if (!confirmed) {
                return;
            }


            const items =
                getMenuItems(
                    type
                );


            const newItems =
                items.filter(
                    item =>
                        String(item.id) !==
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
                    "🗑️ ลบข้อมูลเรียบร้อยแล้ว"
                );

            }

        };


    /* =====================================================
       Dashboard
       ===================================================== */

    function refreshPublicView(
        type
    ) {

        if (
            type ===
            "news"
        ) {
            loadNews();
        }


        if (
            type ===
            "activity"
        ) {
            loadActivities();
        }


        if (
            type ===
            "alert"
        ) {
            loadAlerts();
        }


        if (
            type ===
            "motherFund"
        ) {
            loadMotherFund();
        }

    }


    /* =====================================================
       ❤️ กองทุนแม่ของแผ่นดิน
       ===================================================== */

    function loadMotherFund() {

        const box =
            $("motherFundList");


        if (!box) {
            return;
        }


        const items =
            getMenuItems(
                "motherFund"
            );


        if (!items.length) {

            box.innerHTML = `

                <div class="empty">

                    <span>
                        ❤️
                    </span>

                    <p>
                        ยังไม่มีข้อมูล
                        กองทุนแม่ของแผ่นดิน
                    </p>

                    <button
                        class="add"
                        onclick="
                            openManager(
                                'motherFund'
                            )
                        "
                    >
                        ＋ เพิ่มข้อมูล
                    </button>

                </div>

            `;

            return;

        }


        box.innerHTML =
            items
                .slice(0, 5)
                .map(
                    item => `

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
                            <div>
                                ❤️
                            </div>
                            `
                        }

                        <div>

                            <h3>
                                ${escapeHTML(
                                    item.title
                                )}
                            </h3>

                            <p>
                                ${escapeHTML(
                                    item.detail
                                )}
                            </p>

                        </div>

                    </div>

                    `
                )
                .join("");

    }


    /* =====================================================
       ข่าว
       ===================================================== */

    function loadNews() {

        const box =
            $("newsList");


        if (!box) {
            return;
        }


        const items =
            getMenuItems(
                "news"
            );


        if (!items.length) {

            box.innerHTML = `

                <div class="empty">

                    📢

                    <br>

                    ยังไม่มีข้อมูลประกาศ

                    <br>

                    <button
                        class="add"
                        onclick="
                            openManager(
                                'news'
                            )
                        "
                    >
                        ＋ เพิ่มประกาศ
                    </button>

                </div>

            `;

            return;

        }


        box.innerHTML =
            items
                .slice(0, 5)
                .map(
                    item => `

                    <div class="publicItem">

                        <h3>
                            ${escapeHTML(
                                item.title
                            )}
                        </h3>

                        <p>
                            ${escapeHTML(
                                item.detail
                            )}
                        </p>

                        ${
                            item.date
                            ?
                            `
                            <small>
                                📅
                                ${escapeHTML(
                                    item.date
                                )}
                            </small>
                            `
                            :
                            ""
                        }

                    </div>

                    `
                )
                .join("");

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


        box.innerHTML =
            items
                .slice(0, 5)
                .map(
                    item => `

                    <div class="publicItem">

                        <h3>
                            ${escapeHTML(
                                item.title
                            )}
                        </h3>

                        <p>
                            ${escapeHTML(
                                item.detail
                            )}
                        </p>

                        <small>
                            📅
                            ${escapeHTML(
                                item.date || ""
                            )}

                            ${
                                item.time
                                ?
                                " • " +
                                escapeHTML(
                                    item.time
                                )
                                :
                                ""
                            }

                        </small>

                    </div>

                    `
                )
                .join("");

    }


    /* =====================================================
       แจ้งเหตุ
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


        box.innerHTML =
            items
                .slice(0, 5)
                .map(
                    item => `

                    <div class="publicItem alertItem">

                        <h3>
                            🚨
                            ${escapeHTML(
                                item.title
                            )}
                        </h3>

                        <p>
                            ${escapeHTML(
                                item.detail
                            )}
                        </p>

                    </div>

                    `
                )
                .join("");

    }


    /* =====================================================
       PM2.5
       ===================================================== */

    async function loadPM25() {

        const pm =
            CONFIG.pm25 ||
            {};


        if (
            pm.enabled ===
            false
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


            if (
                $("pmv")
            ) {

                $("pmv")
                    .textContent =
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
       🤖 AI ผู้ช่วยผู้ใหญ่บ้าน
       ===================================================== */

    window.askAI =
        function () {

            const question =
                prompt(
                    "🤖 AI ผู้ช่วยผู้ใหญ่บ้าน\n\n" +
                    "ถามข้อมูลหมู่บ้านได้เลย เช่น\n\n" +
                    "• ประชาชนมีกี่คน\n" +
                    "• ครัวเรือนมีกี่หลัง\n" +
                    "• ผู้ใหญ่บ้านชื่ออะไร\n" +
                    "• กองทุนแม่ของแผ่นดินมีข้อมูลอะไร\n" +
                    "• แหล่งซับน้ำจำมีข้อมูลอะไร\n" +
                    "• กลุ่มข้าวสารมีข้อมูลหรือไม่"
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
                q.includes("ประชาชน")
            ) {

                const items =
                    getMenuItems(
                        "population"
                    );


                answer =
                    `ขณะนี้ระบบมีข้อมูลประชาชน ${items.length} รายการ`;

            }


            /* ครัวเรือน */

            else if (
                q.includes("ครัวเรือน")
            ) {

                const items =
                    getMenuItems(
                        "households"
                    );


                answer =
                    `ขณะนี้ระบบมีข้อมูลครัวเรือน ${items.length} รายการ`;

            }


            /* ผู้ใหญ่บ้าน */

            else if (
                q.includes("ผู้ใหญ่บ้าน")
            ) {

                const settings =
                    getSettings();


                answer =
                    `ผู้ใหญ่บ้านคือ ${settings.name}`;

            }


            /* ❤️ กองทุนแม่ */

            else if (
                q.includes("กองทุนแม่") ||
                q.includes(
                    "กองทุนแม่ของแผ่นดิน"
                )
            ) {

                const items =
                    getMenuItems(
                        "motherFund"
                    );


                if (
                    items.length
                ) {

                    answer =
                        `ระบบมีข้อมูลกองทุนแม่ของแผ่นดิน ${items.length} รายการ`;

                } else {

                    answer =
                        "ขณะนี้ยังไม่มีข้อมูลกองทุนแม่ของแผ่นดินในระบบ";

                }

            }


            /* แหล่งซับน้ำจำ */

            else if (
                q.includes("ซับน้ำจำ")
            ) {

                const items =
                    getMenuItems(
                        "subnamjam"
                    );


                answer =
                    `ระบบมีข้อมูลแหล่งซับน้ำจำ ${items.length} รายการ`;

            }


            /* กลุ่มข้าวสาร */

            else if (
                q.includes("ข้าวสาร")
            ) {

                const items =
                    getMenuItems(
                        "rice"
                    );


                answer =
                    `ระบบมีข้อมูลกลุ่มข้าวสาร ${items.length} รายการ`;

            }


            alert(
                "🤖 AI ผู้ช่วยผู้ใหญ่บ้าน\n\n" +
                answer
            );

        };


    /* =====================================================
       เริ่มระบบ
       ===================================================== */

    function initRongkhemApp() {

        normalizeLeaderName();

        loadLeader();

        loadLeaderPhoto();

        loadNews();

        loadActivities();

        loadAlerts();

        loadMotherFund();

        loadPM25();

        console.log(
            "✅ RONGKHEM e-VILLAGE OFFICE พร้อมใช้งาน"
        );

    }


    /* =====================================================
       DOM READY
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


})();
