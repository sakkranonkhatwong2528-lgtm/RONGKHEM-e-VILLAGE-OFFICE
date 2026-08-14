/* =========================================================
   RONGKHEM e-VILLAGE OFFICE
   DATA.JS
   ========================================================= */

const DATA = {

    /* =====================================================
       ข้อมูลประชาชน
       ===================================================== */

    population: {

        total: 960,

        male: 471,

        female: 489

    },


    /* =====================================================
       ข้อมูลครัวเรือน
       ===================================================== */

    households: {

        total: 352

    },


    /* =====================================================
       ข้อมูลแบบสำรวจ
       ===================================================== */

    survey: {

        respondents: 202,

        households: 202,

        elderly60Plus: 92,

        vulnerableSelections: 95

    },


    /* =====================================================
       ผู้สูงอายุ
       ===================================================== */

    elderly: {

        total: 92

    },


    /* =====================================================
       กลุ่มเปราะบาง
       ===================================================== */

    vulnerable: {

        total: 95,

        disabled: 3,

        chronicDisease: 1

    },


    /* =====================================================
       หมู่บ้าน
       ===================================================== */

    village: {

        name:
            "บ้านร่องเข็ม",

        moo:
            "หมู่ที่ 6",

        tambon:
            "จำป่าหวาย",

        district:
            "เมืองพะเยา",

        province:
            "พะเยา",

        phone:
            "080-1202529",

        line:
            "rongkhem.village"

    }

};


/* =========================================================
   DEFAULT DATA
   ใช้กรณีเปิดระบบครั้งแรก
   ========================================================= */

const DEFAULT_DATA = {

    news: [],

    activity: [],

    alert: [],

    leaders: [],

    services: [],

    projects: [],

    pm: [],

    wetland: [],

    rice: [],

    statistics: [],

    population: [],

    households: []

};


/* =========================================================
   STORAGE KEYS
   ========================================================= */

const STORAGE_KEYS = {

    news:
        "RONGKHEM_NEWS",

    activity:
        "RONGKHEM_ACTIVITY",

    alert:
        "RONGKHEM_ALERT",

    leaders:
        "RONGKHEM_LEADERS",

    services:
        "RONGKHEM_SERVICES",

    projects:
        "RONGKHEM_PROJECTS",

    pm:
        "RONGKHEM_PM",

    wetland:
        "RONGKHEM_WETLAND",

    rice:
        "RONGKHEM_RICE",

    statistics:
        "RONGKHEM_STATISTICS",

    population:
        "RONGKHEM_POPULATION",

    households:
        "RONGKHEM_HOUSEHOLDS"

};


/* =========================================================
   DEFAULT ALERT
   ========================================================= */

const DEFAULT_ALERTS = [

    {
        id:
            "alert-001",

        title:
            "ประชุมประจำเดือนกำนันผู้ใหญ่บ้าน",

        date:
            "2569-08-15",

        time:
            "09:00",

        location:
            "",

        status:
            "กำหนดการ",

        detail:
            "",

        image:
            ""
    },

    {
        id:
            "alert-002",

        title:
            "โครงการ Big Cleaning Day",

        date:
            "2569-08-17",

        time:
            "08:00",

        location:
            "บ้านร่องเข็ม หมู่ที่ 6",

        status:
            "กำหนดการ",

        detail:
            "",

        image:
            ""
    },

    {
        id:
            "alert-003",

        title:
            "รณรงค์ป้องกัน PM2.5",

        date:
            "2569-08-20",

        time:
            "09:00",

        location:
            "บ้านร่องเข็ม",

        status:
            "กำหนดการ",

        detail:
            "",

        image:
            ""
    }

];


/* =========================================================
   SAFE JSON
   ========================================================= */

function getJSON(
    key,
    fallback
) {

    try {

        const value =
            localStorage.getItem(
                key
            );

        if (
            value === null
        ) {

            return fallback;
        }

        const parsed =
            JSON.parse(
                value
            );

        return parsed;

    } catch (error) {

        console.error(
            "getJSON error:",
            key,
            error
        );

        return fallback;
    }
}


/* =========================================================
   SAVE JSON
   ========================================================= */

function saveJSON(
    key,
    value
) {

    try {

        localStorage.setItem(
            key,
            JSON.stringify(
                value
            )
        );

        return true;

    } catch (error) {

        console.error(
            "saveJSON error:",
            key,
            error
        );


        if (
            error.name ===
            "QuotaExceededError"
        ) {

            alert(
                "พื้นที่จัดเก็บข้อมูลของเบราว์เซอร์เต็ม\n\n" +
                "รูปภาพที่อัปโหลดอาจมีขนาดใหญ่เกินไป " +
                "กรุณาใช้รูปขนาดเล็กลง"
            );

        } else {

            alert(
                "ไม่สามารถบันทึกข้อมูลได้"
            );
        }

        return false;
    }
}


/* =========================================================
   ESCAPE HTML
   ป้องกัน HTML แปลกปลอมในข้อมูล
   ========================================================= */

function escapeHTML(
    value
) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";
    }


    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );
}


/* =========================================================
   SHORTCUT
   ========================================================= */

function $(
    id
) {

    return document.getElementById(
        id
    );
}


/* =========================================================
   SETTINGS
   ========================================================= */

function getSettings() {

    const saved =
        getJSON(
            "RONGKHEM_SETTINGS",
            null
        );


    if (
        saved &&
        typeof saved ===
        "object"
    ) {

        return {

            ...DEFAULT_LEADER,

            ...saved

        };
    }


    return {
        ...DEFAULT_LEADER
    };
}


/* =========================================================
   LOAD LEADER
   ========================================================= */

function loadLeader() {

    const settings =
        getSettings();


    if (
        $("leaderName")
    ) {

        $("leaderName")
            .textContent =
            settings.name;
    }
}


/* =========================================================
   LEADER PHOTO
   ========================================================= */

function loadLeaderPhoto() {

    const photo =
        localStorage.getItem(
            "RONGKHEM_LEADER_PHOTO"
        );


    const box =
        $("profilePic");


    if (
        !box ||
        !photo
    ) {

        return;
    }


    box.innerHTML =
        `
        <img
            src="${escapeHTML(photo)}"
            alt="ผู้ใหญ่บ้าน"
            style="
                width:100%;
                height:100%;
                object-fit:cover;
                border-radius:50%;
                display:block;
            "
        >
        `;
}


/* =========================================================
   แก้ชื่อผู้ใหญ่บ้านเก่า
   ========================================================= */

function normalizeLeaderName() {

    const correctName =
        "นายศักรนนทน์ ขัติย์วงศ์";


    const settings =
        getJSON(
            "RONGKHEM_SETTINGS",
            null
        );


    if (
        !settings ||
        typeof settings !==
        "object"
    ) {

        saveJSON(
            "RONGKHEM_SETTINGS",
            {
                ...DEFAULT_LEADER,
                name:
                    correctName
            }
        );

        return;
    }


    /*
      ถ้าเป็นชื่อเก่าที่เคยบันทึกไว้
      ให้แก้เป็นชื่อปัจจุบัน
    */

    const oldNames = [

        "นายศักรนนท์ ขัติ์วงศ์",

        "นายศักรนนท์ ขัติย์วงศ์",

        "นายศักรนนท์ ขัติ์วงศ์"

    ];


    if (
        oldNames.includes(
            settings.name
        )
    ) {

        settings.name =
            correctName;


        saveJSON(
            "RONGKHEM_SETTINGS",
            settings
        );
    }


    if (
        $("leaderName")
    ) {

        $("leaderName")
            .textContent =
            correctName;
    }
}


/* =========================================================
   CLOCK
   ========================================================= */

function updateClock() {

    const now =
        new Date();


    const time =
        now.toLocaleTimeString(
            "th-TH",
            {
                hour:
                    "2-digit",

                minute:
                    "2-digit",

                second:
                    "2-digit",

                hour12:
                    false
            }
        );


    const date =
        now.toLocaleDateString(
            "th-TH",
            {
                weekday:
                    "long",

                day:
                    "numeric",

                month:
                    "long",

                year:
                    "numeric"
            }
        );


    if (
        $("clock")
    ) {

        $("clock")
            .textContent =
            time;
    }


    if (
        $("date")
    ) {

        $("date")
            .textContent =
            date;
    }
}


/* =========================================================
   สร้างข้อมูลตัวอย่างแจ้งเตือนครั้งแรก
   ========================================================= */

function initializeDefaultData() {

    const alertKey =
        STORAGE_KEYS.alert;


    const current =
        localStorage.getItem(
            alertKey
        );


    if (
        current === null
    ) {

        saveJSON(
            alertKey,
            DEFAULT_ALERTS
        );
    }


    /*
      สร้าง storage ว่างสำหรับเมนูอื่น
      เฉพาะกรณียังไม่มี key
    */

    Object.keys(
        STORAGE_KEYS
    ).forEach(
        key => {

            const storage =
                STORAGE_KEYS[key];


            if (
                localStorage.getItem(
                    storage
                ) === null
            ) {

                saveJSON(
                    storage,
                    DEFAULT_DATA[key]
                    || []
                );
            }
        }
    );
}


/* =========================================================
   เรียกเริ่มต้นข้อมูล
   ========================================================= */

initializeDefaultData();


/* =========================================================
   จบ DATA.JS
   ========================================================= */
