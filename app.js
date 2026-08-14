/* =========================================================
   RONGKHEM e-VILLAGE OFFICE
   APP.JS — COMPLETE
   ========================================================= */

(function () {

    "use strict";

    /* =====================================================
       DATA
    ===================================================== */

    const DATA = window.RONGKHEM_DATA || {};
    const CONFIG = window.RONGKHEM_CONFIG || {};

    const population = DATA.population || {};
    const households = DATA.households || {};
    const survey = DATA.survey || {};
    const leader = DATA.leader || {};

    const NEWS_KEY = "RONGKHEM_NEWS";
    const ACTIVITY_KEY = "RONGKHEM_ACTIVITY";
    const COMPLAINT_KEY = "RONGKHEM_COMPLAINT";
    const SETTINGS_KEY = "RONGKHEM_SETTINGS";
    const LEADER_PHOTO_KEY = "RONGKHEM_LEADER_PHOTO";
    const HERO_IMAGE_KEY = "RONGKHEM_HERO_IMAGE";


    /* =====================================================
       HELPER
    ===================================================== */

    function $(id) {
        return document.getElementById(id);
    }

    function escapeHTML(value) {
        return String(value ?? "").replace(/[&<>"']/g, function (char) {
            return {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#039;"
            }[char];
        });
    }

    function getStorage(key) {
        try {
            return JSON.parse(
                localStorage.getItem(key) || "[]"
            );
        } catch (error) {
            console.error(error);
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
       CLOCK
    ===================================================== */

    function updateClock() {

        const clock = $("clock");
        const date = $("date");

        const now = new Date();

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
       DASHBOARD DATA
    ===================================================== */

    function loadDashboardData() {

        /*
         * รองรับทั้ง ID ที่มีอยู่ในหน้าเดิม
         * และ ID ที่อาจเพิ่มภายหลัง
         */

        const values = {

            populationTotal:
                population.total ?? 960,

            populationMale:
                population.male ?? 471,

            populationFemale:
                population.female ?? 489,

            householdsTotal:
                households.total ?? 352,

            elderlyTotal:
                survey.elderly60Plus ?? 92,

            elderlyPercent:
                survey.elderlyPercent ?? 45.5,

            vulnerableTotal:
                survey.vulnerableSelections ?? 95,

            disabledTotal:
                survey.disabled ?? 3,

            chronicTotal:
                survey.chronicDisease ?? 1,

            surveyTotal:
                survey.respondents ?? 202,

            surveyHouseholds:
                survey.households ?? 202
        };

        Object.keys(values).forEach(function (id) {

            const element = $(id);

            if (element) {
                element.textContent = values[id];
            }

        });
    }


    /* =====================================================
       LEADER
    ===================================================== */

    function loadLeader() {

        const name = $("leaderName");

        if (name) {

            name.textContent =
                leader.name ||
                "นายศักรนนท์ ขัติ์วงศ์";
        }
    }


    /* =====================================================
       NEWS
    ===================================================== */

    function loadNews() {

        const container = $("newsList");

        if (!container) return;

        const news = getStorage(NEWS_KEY);

        if (!news.length) {

            container.className = "empty";

            container.innerHTML = `
                <span class="emptyIcon">📣</span>
                ยังไม่มีข้อมูลประกาศ<br>
                ระบบพร้อมรับข้อมูลที่เพิ่มภายหลัง<br>
                <button
                    class="add"
                    onclick="openManager('news')">
                    ＋ เพิ่มประกาศ
                </button>
            `;

            return;
        }

        container.className = "";

        container.innerHTML =
            news.slice(0, 10).map(function (item) {

                return `
                    <div class="alert">

                        <b>
                            📢
                            ${escapeHTML(item.title)}
                        </b>

                        <small>
                            ${escapeHTML(item.date || "")}
                            ${item.time
                                ? " " + escapeHTML(item.time)
                                : ""}
                        </small>

                        ${
                            item.detail
                                ? `
                                <div style="margin-top:6px">
                                    ${escapeHTML(item.detail)}
                                </div>
                                `
                                : ""
                        }

                    </div>
                `;

            }).join("");
    }


    /* =====================================================
       ACTIVITY
    ===================================================== */

    function loadActivities() {

        const container = $("activityList");

        if (!container) return;

        const activities =
            getStorage(ACTIVITY_KEY);

        if (!activities.length) {

            container.className = "empty";

            container.innerHTML = `
                <span class="emptyIcon">🗓️</span>
                ยังไม่มีข้อมูลกิจกรรม<br>
                กรุณาเพิ่มข้อมูลกิจกรรมภายหลัง<br>
                <button
                    class="add"
                    onclick="openManager('activity')">
                    ＋ เพิ่มกิจกรรม
                </button>
            `;

            return;
        }

        container.className = "";

        container.innerHTML =
            activities.slice(0, 10)
            .map(function (item) {

                return `
                    <div class="alert">

                        <b>
                            📅
                            ${escapeHTML(item.title)}
                        </b>

                        <small>
                            ${escapeHTML(item.date || "")}
                            ${item.time
                                ? " " + escapeHTML(item.time)
                                : ""}
                        </small>

                        ${
                            item.detail
                                ? `
                                <div style="margin-top:6px">
                                    ${escapeHTML(item.detail)}
                                </div>
                                `
                                : ""
                        }

                    </div>
                `;

            }).join("");
    }


    /* =====================================================
       COMPLAINT / ALERT
    ===================================================== */

    function loadComplaints() {

        const container = $("alertList");

        if (!container) return;

        const complaints =
            getStorage(COMPLAINT_KEY);

        if (!complaints.length) return;

        const oldAlerts = container.innerHTML;

        container.innerHTML =
            complaints.slice(0, 10)
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

                        ${
                            item.detail
                                ? `
                                <div style="margin-top:6px">
                                    ${escapeHTML(item.detail)}
                                </div>
                                `
                                : ""
                        }

                    </div>
                `;

            }).join("") + oldAlerts;
    }


    /* =====================================================
       MODAL
    ===================================================== */

    function openModal(html) {

        const modal = $("modal");
        const box = $("modalBox");

        if (!modal || !box) return;

        box.innerHTML = html;

        modal.classList.add("show");
    }


    window.closeModal = function () {

        const modal = $("modal");

        if (modal) {
            modal.classList.remove("show");
        }
    };


    /* =====================================================
       NEWS / ACTIVITY / ALERT MANAGER
    ===================================================== */

    window.openManager = function (type) {

        let title = "จัดการข้อมูล";

        if (type === "news") {
            title = "📢 เพิ่มประกาศ";
        }

        if (type === "activity") {
            title = "📅 เพิ่มกิจกรรม";
        }

        if (type === "alert") {
            title = "🚨 เพิ่มแจ้งเหตุ / ร้องเรียน";
        }

        openModal(`

            <h2>${title}</h2>

            <label>
                หัวข้อ

                <input
                    id="managerTitle"
                    type="text"
                    placeholder="กรอกหัวข้อ">
            </label>

            <label>
                วันที่

                <input
                    id="managerDate"
                    type="date">
            </label>

            <label>
                เวลา

                <input
                    id="managerTime"
                    type="time">
            </label>

            <label>
                รายละเอียด

                <textarea
                    id="managerDetail"
                    placeholder="กรอกรายละเอียด">
                </textarea>
            </label>

            <div class="actions">

                <button
                    class="btn gray"
                    onclick="closeModal()">
                    ปิด
                </button>

                <button
                    class="btn green"
                    onclick="saveManagerItem('${type}')">
                    💾 บันทึก
                </button>

            </div>
        `);
    };


    window.saveManagerItem = function (type) {

        const title = $("managerTitle");
        const date = $("managerDate");
        const time = $("managerTime");
        const detail = $("managerDetail");

        if (!title || !title.value.trim()) {

            alert("กรุณากรอกหัวข้อ");

            return;
        }

        let key = NEWS_KEY;

        if (type === "activity") {
            key = ACTIVITY_KEY;
        }

        if (type === "alert") {
            key = COMPLAINT_KEY;
        }

        const items = getStorage(key);

        items.unshift({

            id: Date.now(),

            title:
                title.value.trim(),

            date:
                date
                    ? date.value
                    : "",

            time:
                time
                    ? time.value
                    : "",

            detail:
                detail
                    ? detail.value.trim()
                    : "",

            createdAt:
                new Date().toISOString()
        });

        setStorage(
            key,
            items
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
       SETTINGS
    ===================================================== */

    window.openSettings = function () {

        const settings =
            getSettings();

        openModal(`

            <h2>
                ⚙️ ตั้งค่าระบบ
            </h2>

            <label>
                ชื่อผู้ใหญ่บ้าน

                <input
                    id="settingName"
                    type="text"
                    value="${escapeHTML(
                        settings.name ||
                        leader.name ||
                        "นายศักรนนทน์ ขัติย์วงศ์"
                    )}">
            </label>

            <label>
                เบอร์โทรศัพท์

                <input
                    id="settingPhone"
                    type="text"
                    value="${escapeHTML(
                        settings.phone ||
                        leader.phone ||
                        "080-1202529"
                    )}">
            </label>

            <label>
                LINE ID

                <input
                    id="settingLine"
                    type="text"
                    value="${escapeHTML(
                        settings.line ||
                        leader.line ||
                        "rongkhem.village"
                    )}">
            </label>

            <label>
                รูปผู้ใหญ่บ้าน

                <input
                    id="leaderPhotoFile"
                    type="file"
                    accept="image/*">
            </label>

            <div class="actions">

                <button
                    class="btn gray"
                    onclick="closeModal()">
                    ปิด
                </button>

                <button
                    class="btn green"
                    onclick="saveSettings()">
                    💾 บันทึก
                </button>

            </div>
        `);
    };


    function getSettings() {

        try {

            return JSON.parse(
                localStorage.getItem(
                    SETTINGS_KEY
                ) || "{}"
            );

        } catch (error) {

            return {};
        }
    }


    function loadSettings() {

        const settings =
            getSettings();

        if (
            settings.name &&
            $("leaderName")
        ) {

            $("leaderName").textContent =
                settings.name;
        }
    }


    window.saveSettings = function () {

        const name =
            $("settingName")?.value.trim();

        const phone =
            $("settingPhone")?.value.trim();

        const line =
            $("settingLine")?.value.trim();

        const settings = {

            name:
                name ||
                leader.name ||
                "นายศักรนนทน์ ขัติย์วงศ์",

            phone:
                phone ||
                leader.phone ||
                "080-1202529",

            line:
                line ||
                leader.line ||
                "rongkhem.village"
        };

        localStorage.setItem(
            SETTINGS_KEY,
            JSON.stringify(settings)
        );

        if ($("leaderName")) {

            $("leaderName").textContent =
                settings.name;
        }

        const file =
            $("leaderPhotoFile")
                ?.files?.[0];

        if (file) {
            saveLeaderPhoto(file);
        }

        closeModal();

        alert(
            "บันทึกการตั้งค่าเรียบร้อยแล้ว"
        );
    };


    /* =====================================================
       LEADER PHOTO
    ===================================================== */

    function saveLeaderPhoto(file) {

        if (!file) return;

        if (!file.type.startsWith("image/")) {

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
                    LEADER_PHOTO_KEY,
                    image
                );

                showLeaderPhoto(
                    image
                );
            };

        reader.readAsDataURL(
            file
        );
    }


    function showLeaderPhoto(image) {

        const element =
            $("profilePic");

        if (!element) return;

        element.innerHTML =
            `
            <img
                src="${image}"
                alt="ผู้ใหญ่บ้าน"
                style="
                    width:100%;
                    height:100%;
                    object-fit:cover;
                ">
            `;
    }


    function loadLeaderPhoto() {

        const image =
            localStorage.getItem(
                LEADER_PHOTO_KEY
            );

        if (image) {
            showLeaderPhoto(image);
        }
    }


    /* =====================================================
       HERO IMAGE
       หมู่บ้านกองทุนแม่ของแผ่นดิน
    ===================================================== */

    window.openHeroUpload = function () {

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
                    input.files &&
                    input.files[0];

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

                if (
                    file.size >
                    10 * 1024 * 1024
                ) {

                    alert(
                        "รูปภาพต้องมีขนาดไม่เกิน 10 MB"
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
                            HERO_IMAGE_KEY,
                            image
                        );

                        applyHeroImage(
                            image
                        );

                    };

                reader.readAsDataURL(
                    file
                );
            };

        input.click();
    };


    function applyHeroImage(image) {

        const hero =
            $("heroBanner");

        if (!hero) return;

        hero.style.backgroundImage =
            `url("${image}")`;

        hero.style.backgroundSize =
            "cover";

        hero.style.backgroundPosition =
            "center";

        hero.style.backgroundRepeat =
            "no-repeat";
    }


    function loadHeroImage() {

        const image =
            localStorage.getItem(
                HERO_IMAGE_KEY
            );

        if (image) {

            applyHeroImage(
                image
            );
        }
    }


    /* =====================================================
       WEATHER
       Open-Meteo
    ===================================================== */

    async function loadWeather() {

        const weather =
            CONFIG.weather || {};

        const latitude =
            weather.latitude ??
            19.1920;

        const longitude =
            weather.longitude ??
            99.8780;

        const url =
            "https://api.open-meteo.com/v1/forecast" +
            `?latitude=${latitude}` +
            `&longitude=${longitude}` +
            "&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,weather_code" +
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

            let rain =
                null;

            if (
                data.hourly &&
                data.hourly.precipitation_probability
            ) {

                rain =
                    data.hourly
                        .precipitation_probability[0];
            }

            if ($("temp")) {

                $("temp").textContent =
                    temperature + "°C";
            }

            if ($("topTemp")) {

                $("topTemp").textContent =
                    temperature + "°C";
            }

            if ($("hum")) {

                $("hum").textContent =
                    humidity + "%";
            }

            if ($("wind")) {

                $("wind").textContent =
                    wind + " km/h";
            }

            if ($("weatherText")) {

                $("weatherText").textContent =
                    weatherDescription(
                        code
                    );
            }

            const rainElement =
                document.querySelector(
                    ".weather3 div:nth-child(2) b"
                );

            if (
                rainElement &&
                rain !== null
            ) {

                rainElement.textContent =
                    rain + "%";
            }

        } catch (error) {

            console.error(
                "Weather error:",
                error
            );

            if ($("weatherText")) {

                $("weatherText").textContent =
                    "ไม่สามารถโหลดข้อมูลสดได้";
            }
        }
    }


    function weatherDescription(code) {

        if (code === 0) {
            return "ท้องฟ้าแจ่มใส";
        }

        if (
            code === 1 ||
            code === 2
        ) {
            return "มีเมฆบางส่วน";
        }

        if (code === 3) {
            return "มีเมฆมาก";
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
            return "มีหิมะ";
        }

        if (
            code >= 80 &&
            code <= 82
        ) {
            return "ฝนตก";
        }

        if (code >= 95) {
            return "ฝนฟ้าคะนอง";
        }

        return "สภาพอากาศปัจจุบัน";
    }


    /* =====================================================
       PM2.5
    ===================================================== */

    async function loadPM25() {

        const pm =
            CONFIG.pm25 || {};

        const latitude =
            pm.latitude ??
            19.1920;

        const longitude =
            pm.longitude ??
            99.8780;

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

            if ($("pmv")) {

                $("pmv").textContent =
                    value.toFixed(1);
            }

            if ($("pmStatus")) {

                $("pmStatus").textContent =
                    getPM25Status(value);
            }

        } catch (error) {

            console.error(
                "PM2.5 error:",
                error
            );

            if ($("pmStatus")) {

                $("pmStatus").textContent =
                    "ไม่สามารถโหลดข้อมูลสดได้";
            }
        }
    }


    function getPM25Status(value) {

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
       AI ผู้ช่วยผู้ใหญ่บ้าน
    ===================================================== */

    window.askAI = function () {

        const box =
            $("aiText");

        if (!box) return;

        const question =
            prompt(
                "ถามข้อมูลบ้านร่องเข็มได้เลยครับ\n\n" +
                "ตัวอย่าง:\n" +
                "• ประชากรมีกี่คน?\n" +
                "• มีกี่ครัวเรือน?\n" +
                "• ผู้สูงอายุมีกี่คน?\n" +
                "• ข้อมูลสำรวจมีเท่าไร?\n" +
                "• ผู้พิการมีกี่คน?"
            );

        if (!question) return;

        const q =
            question
                .toLowerCase()
                .trim();

        let answer =
            "ขออภัยครับ ผมยังไม่มีข้อมูลคำถามนี้ใน Dashboard";


        if (
            q.includes("ประชากร") ||
            q.includes("ประชาชน")
        ) {

            answer =
                `บ้านร่องเข็มมีประชากร ${
                    population.total ?? 960
                } คน ` +
                `แบ่งเป็นชาย ${
                    population.male ?? 471
                } คน ` +
                `และหญิง ${
                    population.female ?? 489
                } คน`;
        }


        if (
            q.includes("ครัวเรือน") ||
            (
                q.includes("บ้าน") &&
                q.includes("หลัง")
            )
        ) {

            answer =
                `บ้านร่องเข็มมี ${
                    households.total ?? 352
                } ครัวเรือน`;
        }


        if (
            q.includes("ผู้สูงอายุ") ||
            q.includes("อายุ 60")
        ) {

            answer =
                `ผู้สูงอายุอายุ 60 ปีขึ้นไปมี ${
                    survey.elderly60Plus ?? 92
                } คน ` +
                `คิดเป็น ${
                    survey.elderlyPercent ?? 45.5
                }% ของผู้ตอบแบบสำรวจ`;
        }


        if (
            q.includes("สำรวจ") ||
            q.includes("ผู้ตอบ")
        ) {

            answer =
                `มีผู้ตอบแบบสำรวจ ${
                    survey.respondents ?? 202
                } คน ` +
                `จาก ${
                    survey.households ?? 202
                } ครัวเรือน`;
        }


        if (
            q.includes("ผู้พิการ")
        ) {

            answer =
                `ข้อมูลสำรวจระบุผู้พิการ ${
                    survey.disabled ?? 3
                } คน`;
        }


        if (
            q.includes("โรคเรื้อรัง")
        ) {

            answer =
                `ข้อมูลสำรวจระบุผู้มีโรคเรื้อรัง ${
                    survey.chronicDisease ?? 1
                } คน`;
        }


        if (
            q.includes("กลุ่มเปราะบาง")
        ) {

            answer =
                `ข้อมูลกลุ่มเปราะบางมี ${
                    survey.vulnerableSelections ?? 95
                } รายการ`;
        }


        box.innerHTML =
            `
            <b>🤖 ผู้ช่วย AI</b>
            <br>
            ${escapeHTML(answer)}
            `;
    };


    /* =====================================================
       NAVIGATION
    ===================================================== */

    function setupNavigation() {

        document
            .querySelectorAll(".nav")
            .forEach(function (nav) {

                nav.addEventListener(
                    "click",
                    function () {

                        document
                            .querySelectorAll(".nav")
                            .forEach(
                                function (item) {
                                    item.classList.remove(
                                        "active"
                                    );
                                }
                            );

                        nav.classList.add(
                            "active"
                        );
                    }
                );
            });
    }


    /* =====================================================
       MODAL CLICK
    ===================================================== */

    function setupModal() {

        const modal =
            $("modal");

        if (!modal) return;

        modal.addEventListener(
            "click",
            function (event) {

                if (
                    event.target ===
                    modal
                ) {

                    window.closeModal();
                }
            }
        );
    }


    /* =====================================================
       INIT
    ===================================================== */

    function init() {

        loadDashboardData();

        loadLeader();

        loadSettings();

        loadLeaderPhoto();

        loadHeroImage();

        loadNews();

        loadActivities();

        loadComplaints();

        updateClock();

        setupNavigation();

        setupModal();

        loadWeather();

        loadPM25();


        /* นาฬิกา */

        setInterval(
            updateClock,
            1000
        );


        /* Weather Real-time */

        const weatherRefresh =
            CONFIG.refresh?.weather ??
            300000;

        setInterval(
            loadWeather,
            weatherRefresh
        );


        /* PM2.5 Real-time */

        const pmRefresh =
            CONFIG.refresh?.pm25 ??
            300000;

        setInterval(
            loadPM25,
            pmRefresh
        );

    }


    /* =====================================================
       START
    ===================================================== */

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
