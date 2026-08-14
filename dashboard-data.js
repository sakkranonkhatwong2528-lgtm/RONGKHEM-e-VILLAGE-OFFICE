const RONGKHEM_DATA = {

    village: {
        name: "บ้านร่องเข็ม",
        villageNo: 6,
        subdistrict: "จำป่าหวาย",
        district: "เมืองพะเยา",
        province: "พะเยา"
    },

    leader: {
        name: "นายศักรนนท์ ขัติ์วงศ์",
        role: "ผู้ใหญ่บ้าน หมู่ที่ 6",
        phone: "088-888-8888",
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

window.RONGKHEM_DATA = RONGKHEM_DATA;


/* =========================================
   AUTO RENDER
========================================= */

(function () {

    function set(id, value) {

        const el =
            document.getElementById(id);

        if (el) {
            el.textContent = value;
        }

    }


    function nf(value) {

        return Number(value)
            .toLocaleString("th-TH");

    }


    function render() {

        const D =
            window.RONGKHEM_DATA;

        if (!D) return;


        /* ผู้ใหญ่บ้าน */

        set(
            "leaderName",
            D.leader.name
        );

        set(
            "leaderRole",
            D.leader.role
        );


        set(
            "phone",
            D.leader.phone
        );


        set(
            "line",
            D.leader.line
        );


        /* ประชาชน */

        set(
            "popTotal",
            nf(D.population.total)
        );


        const popDetail =
            document.getElementById(
                "popDetail"
            );

        if (popDetail) {

            popDetail.innerHTML =
                `หญิง ${nf(D.population.female)} คน<br>
                 ชาย ${nf(D.population.male)} คน`;

        }


        /* ครัวเรือน */

        set(
            "houseTotal",
            nf(D.households.total)
        );


        set(
            "houseDetail",
            `ข้อมูลที่ตรวจสอบแล้ว ${nf(D.households.total)} หลัง`
        );


        /* ผู้สูงอายุ */

        set(
            "elderlyTotal",
            nf(D.survey.elderly60Plus)
        );


        const elderlyDetail =
            document.getElementById(
                "elderlyDetail"
            );

        if (elderlyDetail) {

            elderlyDetail.innerHTML =
                `อายุ 60 ปีขึ้นไป<br>
                 ${D.survey.elderlyPercent}% ของผู้ตอบแบบสำรวจ`;

        }


        /* กลุ่มเปราะบาง */

        set(
            "vulnerableTotal",
            nf(D.survey.vulnerableSelections)
        );


        set(
            "disabledTotal",
            nf(D.survey.disabled)
        );


        set(
            "chronicTotal",
            nf(D.survey.chronicDisease)
        );


        /* แบบสำรวจ */

        set(
            "surveyTotal",
            nf(D.survey.respondents)
        );


        set(
            "surveyHouseholds",
            nf(D.survey.households)
        );


        /* รองรับ ID รุ่นใหม่ */

        set(
            "populationTotal",
            nf(D.population.total)
        );


        set(
            "populationMale",
            nf(D.population.male)
        );


        set(
            "populationFemale",
            nf(D.population.female)
        );


        set(
            "householdTotal",
            nf(D.households.total)
        );

    }


    /* =========================================
       นาฬิกา
    ========================================= */

    function clock() {

        const now =
            new Date();


        set(
            "clock",
            now.toLocaleTimeString(
                "th-TH",
                {
                    hour12: false
                }
            )
        );


        set(
            "date",
            now.toLocaleDateString(
                "th-TH",
                {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                }
            )
        );


        set(
            "day",
            "📅 " +
            now.toLocaleDateString(
                "th-TH",
                {
                    weekday: "long"
                }
            )
        );

    }


    function start() {

        render();

        clock();

        setInterval(
            clock,
            1000
        );

    }


    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            start,
            {
                once: true
            }
        );

    } else {

        start();

    }

})();
