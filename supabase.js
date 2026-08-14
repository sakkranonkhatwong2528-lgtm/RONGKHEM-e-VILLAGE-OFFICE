/* =========================================================
   RONGKHEM e-VILLAGE
   SUPABASE DATABASE CORE
   ที่ทำการผู้ใหญ่บ้านออนไลน์
   ========================================================= */


/* =========================================================
   1. SUPABASE CONFIG
   ========================================================= */

/*
   ให้นำค่าจริงจาก

   Supabase Dashboard
   → Project Settings
   → API

   มาใส่ตรงนี้
*/

const SUPABASE_URL =
    "ใส่_URL_SUPABASE_ของคุณ";

const SUPABASE_KEY =
    "ใส่_ANON_KEY_ของคุณ";


/* =========================================================
   2. CREATE CLIENT
   ========================================================= */

const supabaseClient =
    supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


/* =========================================================
   3. SYSTEM CONFIG
   ========================================================= */

const RONGKHEM_CONFIG = {

    villageName:
        "บ้านร่องเข็ม",

    villageNo:
        "หมู่ที่ 6",

    subdistrict:
        "ตำบลจำป่าหวาย",

    district:
        "อำเภอเมืองพะเยา",

    province:
        "จังหวัดพะเยา",

    systemName:
        "RONGKHEM e-VILLAGE",

    systemTitle:
        "ที่ทำการผู้ใหญ่บ้านออนไลน์"

};


/* =========================================================
   4. DATABASE TABLES
   ========================================================= */

const TABLES = {

    citizens:
        "citizens",

    households:
        "households",

    leaders:
        "leaders",

    news:
        "news",

    activities:
        "activities",

    incidents:
        "incidents",

    services:
        "services",

    projects:
        "projects",

    environment:
        "environment",

    wetland:
        "wetland",

    riceMembers:
        "rice_members",

    riceFunerals:
        "rice_funerals",

    riceStock:
        "rice_stock",

    statistics:
        "statistics",

    notifications:
        "notifications",

    systemLogs:
        "system_logs"

};


/* =========================================================
   5. GENERIC GET
   ========================================================= */

async function dbGet(
    table,
    options = {}
){

    try{

        let query =
            supabaseClient
                .from(table)
                .select(
                    options.select || "*"
                );


        if(
            options.order
        ){

            query =
                query.order(
                    options.order.column,
                    {
                        ascending:
                            options.order.ascending ??
                            false
                    }
                );

        }


        if(
            options.limit
        ){

            query =
                query.limit(
                    options.limit
                );

        }


        if(
            options.eq
        ){

            Object.entries(
                options.eq
            ).forEach(
                ([column,value]) => {

                    query =
                        query.eq(
                            column,
                            value
                        );

                }
            );

        }


        const {
            data,
            error
        } = await query;


        if(error)
            throw error;


        return {

            success:true,

            data:data || [],

            error:null

        };

    }
    catch(error){

        console.error(
            "dbGet Error:",
            error
        );

        return {

            success:false,

            data:[],

            error:error

        };

    }

}


/* =========================================================
   6. GET ONE
   ========================================================= */

async function dbGetOne(
    table,
    column,
    value
){

    try{

        const {
            data,
            error
        } = await
        supabaseClient
            .from(table)
            .select("*")
            .eq(
                column,
                value
            )
            .maybeSingle();


        if(error)
            throw error;


        return {

            success:true,

            data:data,

            error:null

        };

    }
    catch(error){

        console.error(
            "dbGetOne Error:",
            error
        );

        return {

            success:false,

            data:null,

            error:error

        };

    }

}


/* =========================================================
   7. INSERT
   ========================================================= */

async function dbInsert(
    table,
    payload
){

    try{

        const {
            data,
            error
        } = await
        supabaseClient
            .from(table)
            .insert(
                payload
            )
            .select();


        if(error)
            throw error;


        return {

            success:true,

            data:data || [],

            error:null

        };

    }
    catch(error){

        console.error(
            "dbInsert Error:",
            error
        );

        return {

            success:false,

            data:[],

            error:error

        };

    }

}


/* =========================================================
   8. UPDATE
   ========================================================= */

async function dbUpdate(
    table,
    id,
    payload
){

    try{

        const {
            data,
            error
        } = await
        supabaseClient
            .from(table)
            .update(
                payload
            )
            .eq(
                "id",
                id
            )
            .select();


        if(error)
            throw error;


        return {

            success:true,

            data:data || [],

            error:null

        };

    }
    catch(error){

        console.error(
            "dbUpdate Error:",
            error
        );

        return {

            success:false,

            data:[],

            error:error

        };

    }

}


/* =========================================================
   9. DELETE
   ========================================================= */

async function dbDelete(
    table,
    id
){

    try{

        const {
            error
        } = await
        supabaseClient
            .from(table)
            .delete()
            .eq(
                "id",
                id
            );


        if(error)
            throw error;


        return {

            success:true,

            error:null

        };

    }
    catch(error){

        console.error(
            "dbDelete Error:",
            error
        );

        return {

            success:false,

            error:error

        };

    }

}


/* =========================================================
   10. COUNT
   ========================================================= */

async function dbCount(
    table
){

    try{

        const {
            count,
            error
        } = await
        supabaseClient
            .from(table)
            .select(
                "*",
                {
                    count:"exact",
                    head:true
                }
            );


        if(error)
            throw error;


        return {

            success:true,

            count:
                count || 0,

            error:null

        };

    }
    catch(error){

        console.error(
            "dbCount Error:",
            error
        );

        return {

            success:false,

            count:0,

            error:error

        };

    }

}


/* =========================================================
   11. DASHBOARD DATA
   ========================================================= */

async function getDashboardData(){

    try{

        const [

            citizens,
            households,
            leaders,
            news,
            projects,
            incidents,
            riceMembers

        ] = await Promise.all([

            dbCount(
                TABLES.citizens
            ),

            dbCount(
                TABLES.households
            ),

            dbCount(
                TABLES.leaders
            ),

            dbCount(
                TABLES.news
            ),

            dbCount(
                TABLES.projects
            ),

            dbCount(
                TABLES.incidents
            ),

            dbCount(
                TABLES.riceMembers
            )

        ]);


        return {

            success:true,

            data:{

                citizens:
                    citizens.count,

                households:
                    households.count,

                leaders:
                    leaders.count,

                news:
                    news.count,

                projects:
                    projects.count,

                incidents:
                    incidents.count,

                riceMembers:
                    riceMembers.count

            }

        };

    }
    catch(error){

        console.error(
            "Dashboard Error:",
            error
        );

        return {

            success:false,

            data:null,

            error:error

        };

    }

}


/* =========================================================
   12. CITIZENS
   ========================================================= */

async function getCitizens(){

    return await dbGet(
        TABLES.citizens,
        {
            order:{
                column:"created_at",
                ascending:false
            }
        }
    );

}


async function addCitizen(
    citizen
){

    return await dbInsert(
        TABLES.citizens,
        citizen
    );

}


async function updateCitizen(
    id,
    citizen
){

    return await dbUpdate(
        TABLES.citizens,
        id,
        citizen
    );

}


async function deleteCitizen(
    id
){

    return await dbDelete(
        TABLES.citizens,
        id
    );

}


/* =========================================================
   13. HOUSEHOLDS
   ========================================================= */

async function getHouseholds(){

    return await dbGet(
        TABLES.households,
        {
            order:{
                column:"house_number",
                ascending:true
            }
        }
    );

}


async function addHousehold(
    household
){

    return await dbInsert(
        TABLES.households,
        household
    );

}


async function updateHousehold(
    id,
    household
){

    return await dbUpdate(
        TABLES.households,
        id,
        household
    );

}


/* =========================================================
   14. LEADERS
   ========================================================= */

async function getLeaders(){

    return await dbGet(
        TABLES.leaders,
        {
            order:{
                column:"created_at",
                ascending:false
            }
        }
    );

}


async function addLeader(
    leader
){

    return await dbInsert(
        TABLES.leaders,
        leader
    );

}


async function updateLeader(
    id,
    leader
){

    return await dbUpdate(
        TABLES.leaders,
        id,
        leader
    );

}


/* =========================================================
   15. NEWS
   ========================================================= */

async function getNews(){

    return await dbGet(
        TABLES.news,
        {
            order:{
                column:"created_at",
                ascending:false
            }
        }
    );

}


async function addNews(
    news
){

    return await dbInsert(
        TABLES.news,
        news
    );

}


async function updateNews(
    id,
    news
){

    return await dbUpdate(
        TABLES.news,
        id,
        news
    );

}


async function deleteNews(
    id
){

    return await dbDelete(
        TABLES.news,
        id
    );

}


/* =========================================================
   16. ACTIVITIES
   ========================================================= */

async function getActivities(){

    return await dbGet(
        TABLES.activities,
        {
            order:{
                column:"activity_date",
                ascending:true
            }
        }
    );

}


async function addActivity(
    activity
){

    return await dbInsert(
        TABLES.activities,
        activity
    );

}


/* =========================================================
   17. INCIDENTS
   ========================================================= */

async function getIncidents(){

    return await dbGet(
        TABLES.incidents,
        {
            order:{
                column:"created_at",
                ascending:false
            }
        }
    );

}


async function addIncident(
    incident
){

    return await dbInsert(
        TABLES.incidents,
        incident
    );

}


async function updateIncident(
    id,
    incident
){

    return await dbUpdate(
        TABLES.incidents,
        id,
        incident
    );

}


/* =========================================================
   18. PROJECTS
   ========================================================= */

async function getProjects(){

    return await dbGet(
        TABLES.projects,
        {
            order:{
                column:"created_at",
                ascending:false
            }
        }
    );

}


async function addProject(
    project
){

    return await dbInsert(
        TABLES.projects,
        project
    );

}


async function updateProject(
    id,
    project
){

    return await dbUpdate(
        TABLES.projects,
        id,
        project
    );

}


/* =========================================================
   19. ENVIRONMENT
   ========================================================= */

async function getEnvironment(){

    return await dbGet(
        TABLES.environment,
        {
            order:{
                column:"recorded_at",
                ascending:false
            },
            limit:20
        }
    );

}


async function addEnvironment(
    data
){

    return await dbInsert(
        TABLES.environment,
        data
    );

}


/* =========================================================
   20. WETLAND
   ========================================================= */

async function getWetland(){

    return await dbGet(
        TABLES.wetland,
        {
            order:{
                column:"recorded_at",
                ascending:false
            },
            limit:20
        }
    );

}


async function addWetland(
    data
){

    return await dbInsert(
        TABLES.wetland,
        data
    );

}


/* =========================================================
   21. RICE MEMBERS
   ========================================================= */

async function getRiceMembers(){

    return await dbGet(
        TABLES.riceMembers,
        {
            order:{
                column:"created_at",
                ascending:false
            }
        }
    );

}


async function addRiceMember(
    member
){

    return await dbInsert(
        TABLES.riceMembers,
        member
    );

}


async function updateRiceMember(
    id,
    member
){

    return await dbUpdate(
        TABLES.riceMembers,
        id,
        member
    );

}


async function deleteRiceMember(
    id
){

    return await dbDelete(
        TABLES.riceMembers,
        id
    );

}


/* =========================================================
   22. RICE FUNERALS
   ========================================================= */

async function getRiceFunerals(){

    return await dbGet(
        TABLES.riceFunerals,
        {
            order:{
                column:"funeral_date",
                ascending:false
            }
        }
    );

}


async function addRiceFuneral(
    funeral
){

    return await dbInsert(
        TABLES.riceFunerals,
        funeral
    );

}


/* =========================================================
   23. RICE STOCK
   ========================================================= */

async function getRiceStock(){

    return await dbGet(
        TABLES.riceStock,
        {
            order:{
                column:"created_at",
                ascending:false
            },
            limit:1
        }
    );

}


async function addRiceStock(
    stock
){

    return await dbInsert(
        TABLES.riceStock,
        stock
    );

}


/* =========================================================
   24. STATISTICS
   ========================================================= */

async function getStatistics(){

    return await dbGet(
        TABLES.statistics,
        {
            order:{
                column:"created_at",
                ascending:false
            }
        }
    );

}


/* =========================================================
   25. NOTIFICATIONS
   ========================================================= */

async function getNotifications(){

    return await dbGet(
        TABLES.notifications,
        {
            order:{
                column:"created_at",
                ascending:false
            },
            limit:30
        }
    );

}


async function addNotification(
    notification
){

    return await dbInsert(
        TABLES.notifications,
        notification
    );

}


/* =========================================================
   26. SYSTEM LOG
   ========================================================= */

async function writeLog(
    action,
    description
){

    return await dbInsert(

        TABLES.systemLogs,

        {

            action:
                action,

            description:
                description,

            created_at:
                new Date().toISOString()

        }

    );

}


/* =========================================================
   27. REALTIME
   ========================================================= */

function subscribeTable(
    table,
    callback
){

    return supabaseClient

        .channel(
            "rongkhem-" +
            table
        )

        .on(

            "postgres_changes",

            {
                event:"*",

                schema:"public",

                table:table

            },

            payload => {

                console.log(
                    "Realtime:",
                    table,
                    payload
                );

                if(
                    typeof callback ===
                    "function"
                ){

                    callback(
                        payload
                    );

                }

            }

        )

        .subscribe();

}


/* =========================================================
   28. CONNECTION TEST
   ========================================================= */

async function testDatabase(){

    try{

        const {
            error
        } = await
        supabaseClient
            .from(
                TABLES.citizens
            )
            .select(
                "id"
            )
            .limit(1);


        if(error)
            throw error;


        return {

            success:true,

            message:
                "เชื่อมต่อฐานข้อมูลสำเร็จ"

        };

    }
    catch(error){

        console.error(
            "Database connection error:",
            error
        );

        return {

            success:false,

            message:
                "ไม่สามารถเชื่อมต่อฐานข้อมูล",

            error:error

        };

    }

}


/* =========================================================
   29. GLOBAL HELPER
   ========================================================= */

function formatThaiDate(
    date
){

    if(!date)
        return "-";


    const d =
        new Date(date);


    return d.toLocaleDateString(
        "th-TH",
        {

            day:"numeric",

            month:"long",

            year:"numeric"

        }
    );

}


function formatThaiDateTime(
    date
){

    if(!date)
        return "-";


    const d =
        new Date(date);


    return d.toLocaleString(
        "th-TH",
        {

            dateStyle:"medium",

            timeStyle:"short"

        }
    );

}


/* =========================================================
   30. INITIALIZE
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    async function(){

        console.log(
            "================================="
        );

        console.log(
            "RONGKHEM e-VILLAGE"
        );

        console.log(
            "Database Core Loaded"
        );

        console.log(
            "================================="
        );


        if(
            SUPABASE_URL.includes(
                "ใส่_URL"
            )
        ){

            console.warn(
                "กรุณาใส่ SUPABASE_URL"
            );

            return;

        }


        const result =
            await testDatabase();


        if(
            result.success
        ){

            console.log(
                "🟢",
                result.message
            );

        }else{

            console.error(
                "🔴",
                result.message
            );

        }

    }
);
