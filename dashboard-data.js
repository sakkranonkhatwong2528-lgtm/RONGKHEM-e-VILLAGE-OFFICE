/* =========================================================
   RONGKHEM e-VILLAGE OFFICE
   DATA.JS — RECOVERY VERSION
   อ่านข้อมูลเดิมกลับมา
   ========================================================= */

const CORRECT_LEADER_NAME =
    "นายศักรนนทน์ ขัติย์วงศ์";

const DEFAULT_RONGKHEM_DATA = {

    village: {
        name: "บ้านร่องเข็ม",
        moo: "หมู่ที่ 6",
        tambon: "จำป่าหวาย",
        district: "เมืองพะเยา",
        province: "พะเยา"
    },

    leader: {
        name: CORRECT_LEADER_NAME,
        role: "ผู้ใหญ่บ้าน หมู่ที่ 6",
        phone: "080-1202529",
        line: "rongkhem.village"
    },

    population: {
        total: 960,
        male: 471,
        female: 489
    },

    households: {
        total: 352
    },

    survey: {
        respondents: 202,
        households: 202,
        elderly60Plus: 92,
        elderlyPercent: 45.5,
        disabled: 3,
        chronicDisease: 1,
        vulnerableSelections: 95
    },

    verified: true,

    source: "VERIFIED DATA BUILD"
};


/* =========================================================
   อ่านข้อมูล Dashboard เดิม
   ========================================================= */

function loadOldDashboardData() {

    try {

        const saved =
            localStorage.getItem(
                "RONGKHEM_DASHBOARD_DATA"
            );

        if (!saved) {

            return DEFAULT_RONGKHEM_DATA;
        }

        const old =
            JSON.parse(saved);

        return {

            ...DEFAULT_RONGKHEM_DATA,

            ...old,

            village: {
                ...DEFAULT_RONGKHEM_DATA.village,
                ...(old.village || {})
            },

            leader: {
                ...DEFAULT_RONGKHEM_DATA.leader,
                ...(old.leader || {})
            },

            population: {
                ...DEFAULT_RONGKHEM_DATA.population,
                ...(old.population || {})
            },

            households: {
                ...DEFAULT_RONGKHEM_DATA.households,
                ...(old.households || {})
            },

            survey: {
                ...DEFAULT_RONGKHEM_DATA.survey,
                ...(old.survey || {})
            }

        };

    } catch (e) {

        console.error(
            "ไม่สามารถอ่านข้อมูล Dashboard เดิม",
            e
        );

        return DEFAULT_RONGKHEM_DATA;
    }
}


/* =========================================================
   GLOBAL DATA
   ========================================================= */

let RONGKHEM_DATA =
    loadOldDashboardData();

window.RONGKHEM_DATA =
    RONGKHEM_DATA;


/* =========================================================
   ป้องกันชื่อผิด
   ========================================================= */

RONGKHEM_DATA.leader.name =
    CORRECT_LEADER_NAME;


/* =========================================================
   ฟังก์ชันบันทึก Dashboard
   ========================================================= */

function saveDashboardData() {

    try {

        localStorage.setItem(
            "RONGKHEM_DASHBOARD_DATA",
            JSON.stringify(
                RONGKHEM_DATA
            )
        );

        return true;

    } catch (e) {

        console.error(
            "บันทึก Dashboard ไม่สำเร็จ",
            e
        );

        return false;
    }
}


/* =========================================================
   ฟังก์ชันอ่านข้อมูลโมดูล
   ========================================================= */

function moduleKey(name) {

    return (
        "RONGKHEM_MODULE_" +
        String(name)
            .toUpperCase()
    );
}


function loadModule(name) {

    try {

        const key =
            moduleKey(name);

        const saved =
            localStorage.getItem(key);

        if (!saved) {

            return [];
        }

        const data =
            JSON.parse(saved);

        return Array.isArray(data)
            ? data
            : [];

    } catch (e) {

        console.error(
            "โหลดโมดูลไม่สำเร็จ",
            name,
            e
        );

        return [];
    }
}


function saveModule(
    name,
    data
) {

    try {

        localStorage.setItem(
            moduleKey(name),
            JSON.stringify(data)
        );

        return true;

    } catch (e) {

        console.error(
            "บันทึกโมดูลไม่สำเร็จ",
            name,
            e
        );

        return false;
    }
}


/* =========================================================
   ข้อมูลเมนูเดิม
   ========================================================= */

window.RONGKHEM_MODULE_DATA = {

    leaders:
        loadModule("LEADER"),

    population:
        loadModule("POPULATION"),

    household:
        loadModule("HOUSEHOLD"),

    complaint:
        loadModule("COMPLAINT"),

    service:
        loadModule("SERVICE"),

    project:
        loadModule("PROJECT"),

    environment:
        loadModule("ENVIRONMENT"),

    wetland:
        loadModule("WETLAND"),

    rice:
        loadModule("RICE"),

    statistics:
        loadModule("STATISTICS")

};


/* =========================================================
   ข้อมูลเก่าแบบ KEY เดิม
   เผื่อระบบเดิมใช้ชื่อเหล่านี้
   ========================================================= */

window.RONGKHEM_OLD_KEYS = {

    news:
        "RONGKHEM_NEWS",

    activities:
        "RONGKHEM_ACTIVITIES",

    complaints:
        "RONGKHEM_COMPLAINTS",

    services:
        "RONGKHEM_SERVICES",

    projects:
        "RONGKHEM_PROJECTS",

    wetland:
        "RONGKHEM_WETLAND",

    rice:
        "RONGKHEM_RICE"

};


/* =========================================================
   อ่าน JSON อย่างปลอดภัย
   ========================================================= */

function getJSON(
    key,
    fallback = []
) {

    try {

        const value =
            localStorage.getItem(key);

        if (!value) {

            return fallback;
        }

        const data =
            JSON.parse(value);

        return data;

    } catch (e) {

        return fallback;
    }
}


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHTML(value) {

    return String(
        value ?? ""
    )
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
   เรียกข้อมูลสถิติ
   ========================================================= */

function getDashboardStats() {

    return {

        population:
            RONGKHEM_DATA.population.total,

        male:
            RONGKHEM_DATA.population.male,

        female:
            RONGKHEM_DATA.population.female,

        households:
            RONGKHEM_DATA.households.total,

        elderly:
            RONGKHEM_DATA.survey.elderly60Plus,

        elderlyPercent:
            RONGKHEM_DATA.survey.elderlyPercent,

        vulnerable:
            RONGKHEM_DATA.survey.vulnerableSelections,

        disabled:
            RONGKHEM_DATA.survey.disabled,

        chronic:
            RONGKHEM_DATA.survey.chronicDisease,

        survey:
            RONGKHEM_DATA.survey.respondents

    };

}


/* =========================================================
   สำคัญ:
   ห้ามลบ RONGKHEM_DASHBOARD_DATA
   ========================================================= */

console.log(
    "✓ RONGKHEM DATA RECOVERY READY"
);

console.log(
    "ประชาชน:",
    RONGKHEM_DATA.population.total
);

console.log(
    "ครัวเรือน:",
    RONGKHEM_DATA.households.total
);

console.log(
    "ผู้สูงอายุ:",
    RONGKHEM_DATA.survey.elderly60Plus
);

console.log(
    "ชื่อผู้ใหญ่บ้าน:",
    RONGKHEM_DATA.leader.name
);
