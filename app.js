/* =========================================================
   RONGKHEM e-VILLAGE OFFICE
   APP.JS — ระบบทำงานหลัก
   ========================================================= */

(function () {

    "use strict";

    /* =====================================================
       ตรวจสอบ DATA / CONFIG
       ===================================================== */

    const DATA =
        window.RONGKHEM_DATA || {};

    const CONFIG =
        window.RONGKHEM_CONFIG || {};


    /* =====================================================
       ฟังก์ชันค้นหา Element
       ===================================================== */

    function $(id) {
        return document.getElementById(id);
    }


    /* =====================================================
       ข้อมูล VERIFIED DATA
       ===================================================== */

    const population =
        DATA.population || {};

    const households =
        DATA.households || {};

    const survey =
        DATA.survey || {};

    const leader =
        DATA.leader || {};


    /* =====================================================
       แสดงข้อมูล Dashboard
       ===================================================== */

    function loadDashboardData() {

        const elements = {

            population:
                $("populationTotal"),

            male:
                $("populationMale"),

            female:
                $("populationFemale"),

            households:
                $("householdsTotal"),

            elderly:
                $("elderlyTotal"),

            elderlyPercent:
                $("elderlyPercent"),

            vulnerable:
                $("vulnerableTotal"),

            disabled:
                $("disabledTotal"),

            chronic:
                $("chronicTotal"),

            survey:
                $("surveyTotal"),

            surveyHouseholds:
                $("surveyHouseholds")
        };


        if (elements.population) {
            elements.population.textContent =
                population.total ?? 0;
        }


        if (elements.male) {
            elements.male.textContent =
                population.male ?? 0;
        }


        if (elements.female) {
            elements.female.textContent =
                population.female ?? 0;
        }


        if (elements.households) {
            elements.households.textContent =
                households.total ?? 0;
        }


        if (elements.elderly) {
            elements.elderly.textContent =
                survey.elderly60Plus ?? 0;
        }


        if (elements.elderlyPercent) {
            elements.elderlyPercent.textContent =
                survey.elderlyPercent ?? 0;
        }


        if (elements.vulnerable) {
            elements.vulnerable.textContent =
                survey.vulnerableSelections ?? 0;
        }


        if (elements.disabled) {
            elements.disabled.textContent =
                survey.disabled ?? 0;
        }


        if (elements.chronic) {
            elements.chronic.textContent =
                survey.chronicDisease ?? 0;
        }


        if (elements.survey) {
            elements.survey.textContent =
                survey.respondents ?? 0;
        }


        if (elements.surveyHouseholds) {
            elements.surveyHouseholds.textContent =
                survey.households ?? 0;
        }

    }


    /* =====================================================
       ข้อมูลผู้ใหญ่บ้าน
       ===================================================== */

    function loadLeader() {

        const name =
            $("leaderName");

        const phone =
            $("leaderPhone");

        const line =
            $("leaderLine");


        if (name && leader.name) {
            name.textContent =
                leader.name;
        }


        if (phone && leader.phone) {
            phone.textContent =
                leader.phone;
        }


        if (line && leader.line) {
            line.textContent =
                leader.line;
        }

    }


    /* =====================================================
       นาฬิกาดิจิทัล
       ===================================================== */

    function updateClock() {

        const clock =
            $("clock");

        const date =
            $("date");


        const now =
            new Date();


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
       LocalStorage
       ===================================================== */

    function getStorage(key) {

        try {

            return JSON.parse(
                localStorage.getItem(key) ||
                "[]"
            );

        } catch (error) {

            console.error(
                "Storage Error:",
                error
            );

            return [];

        }

    }


    function setStorage(key, value) {

        localStorage.setItem(
            key,
            JSON.stringify(value)
        );

    }


    /* =====================================================
       ป้องกัน HTML
       ===================================================== */

    function escapeHTML(value) {

        return String(
            value ?? ""
        ).replace(
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
       ระบบประกาศ
       ===================================================== */

    const NEWS_KEY =
        "RONGKHEM_NEWS";


    function loadNews() {

        const container =
            $("newsList");

        if (!container) return;


        const news =
            getStorage(NEWS_KEY);


        if (!news.length) {

            return;

        }


        container.className = "";


        container.innerHTML =
            news
                .slice(0, 5)
                .map(function (item) {

                    return `
                    <div class="alert">
                        <b>
                            📢
                            ${escapeHTML(item.title)}
                        </b>

                        <small>
                            ${escapeHTML(item.date || "")}
                            ${escapeHTML(item.time || "")}
                        </small>

                        ${
                            item.detail
                                ? `
                                <div>
                                    ${escapeHTML(item.detail)}
                                </div>
                                `
                                : ""
                        }

                    </div>
                    `;

                })
                .join("");

    }


    /* =====================================================
       ระบบกิจกรรม
       ===================================================== */

    const ACTIVITY_KEY =
        "RONGKHEM_ACTIVITY";


    function loadActivities() {

        const container =
            $("activityList");

        if (!container) return;


        const activities =
            getStorage(ACTIVITY_KEY);


        if (!activities.length) {

            return;

        }


        container.className = "";


        container.innerHTML =
            activities
                .slice(0, 5)
                .map(function (item) {

                    return `
                    <div class="alert">

                        <b>
                            📅
                            ${escapeHTML(item.title)}
                        </b>

                        <small>
                            ${escapeHTML(item.date || "")}
                            ${escapeHTML(item.time || "")}
                        </small>

                        ${
                            item.detail
                                ? `
                                <div>
                                    ${escapeHTML(item.detail)}
                                </div>
                                `
                                : ""
                        }

                    </div>
                    `;

                })
                .join("");

    }


    /* =====================================================
       ระบบแจ้งเหตุ / ร้องเรียน
       ===================================================== */

    const COMPLAINT_KEY =
        "RONGKHEM_COMPLAINT";


    function loadComplaints() {

        const container =
            $("complaintList");

        if (!container) return;


        const complaints =
            getStorage(COMPLAINT_KEY);


        if (!complaints.length) {

            return;

        }


        container.innerHTML =
            complaints
                .slice(0, 5)
                .map(function (item) {

                    return `
                    <div class="alert">

                        <b>
                            🚨
                            ${escapeHTML(item.title)}
                        </b>

                        <small>
                            ${escapeHTML(item.date || "")}
                        </small>

                    </div>
                    `;

                })
                .join("");

    }


    /* =====================================================
       Modal
       ===================================================== */

    function openModal(html) {

        const modal =
            $("modal");

        const box =
            $("modalBox");


        if (!modal || !box) return;


        box.innerHTML =
            html;

        modal.classList.add(
            "show"
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

        };


    /* =====================================================
       จัดการประกาศ / กิจกรรม / แจ้งเหตุ
       ===================================================== */

    window.openManager =
        function (type) {

            let title =
                "จัดการข้อมูล";

            let key =
                NEWS_KEY;


            if (type === "news") {

                title =
                    "📢 เพิ่มประกาศ";

                key =
                    NEWS_KEY;

            }


            if (type === "activity") {

                title =
                    "📅 เพิ่มกิจกรรม";

                key =
                    ACTIVITY_KEY;

            }


            if (type === "complaint") {

                title =
                    "🚨 เพิ่มแจ้งเหตุ / ร้องเรียน";

                key =
                    COMPLAINT_KEY;

            }


            openModal(`

                <h2>
                    ${title}
                </h2>

                <label>
                    หัวข้อ

                    <input
                        id="managerTitle"
                        type="text"
                        placeholder="กรอกหัวข้อ"
                    >

                </label>


                <label>
                    วันที่

                    <input
                        id="managerDate"
                        type="date"
                    >

                </label>


                <label>
                    เวลา

                    <input
                        id="managerTime"
                        type="time"
                    >

                </label>


                <label>
                    รายละเอียด

                    <textarea
                        id="managerDetail"
                        placeholder="รายละเอียด"
                    ></textarea>

                </label>


                <div class="actions">

                    <button
                        class="btn gray"
                        onclick="closeModal()"
                    >
                        ปิด
                    </button>


                    <button
                        class="btn green"
                        onclick="saveManagerItem('${type}')"
                    >
                        💾 บันทึก
                    </button>

                </div>

            `);

        };


    window.saveManagerItem =
        function (type) {

            const title =
                $("managerTitle");

            const date =
                $("managerDate");

            const time =
                $("managerTime");

            const detail =
                $("managerDetail");


            if (
                !title ||
                !title.value.trim()
            ) {

                alert(
                    "กรุณากรอกหัวข้อ"
                );

                return;

            }


            let key =
                NEWS_KEY;


            if (type === "activity") {

                key =
                    ACTIVITY_KEY;

            }


            if (type === "complaint") {

                key =
                    COMPLAINT_KEY;

            }


            const data =
                getStorage(key);


            data.unshift({

                id:
                    Date.now(),

                title:
                    title.value.trim(),

                date:
                    date.value,

                time:
                    time.value,

                detail:
                    detail.value.trim(),

                createdAt:
                    new Date().toISOString()

            });


            setStorage(
                key,
                data
            );


            closeModal();


            loadNews();
            loadActivities();
            loadComplaints();


            alert(
                "บันทึกข้อมูลเรียบร้อยแล้ว"
            );

        };


    /* =====================================================
       AI ผู้ช่วยผู้ใหญ่บ้าน
       ===================================================== */

    window.askAI =
        function () {

            const question =
                prompt(
                    "ถามข้อมูลบ้านร่องเข็ม เช่น\n\n" +
                    "• ประชากรมีกี่คน?\n" +
                    "• มีกี่ครัวเรือน?\n" +
                    "• ผู้สูงอายุมีกี่คน?\n" +
                    "• กลุ่มเปราะบางมีกี่รายการ?"
                );


            if (!question) return;


            const q =
                question.toLowerCase();


            let answer =
                "ผมสามารถตอบข้อมูล VERIFIED DATA ของบ้านร่องเข็มได้ครับ";


            if (
                q.includes("ประชากร") ||
                q.includes("คน")
            ) {

                answer =
                    `บ้านร่องเข็มมีประชากร ${population.total} คน ` +
                    `แบ่งเป็นชาย ${population.male} คน ` +
                    `และหญิง ${population.female} คนครับ`;

            }


            else if (
                q.includes("ครัวเรือน") ||
                q.includes("บ้าน")
            ) {

                answer =
                    `บ้านร่องเข็มมี ${households.total} ครัวเรือนครับ`;

            }


            else if (
                q.includes("ผู้สูงอายุ") ||
                q.includes("60")
            ) {

                answer =
                    `มีผู้สูงอายุอายุ 60 ปีขึ้นไป ` +
                    `${survey.elderly60Plus} คน ` +
                    `คิดเป็น ${survey.elderlyPercent}% ` +
                    `ของผู้ตอบแบบสำรวจครับ`;

            }


            else if (
                q.includes("เปราะบาง")
            ) {

                answer =
                    `กลุ่มเปราะบางมี ` +
                    `${survey.vulnerableSelections} รายการครับ ` +
                    `โดยมีผู้พิการ ${survey.disabled} คน ` +
                    `และโรคเรื้อรัง ${survey.chronicDisease} คน`;

            }


            else if (
                q.includes("พิการ")
            ) {

                answer =
                    `ข้อมูลสำรวจพบผู้พิการ ${survey.disabled} คนครับ`;

            }


            else if (
                q.includes("โรคเรื้อรัง")
            ) {

                answer =
                    `ข้อมูลสำรวจพบผู้มีโรคเรื้อรัง ${survey.chronicDisease} คนครับ`;

            }


            const ai =
                $("aiText");


            if (ai) {

                ai.textContent =
                    answer;

            }

        };


    /* =====================================================
       WEATHER — OPEN METEO
       ===================================================== */

    async function loadWeather() {

        if (
            !CONFIG.weather ||
            CONFIG.weather.enabled === false
        ) {

            return;

        }


        const latitude =
            CONFIG.weather.latitude;

        const longitude =
            CONFIG.weather.longitude;


        const url =
            "https://api.open-meteo.com/v1/forecast" +
            `?latitude=${latitude}` +
            `&longitude=${longitude}` +
            "&current=temperature_2m," +
            "relative_humidity_2m," +
            "wind_speed_10m," +
            "weather_code" +
            "&hourly=precipitation_probability" +
            "&timezone=Asia%2FBangkok";


        try {

            const response =
                await fetch(url);


            if (!response.ok) {

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


            const code =
                current.weather_code;


            const temp =
                $("temp");

            const topTemp =
                $("topTemp");

            const hum =
                $("hum");

            const windElement =
                $("wind");

            const weatherText =
                $("weatherText");


            if (temp) {

                temp.textContent =
                    temperature + "°C";

            }


            if (topTemp) {

                topTemp.textContent =
                    temperature + "°C";

            }


            if (hum) {

                hum.textContent =
                    humidity + "%";

            }


            if (windElement) {

                windElement.textContent =
                    wind + " km/h";

            }


            if (weatherText) {

                weatherText.textContent =
                    weatherDescription(
                        code
                    );

            }


        } catch (error) {

            console.error(
                "Weather:",
                error
            );


            const weatherText =
                $("weatherText");


            if (weatherText) {

                weatherText.textContent =
                    "ไม่สามารถโหลดข้อมูลสดได้";

            }

        }

    }


    function weatherDescription(
        code
    ) {

        if (code === 0) {

            return "ท้องฟ้าแจ่มใส";

        }


        if (
            code === 1 ||
            code === 2 ||
            code === 3
        ) {

            return "มีเมฆบางส่วน";

        }


        if (
            code >= 51 &&
            code <= 67
        ) {

            return "มีฝน";

        }


        if (
            code >= 71 &&
            code <= 77
        ) {

            return "อากาศเย็น";

        }


        if (code >= 80) {

            return "ฝนฟ้าคะนอง";

        }


        return "สภาพอากาศปัจจุบัน";

    }


    /* =====================================================
       PM2.5 — OPEN METEO
       ===================================================== */

    async function loadPM25() {

        if (
            !CONFIG.pm25 ||
            CONFIG.pm25.enabled === false
        ) {

            return;

        }


        const latitude =
            CONFIG.pm25.latitude;

        const longitude =
            CONFIG.pm25.longitude;


        const url =
            "https://air-quality-api.open-meteo.com/v1/air-quality" +
            `?latitude=${latitude}` +
            `&longitude=${longitude}` +
            "&current=pm2_5" +
            "&timezone=Asia%2FBangkok";


        try {

            const response =
                await fetch(url);


            if (!response.ok) {

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


            const pm =
                $("pmv");

            const status =
                $("pmStatus");


            if (pm) {

                pm.textContent =
                    value.toFixed(1);

            }


            if (status) {

                status.textContent =
                    getPM25Status(
                        value
                    );

            }


        } catch (error) {

            console.error(
                "PM2.5:",
                error
            );


            const status =
                $("pmStatus");


            if (status) {

                status.textContent =
                    "ไม่สามารถโหลดข้อมูลสดได้";

            }

        }

    }


    function getPM25Status(
        value
    ) {

        if (value <= 25) {

            return "ดีมาก";

        }


        if (value <= 37) {

            return "ดี";

        }


        if (value <= 50) {

            return "ปานกลาง";

        }


        if (value <= 90) {

            return "เริ่มมีผล";

        }


        return "มีผลกระทบ";

    }


    /* =====================================================
       อัปโหลดรูปผู้ใหญ่บ้าน
       ===================================================== */

    window.saveLeaderPhoto =
        function (file) {

            if (!file) return;


            if (
                !file.type.startsWith(
                    "image/"
                )
            ) {

                alert(
                    "กรุณาเลือกไฟล์รูปภาพ"
                );

                return;

            }


            const reader =
                new FileReader();


            reader.onload =
                function (event) {

                    const image =
                        event.target.result;


                    localStorage.setItem(
                        "RONGKHEM_LEADER_PHOTO",
                        image
                    );


                    showLeaderPhoto(
                        image
                    );

                };


            reader.readAsDataURL(
                file
            );

        };


    function showLeaderPhoto(
        image
    ) {

        const photo =
            $("profilePic");


        if (!photo) return;


        photo.innerHTML =
            `<img src="${image}" alt="ผู้ใหญ่บ้าน">`;

    }


    function loadLeaderPhoto() {

        const image =
            localStorage.getItem(
                "RONGKHEM_LEADER_PHOTO"
            );


        if (image) {

            showLeaderPhoto(
                image
            );

        }

    }


    /* =====================================================
       ตั้งค่าระบบ
       ===================================================== */

    window.openSettings =
        function () {

            openModal(`

                <h2>
                    ⚙️ ตั้งค่าระบบ
                </h2>


                <label>
                    ชื่อผู้ใหญ่บ้าน

                    <input
                        id="settingName"
                        value="${escapeHTML(
                            leader.name || ""
                        )}"
                    >

                </label>


                <label>
                    เบอร์โทรศัพท์

                    <input
                        id="settingPhone"
                        value="${escapeHTML(
                            leader.phone || ""
                        )}"
                    >

                </label>


                <label>
                    LINE ID

                    <input
                        id="settingLine"
                        value="${escapeHTML(
                            leader.line || ""
                        )}"
                    >

                </label>


                <label>
                    รูปผู้ใหญ่บ้าน

                    <input
                        id="leaderPhotoFile"
                        type="file"
                        accept="image/*"
                    >

                </label>


                <div class="actions">

                    <button
                        class="btn gray"
                        onclick="closeModal()"
                    >
                        ปิด
                    </button>


                    <button
                        class="btn green"
                        onclick="saveSettings()"
                    >
                        💾 บันทึก
                    </button>

                </div>

            `);

        };


    window.saveSettings =
        function () {

            const settings = {

                name:
                    $("settingName")?.value ||
                    leader.name,

                phone:
                    $("settingPhone")?.value ||
                    leader.phone,

                line:
                    $("settingLine")?.value ||
                    leader.line

            };


            localStorage.setItem(
                "RONGKHEM_SETTINGS",
                JSON.stringify(
                    settings
                )
            );


            const file =
                $("leaderPhotoFile")?.files?.[0];


            if (file) {

                saveLeaderPhoto(
                    file
                );

            }


            const leaderName =
                $("leaderName");


            if (leaderName) {

                leaderName.textContent =
                    settings.name;

            }


            closeModal();


            alert(
                "บันทึกการตั้งค่าเรียบร้อยแล้ว"
            );

        };


    /* =====================================================
       โหลด SETTINGS
       ===================================================== */

    function loadSettings() {

        try {

            const settings =
                JSON.parse(
                    localStorage.getItem(
                        "RONGKHEM_SETTINGS"
                    ) || "{}"
                );


            if (
                settings.name &&
                $("leaderName")
            ) {

                $("leaderName").textContent =
                    settings.name;

            }

        } catch (error) {

            console.error(
                error
            );

        }

    }


    /* =====================================================
       ปิด Modal เมื่อคลิกพื้นหลัง
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
       เริ่มต้นระบบ
       ===================================================== */

    function init() {

        loadDashboardData();

        loadLeader();

        loadNews();

        loadActivities();

        loadComplaints();

        loadLeaderPhoto();

        loadSettings();

        loadWeather();

        loadPM25();


        const weatherRefresh =
            CONFIG.refresh?.weather ||
            300000;


        const pmRefresh =
            CONFIG.refresh?.pm25 ||
            300000;


        setInterval(
            loadWeather,
            weatherRefresh
        );


        setInterval(
            loadPM25,
            pmRefresh
        );

    }


    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            init
        );

    } else {

        init();

    }


})();
