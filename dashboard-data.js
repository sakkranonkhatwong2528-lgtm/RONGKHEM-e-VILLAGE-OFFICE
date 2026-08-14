/* =========================================================
   RONGKHEM e-VILLAGE
   DASHBOARD DATA ENGINE
   Supabase → VERIFIED DATA fallback
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       VERIFIED DATA สำรอง
       ===================================================== */

    const VERIFIED = {

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
        }

    };


    /* =====================================================
       ตัวช่วย
    ===================================================== */

    function setText(id, value) {

        const el =
            document.getElementById(id);

        if (el) {

            el.textContent =
                value ?? "--";

        }

    }


    function number(value) {

        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {

            return "--";

        }

        return Number(value)
            .toLocaleString("th-TH");

    }


    function setVerifiedStatus(
        text,
        good = true
    ) {

        document
            .querySelectorAll(
                ".verified-data"
            )
            .forEach(function (el) {

                el.textContent = text;

                el.style.color =
                    good
                        ? "#4cff70"
                        : "#ffb53d";

            });

    }


    /* =====================================================
       แสดง Dashboard
    ===================================================== */

    function render(data, source) {

        const populationTotal =
            data.population_total ??
            VERIFIED.population.total;

        const male =
            data.population_male ??
            VERIFIED.population.male;

        const female =
            data.population_female ??
            VERIFIED.population.female;

        const households =
            data.households_total ??
            VERIFIED.households.total;

        const elderly =
            data.elderly_60_plus ??
            VERIFIED.survey.elderly60Plus;

        const elderlyPercent =
            data.elderly_percent ??
            VERIFIED.survey.elderlyPercent;

        const disabled =
            data.disabled_total ??
            VERIFIED.survey.disabled;

        const chronic =
            data.chronic_disease_total ??
            VERIFIED.survey.chronicDisease;

        const vulnerable =
            data.vulnerable_selections ??
            VERIFIED.survey.vulnerableSelections;

        const surveyTotal =
            data.survey_total ??
            VERIFIED.survey.total;

        const surveyHouseholds =
            data.survey_households ??
            VERIFIED.survey.households;


        /* -----------------------------
           ประชากร
        ----------------------------- */

        setText(
            "populationTotal",
            number(populationTotal)
        );

        setText(
            "populationMale",
            number(male)
        );

        setText(
            "populationFemale",
            number(female)
        );


        /* -----------------------------
           ครัวเรือน
        ----------------------------- */

        setText(
            "householdTotal",
            number(households)
        );


        /* -----------------------------
           ผู้สูงอายุ
        ----------------------------- */

        setText(
            "elderlyTotal",
            number(elderly)
        );

        setText(
            "elderlyPercent",
            elderlyPercent + "%"
        );


        /* -----------------------------
           กลุ่มเปราะบาง
        ----------------------------- */

        setText(
            "vulnerableTotal",
            number(vulnerable)
        );

        setText(
            "disabledTotal",
            number(disabled)
        );

        setText(
            "chronicTotal",
            number(chronic)
        );


        /* -----------------------------
           แบบสำรวจ
        ----------------------------- */

        setText(
            "surveyTotal",
            number(surveyTotal)
        );

        setText(
            "surveyHouseholds",
            number(surveyHouseholds)
        );


        /* -----------------------------
           สถานะ
        ----------------------------- */

        if (source === "supabase") {

            setVerifiedStatus(
                "🟢 ข้อมูลจากฐานข้อมูลจริง",
                true
            );

        } else {

            setVerifiedStatus(
                "🟡 ข้อมูล VERIFIED DATA BUILD",
                false
            );

        }

    }


    /* =====================================================
       โหลดจาก Supabase
    ===================================================== */

    async function loadFromSupabase() {

        try {

            if (
                typeof supabaseClient ===
                "undefined"
            ) {

                throw new Error(
                    "ไม่พบ supabaseClient"
                );

            }


            /*
             * ใช้ View dashboard_summary
             */

            const result =
                await supabaseClient
                    .from(
                        "dashboard_summary"
                    )
                    .select("*")
                    .limit(1)
                    .maybeSingle();


            if (result.error) {

                throw result.error;

            }


            if (!result.data) {

                throw new Error(
                    "ยังไม่มีข้อมูล dashboard_summary"
                );

            }


            render(
                result.data,
                "supabase"
            );


            console.log(
                "RONGKHEM Dashboard:",
                "โหลดจาก Supabase สำเร็จ"
            );


            return true;

        }
        catch (error) {

            console.warn(
                "โหลด Supabase ไม่สำเร็จ:",
                error.message
            );


            return false;

        }

    }


    /* =====================================================
       โหลด VERIFIED DATA
    ===================================================== */

    function loadVerifiedFallback() {

        render(
            {
                population_total:
                    VERIFIED.population.total,

                population_male:
                    VERIFIED.population.male,

                population_female:
                    VERIFIED.population.female,

                households_total:
                    VERIFIED.households.total,

                survey_total:
                    VERIFIED.survey.total,

                survey_households:
                    VERIFIED.survey.households,

                elderly_60_plus:
                    VERIFIED.survey.elderly60Plus,

                elderly_percent:
                    VERIFIED.survey.elderlyPercent,

                disabled_total:
                    VERIFIED.survey.disabled,

                chronic_disease_total:
                    VERIFIED.survey.chronicDisease,

                vulnerable_selections:
                    VERIFIED.survey.vulnerableSelections

            },
            "verified"
        );

    }


    /* =====================================================
       เริ่มระบบ
    ===================================================== */

    async function initDashboardData() {

        /*
         * รอ DOM
         */

        if (
            document.readyState ===
            "loading"
        ) {

            await new Promise(
                resolve => {

                    document.addEventListener(
                        "DOMContentLoaded",
                        resolve,
                        {
                            once: true
                        }
                    );

                }
            );

        }


        /*
         * พยายามโหลดฐานข้อมูลจริง
         */

        const success =
            await loadFromSupabase();


        /*
         * ถ้าไม่ได้ → ใช้ VERIFIED
         */

        if (!success) {

            loadVerifiedFallback();

        }

    }


    /* =====================================================
       เปิดให้ไฟล์อื่นเรียกได้
    ===================================================== */

    window.RONGKHEM_DASHBOARD = {

        reload:
            initDashboardData,

        verified:
            VERIFIED

    };


    /* =====================================================
       RUN
    ===================================================== */

    initDashboardData();

})();
