/* =========================================================
   RONGKHEM e-VILLAGE
   VERIFIED DATA
   ========================================================= */

const RONGKHEM_DATA = {

    village: {

        name:
            "บ้านร่องเข็ม",

        villageNo:
            6,

        subdistrict:
            "จำป่าหวาย",

        district:
            "เมืองพะเยา",

        province:
            "พะเยา"

    },


    leader: {

        name:
            "นายศักรนนท์ ขัติ์วงศ์",

        role:
            "ผู้ใหญ่บ้าน หมู่ที่ 6",

        phone:
            "088-888-8888",

        line:
            "rongkhem.village"

    },


    population: {

        total:
            960,

        male:
            471,

        female:
            489

    },


    households: {

        total:
            352

    },


    survey: {

        respondents:
            202,

        households:
            202,

        elderly60Plus:
            92,

        elderlyPercent:
            45.5,

        disabled:
            3,

        chronicDisease:
            1,

        vulnerableSelections:
            95

    },


    verified:
        true,


    source:
        "VERIFIED DATA BUILD"

};


/* =========================================================
   GLOBAL
========================================================= */

window.RONGKHEM_DATA =
    RONGKHEM_DATA;


/* =========================================================
   รองรับระบบอื่น
========================================================= */

if (
    typeof module !== "undefined" &&
    module.exports
) {

    module.exports =
        RONGKHEM_DATA;

}
