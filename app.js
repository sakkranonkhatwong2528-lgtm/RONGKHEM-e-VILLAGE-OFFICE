/* =========================================================
   RONGKHEM e-VILLAGE OFFICE
   APP.JS — COMPLETE
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       DATA / CONFIG
    ===================================================== */

    const DATA =
        window.RONGKHEM_DATA || {};

    const CONFIG =
        window.RONGKHEM_CONFIG || {};


    const population =
        DATA.population || {};

    const households =
        DATA.households || {};

    const survey =
        DATA.survey || {};

    const leader =
        DATA.leader || {};


    /* =====================================================
       HELPER
    ===================================================== */

    function $(id) {
        return document.getElementById(id);
    }


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


    /* =====================================================
       CLOCK
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


    /* =====================================================
       DASHBOARD DATA
    ===================================================== */

    function loadDashboardData() {

        const map = {

            populationTotal:
                population.total,

            populationMale:
                population.male,

            populationFemale:
                population.female,

            householdsTotal:
                households.total,

            elderlyTotal:
                survey.elderly60Plus,

            elderlyPercent:
                survey.elderlyPercent,

            vulnerableTotal:
                survey.vulnerableSelections,

            disabledTotal:
                survey.disabled,

            chronicTotal:
                survey.chronicDisease,

            surveyTotal:
                survey.respondents,

            surveyHouseholds:
                survey.households

        };


        Object.keys(map).forEach(
            function (id) {

                const element =
                    $(id);

                if (element) {

                    element.textContent =
                        map[id] ?? 0;

                }

            }
        );

    }


    /* =====================================================
       LEADER
    ===================================================== */

    function loadLeader() {

        const name =
            $("leaderName");


        if (
            name &&
            leader.name
        ) {

            name.textContent =
                leader.name;

        }

    }


    /* =====================================================
       LOCAL STORAGE
    ===================================================== */

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
       NEWS
    ===================================================== */

    const NEWS_KEY =
        "RONGKHEM_NEWS";


    function loadNews() {

        const container =
            $("newsList");

        if (!container) return;


        const news =
            getStorage(NEWS_KEY);


        if (!news.length) return;


        container.className = "";


        container.innerHTML =
            news
                .slice(0, 10)
                .map(function (item) {

                    return `

                    <div class="alert">

                        <b>
                            📢
                            ${escapeHTML(item.title)}
                        </b>

                        <small>
                            ${escapeHTML(item.date || "")}
                            ${item.time ? " " + escapeHTML(item.time) : ""}
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

                })
                .join("");

    }


    /* =====================================================
       ACTIVITY
    ===================================================== */

    const ACTIVITY_KEY =
        "RONGKHEM_ACTIVITY";


    function loadActivities() {

        const container =
            $("activityList");

        if (!container) return;


        const activities =
            getStorage(ACTIVITY_KEY);


        if (!activities.length) return;


        container.className = "";


        container.innerHTML =
            activities
                .slice(0, 10)
                .map(function (item) {

                    return `

                    <div class="alert">

                        <b>
                            📅
                            ${escapeHTML(item.title)}
                        </b>

                        <small>
                            ${escapeHTML(item.date || "")}
                            ${item.time ? " " + escapeHTML(item.time) : ""}
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

                })
                .join("");

    }


    /* =====================================================
       COMPLAINT
    ===================================================== */

    const COMPLAINT_KEY =
        "RONGKHEM_COMPLAINT";


    function loadComplaints() {

        const container =
            $("alertList");

        if (!container) return;


        const complaints =
            getStorage(COMPLAINT_KEY);


        if (!complaints.length) return;


        container.innerHTML =
            complaints
                .slice(0, 10)
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

                })
                .join("");

    }


    /* =====================================================
       MODAL
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
       MANAGER
    ===================================================== */

    window.openManager =
        function (type) {

            let title =
                "จัดการข้อมูล";

            if (type === "news") {

                title =
                    "📢 เพิ่มประกาศ";

            }

            if (type === "activity") {

                title =
                    "📅 เพิ่มกิจกรรม";

            }

            if (type === "alert") {

                title =
                    "🚨 เพิ่มแจ้งเหตุ / ร้องเรียน";

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


            if (type === "alert") {

                key =
                    COMPLAINT_KEY;

            }


            const items =
                getStorage(key);


            items.unshift({

                id:
                    Date.now(),

                title:
                    title.value.trim(),

                date:
                    date ? date.value : "",

                time:
                    time ? time.value : "",

                detail:
                    detail ? detail.value.trim() : "",

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
                        type="text"
                        value="${escapeHTML(
                            leader.name ||
                            "นายศักรนนท์ ขัติ์วงศ์"
                        )}"
                    >

                </label>


                <label>
                    เบอร์โทรศัพท์

                    <input
                        id="settingPhone"
                        type="text"
                        value="${escapeHTML(
                            leader.phone ||
                            "080-1202529"
                        )}"
                    >

                </label>


                <label>
                    LINE ID

                    <input
                        id="settingLine"
                        type="text"
                        value="${escapeHTML(
                            leader.line ||
                            "rongkhem.village"
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


    window.saveSettings =
        function () {

            const name =
                $("settingName")?.value.trim();

            const phone =
                $("settingPhone")?.value.trim();

            const line =
                $("settingLine")?.value.trim();


            const settings = {

                name:
                    name || leader.name,

                phone:
                    phone || leader.phone,

                line:
                    line || leader.line

            };


            localStorage.setItem(
                "RONGKHEM_SETTINGS",
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

                saveLeaderPhoto(
                    file
                );

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


        if (
            !file.type.startsWith("image/")
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

    }


    function showLeaderPhoto(image) {

        const element =
            $("profilePic");


        if (!element) return;


        element.innerHTML =
            `<img
                src="${image}"
                alt="ผู้ใหญ่บ้าน"
            >`;

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
       HERO IMAGE
       หมู่บ้านกองทุนแม่ของแผ่นดิน
    ===================================================== */

    const HERO_IMAGE_KEY =
        "RONGKHEM_HERO_IMAGE";


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


                            alert(
                                "เปลี่ยนรูปภาพเรียบร้อยแล้ว"
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

        const weatherConfig =
            CONFIG.weather;


        if (
            !weatherConfig ||
            weatherConfig.enabled === false
        ) {

            return;

        }


        const latitude =
            weatherConfig.latitude;


        const longitude =
            weatherConfig.longitude;


        const url =
            "https://api.open-meteo.com/v1/forecast" +

            `?latitude=${latitude}` +

            `&longitude=${longitude}` +

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


            const weatherCode =
                current.weather_code;


            const precipitation =
                data.hourly &&
                data.hourly.precipitation_probability
                    ? data.hourly.precipitation_probability[0]
                    : null;


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


            if (
                $("weatherText")
            ) {

                $("weatherText").textContent =
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
                precipitation !== null
            ) {

                rainElement.textContent =
                    precipitation + "%";

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

        const pmConfig =
            CONFIG.pm25;


        if (
            !pmConfig ||
            pmConfig.enabled === false
        ) {

            return;

        }


        const latitude =
            pmConfig.latitude;


        const longitude =
            pmConfig.longitude;


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
       SETTINGS LOAD
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

            console.error(error);

        }

    }


    /* =====================================================
       MODAL BACKGROUND
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

        loadWeather();

        loadPM25();


        setInterval(
            updateClock,
            1000
        );


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
