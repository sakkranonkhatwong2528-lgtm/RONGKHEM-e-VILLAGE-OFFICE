/* =========================================================
   RONGKHEM e-VILLAGE
   VERIFIED DATA BUILD
   ========================================================= */

window.RONGKHEM_VERIFIED_DATA = {
    village: {
        name: "บ้านร่องเข็ม",
        villageNo: "6",
        subdistrict: "จำป่าหวาย",
        district: "เมืองพะเยา",
        province: "พะเยา"
    },

    leader: {
        name: "นายศักรนนทน์ ขัติย์วงศ์",
        position: "ผู้ใหญ่บ้าน หมู่ที่ 6",
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
        total: 202,
        households: 202,
        elderly60Plus: 92,
        elderlyPercent: 45.5,
        disabled: 3,
        chronicDisease: 1,
        vulnerableSelections: 95
    },

    verified: true
};


/* =========================================================
   ตัวช่วยใส่ข้อมูลลง HTML
   ========================================================= */

(function () {

    const D = window.RONGKHEM_VERIFIED_DATA;

    function set(id, value) {

        const el = document.getElementById(id);

        if (el) {
            el.textContent = value;
        }

    }


    function number(value) {

        return Number(value).toLocaleString("th-TH");

    }


    document.addEventListener(
        "DOMContentLoaded",
        function () {

            /* -------------------------
               หมู่บ้าน
            ------------------------- */

            set(
                "villageName",
                D.village.name
            );

            set(
                "villageAddress",
                `${D.village.name} หมู่ ${D.village.villageNo} ตำบล${D.village.subdistrict} อำเภอ${D.village.district} จังหวัด${D.village.province}`
            );


            /* -------------------------
               ผู้ใหญ่บ้าน
            ------------------------- */

            set(
                "leaderName",
                D.leader.name
            );

            set(
                "leaderPosition",
                D.leader.position
            );

            set(
                "leaderPhone",
                D.leader.phone
            );


            /* -------------------------
               ประชาชน
            ------------------------- */

            set(
                "populationTotal",
                number(D.population.total)
            );

            set(
                "populationMale",
                number(D.population.male)
            );

            set(
                "populationFemale",
                number(D.population.female)
            );


            /* -------------------------
               ครัวเรือน
            ------------------------- */

            set(
                "householdTotal",
                number(D.households.total)
            );


            /* -------------------------
               ผู้สูงอายุ
            ------------------------- */

            set(
                "elderlyTotal",
                number(D.survey.elderly60Plus)
            );

            set(
                "elderlyPercent",
                D.survey.elderlyPercent + "%"
            );


            /* -------------------------
               กลุ่มเปราะบาง
            ------------------------- */

            set(
                "vulnerableTotal",
                number(D.survey.vulnerableSelections)
            );

            set(
                "disabledTotal",
                number(D.survey.disabled)
            );

            set(
                "chronicTotal",
                number(D.survey.chronicDisease)
            );


            /* -------------------------
               แบบสำรวจ
            ------------------------- */

            set(
                "surveyTotal",
                number(D.survey.total)
            );

            set(
                "surveyHouseholds",
                number(D.survey.households)
            );


            /* -------------------------
               สถานะ VERIFIED
            ------------------------- */

            document
                .querySelectorAll(".verified-data")
                .forEach(function (el) {

                    el.textContent =
                        "🟢 ข้อมูลจาก VERIFIED DATA BUILD";

                });

        }
    );

})();
