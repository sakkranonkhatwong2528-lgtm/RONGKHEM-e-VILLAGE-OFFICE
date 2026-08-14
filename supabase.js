/* =========================================================
   RONGKHEM e-VILLAGE
   SUPABASE DATABASE ENGINE
   ========================================================= */

(function () {

    "use strict";

    /* -----------------------------------------------------
       ตรวจสอบ Supabase
    ----------------------------------------------------- */

    if (
        typeof supabase === "undefined"
    ) {

        console.error(
            "ไม่พบ Supabase JS Library"
        );

        return;

    }


    /* -----------------------------------------------------
       อ่าน Config
    ----------------------------------------------------- */

    const URL =
        window.SUPABASE_URL ||
        "";

    const KEY =
        window.SUPABASE_KEY ||
        "";


    if (!URL || !KEY) {

        console.warn(
            "ยังไม่ได้ตั้งค่า SUPABASE_URL / SUPABASE_KEY"
        );

    }


    /* -----------------------------------------------------
       Client
    ----------------------------------------------------- */

    const client =
        supabase.createClient(
            URL,
            KEY
        );


    window.supabaseClient =
        client;


    /* =====================================================
       RONGKHEM DATABASE API
       ===================================================== */

    const DB = {


        /* =================================================
           VILLAGE
        ================================================= */

        async getVillage() {

            const result =
                await client
                    .from(
                        "village_settings"
                    )
                    .select("*")
                    .order(
                        "updated_at",
                        {
                            ascending: false
                        }
                    )
                    .limit(1)
                    .maybeSingle();


            if (result.error)
                throw result.error;


            return result.data;

        },


        async updateVillage(data) {

            const current =
                await this.getVillage();


            if (!current) {

                const result =
                    await client
                        .from(
                            "village_settings"
                        )
                        .insert(data)
                        .select()
                        .single();


                if (result.error)
                    throw result.error;


                return result.data;

            }


            const result =
                await client
                    .from(
                        "village_settings"
                    )
                    .update({
                        ...data,
                        updated_at:
                            new Date()
                                .toISOString()
                    })
                    .eq(
                        "id",
                        current.id
                    )
                    .select()
                    .single();


            if (result.error)
                throw result.error;


            return result.data;

        },


        /* =================================================
           STATISTICS
        ================================================= */

        async getStatistics() {

            const result =
                await client
                    .from(
                        "verified_statistics"
                    )
                    .select("*")
                    .order(
                        "updated_at",
                        {
                            ascending: false
                        }
                    )
                    .limit(1)
                    .maybeSingle();


            if (result.error)
                throw result.error;


            return result.data;

        },


        async updateStatistics(data) {

            const current =
                await this.getStatistics();


            const payload = {

                population_total:
                    Number(
                        data.population_total
                    ),

                population_male:
                    Number(
                        data.population_male
                    ),

                population_female:
                    Number(
                        data.population_female
                    ),

                households_total:
                    Number(
                        data.households_total
                    ),

                survey_total:
                    Number(
                        data.survey_total
                    ),

                survey_households:
                    Number(
                        data.survey_households
                    ),

                elderly_60_plus:
                    Number(
                        data.elderly_60_plus
                    ),

                elderly_percent:
                    Number(
                        data.elderly_percent
                    ),

                disabled_total:
                    Number(
                        data.disabled_total
                    ),

                chronic_disease_total:
                    Number(
                        data.chronic_disease_total
                    ),

                vulnerable_selections:
                    Number(
                        data.vulnerable_selections
                    ),

                source:
                    "VERIFIED DATA BUILD",

                verified:
                    true,

                updated_at:
                    new Date()
                        .toISOString()

            };


            if (!current) {

                const result =
                    await client
                        .from(
                            "verified_statistics"
                        )
                        .insert(payload)
                        .select()
                        .single();


                if (result.error)
                    throw result.error;


                return result.data;

            }


            const result =
                await client
                    .from(
                        "verified_statistics"
                    )
                    .update(payload)
                    .eq(
                        "id",
                        current.id
                    )
                    .select()
                    .single();


            if (result.error)
                throw result.error;


            return result.data;

        },


        /* =================================================
           NEWS
        ================================================= */

        async getNews() {

            const result =
                await client
                    .from("news")
                    .select("*")
                    .order(
                        "published_at",
                        {
                            ascending: false
                        }
                    );


            if (result.error)
                throw result.error;


            return result.data || [];

        },


        async addNews(data) {

            const result =
                await client
                    .from("news")
                    .insert({
                        ...data
                    })
                    .select()
                    .single();


            if (result.error)
                throw result.error;


            return result.data;

        },


        async updateNews(
            id,
            data
        ) {

            const result =
                await client
                    .from("news")
                    .update(data)
                    .eq(
                        "id",
                        id
                    )
                    .select()
                    .single();


            if (result.error)
                throw result.error;


            return result.data;

        },


        async deleteNews(id) {

            const result =
                await client
                    .from("news")
                    .delete()
                    .eq(
                        "id",
                        id
                    );


            if (result.error)
                throw result.error;


            return true;

        },


        /* =================================================
           ACTIVITIES
        ================================================= */

        async getActivities() {

            const result =
                await client
                    .from("activities")
                    .select("*")
                    .order(
                        "activity_date",
                        {
                            ascending: true
                        }
                    );


            if (result.error)
                throw result.error;


            return result.data || [];

        },


        async addActivity(data) {

            const result =
                await client
                    .from("activities")
                    .insert(data)
                    .select()
                    .single();


            if (result.error)
                throw result.error;


            return result.data;

        },


        async updateActivity(
            id,
            data
        ) {

            const result =
                await client
                    .from("activities")
                    .update(data)
                    .eq(
                        "id",
                        id
                    )
                    .select()
                    .single();


            if (result.error)
                throw result.error;


            return result.data;

        },


        async deleteActivity(id) {

            const result =
                await client
                    .from("activities")
                    .delete()
                    .eq(
                        "id",
                        id
                    );


            if (result.error)
                throw result.error;


            return true;

        }

    };


    /* =====================================================
       GLOBAL API
    ===================================================== */

    window.RongkhemDB =
        DB;


    console.log(
        "✓ RONGKHEM DATABASE ENGINE READY"
    );

})();
