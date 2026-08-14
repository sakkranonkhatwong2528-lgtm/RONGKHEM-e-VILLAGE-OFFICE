/* ============================================================
   RONGKHEM e-VILLAGE
   DATA LOADER
   --------------------------------
   หน้าที่:
   1. โหลดข้อมูลจากไฟล์ JSON จริง
   2. ไม่สร้างข้อมูลปลอม
   3. ถ้าไม่มีไฟล์/ข้อมูล ให้คืนค่าเป็น []
   4. รองรับการต่อ Supabase ภายหลัง
============================================================ */

const RONGKHEM_DATA = {

    /* --------------------------------------------------------
       รายชื่อไฟล์ข้อมูลหลัก
    -------------------------------------------------------- */

    files: {

        village:
            "data/village.json",

        community:
            "data/community.json",

        citizen:
            "data/citizen.json",

        household:
            "data/household.json",

        elderly:
            "data/elderly.json",

        vulnerable:
            "data/vulnerable.json",

        health:
            "data/health.json",

        leader:
            "data/leader.json",

        news:
            "data/news.json",

        activity:
            "data/activity.json",

        project:
            "data/project.json",

        notification:
            "data/notification.json",

        environment:
            "data/environment.json",

        subnamjam:
            "data/subnamjam.json"

    },


    /* --------------------------------------------------------
       Cache
    -------------------------------------------------------- */

    cache: {},


    /* --------------------------------------------------------
       โหลด JSON
    -------------------------------------------------------- */

    async load(name){

        if(
            this.cache[name]
        ){

            return this.cache[name];

        }


        const path =
            this.files[name];


        if(!path){

            console.warn(
                `ไม่พบการตั้งค่าไฟล์: ${name}`
            );

            return [];

        }


        try{

            const response =
                await fetch(
                    path,
                    {
                        cache:"no-store"
                    }
                );


            if(
                !response.ok
            ){

                throw new Error(
                    `HTTP ${response.status}`
                );

            }


            const json =
                await response.json();


            /*
             * รองรับทั้ง
             *
             * []
             *
             * และ
             *
             * {
             *   data:[]
             * }
             *
             * และ
             *
             * {
             *   citizens:[]
             * }
             */

            let result =
                this.normalize(
                    name,
                    json
                );


            this.cache[name] =
                result;


            return result;

        }
        catch(error){

            console.warn(
                `โหลด ${name}.json ไม่สำเร็จ:`,
                error.message
            );


            this.cache[name] = [];


            return [];

        }

    },


    /* --------------------------------------------------------
       Normalize
    -------------------------------------------------------- */

    normalize(
        name,
        json
    ){

        if(
            Array.isArray(json)
        ){

            return json;

        }


        if(
            json &&
            Array.isArray(
                json.data
            )
        ){

            return json.data;

        }


        const possibleKeys = [

            name,

            `${name}s`,

            "items",

            "records",

            "rows",

            "list"

        ];


        for(
            const key
            of possibleKeys
        ){

            if(
                json &&
                Array.isArray(
                    json[key]
                )
            ){

                return json[key];

            }

        }


        /*
         * กรณี JSON เป็น object
         * แต่เป็นข้อมูลเดี่ยว
         */

        if(
            json &&
            typeof json === "object"
        ){

            return [json];

        }


        return [];

    },


    /* --------------------------------------------------------
       โหลดหลายไฟล์พร้อมกัน
    -------------------------------------------------------- */

    async loadAll(
        names = []
    ){

        const result = {};


        await Promise.all(

            names.map(
                async name => {

                    result[name] =
                        await this.load(
                            name
                        );

                }
            )

        );


        return result;

    },


    /* --------------------------------------------------------
       ล้าง Cache
    -------------------------------------------------------- */

    clearCache(){

        this.cache = {};

    }

};


/* ============================================================
   DATA HELPERS
============================================================ */


/* ------------------------------------------------------------
   จำนวนรายการ
------------------------------------------------------------ */

function dataCount(
    data
){

    if(
        !Array.isArray(data)
    ){

        return 0;

    }


    return data.length;

}


/* ------------------------------------------------------------
   ตัวเลขปลอดภัย
------------------------------------------------------------ */

function safeNumber(
    value
){

    if(
        value === null ||
        value === undefined ||
        value === ""
    ){

        return null;

    }


    const number =
        Number(
            String(value)
            .replaceAll(",","")
        );


    return Number.isFinite(
        number
    )
    ?
    number
    :
    null;

}


/* ------------------------------------------------------------
   format ตัวเลข
------------------------------------------------------------ */

function formatNumber(
    value
){

    const number =
        safeNumber(
            value
        );


    if(
        number === null
    ){

        return "--";

    }


    return number.toLocaleString(
        "th-TH"
    );

}


/* ------------------------------------------------------------
   หาเพศ
------------------------------------------------------------ */

function countGender(
    data,
    gender
){

    if(
        !Array.isArray(data)
    ){

        return 0;

    }


    return data.filter(
        item => {

            const value =
                String(
                    item.gender ??
                    item.sex ??
                    ""
                )
                .trim()
                .toLowerCase();


            return (

                value === gender ||

                value.includes(gender)

            );

        }
    ).length;

}


/* ------------------------------------------------------------
   วันที่
------------------------------------------------------------ */

function formatThaiDate(
    value
){

    if(!value){

        return "--";

    }


    const date =
        new Date(value);


    if(
        Number.isNaN(
            date.getTime()
        )
    ){

        return String(value);

    }


    return date.toLocaleDateString(
        "th-TH",
        {

            year:"numeric",

            month:"long",

            day:"numeric"

        }
    );

}


/* ------------------------------------------------------------
   Escape HTML
------------------------------------------------------------ */

function escapeHTML(
    value
){

    return String(
        value ?? ""
    )

    .replaceAll(
        "&",
        "&amp;"
    )

    .replaceAll(
        "<",
        "&lt;"
    )

    .replaceAll(
        ">",
        "&gt;"
    )

    .replaceAll(
        '"',
        "&quot;"
    )

    .replaceAll(
        "'",
        "&#039;"
    );

}


/* ============================================================
   DASHBOARD DATA
============================================================ */

async function getDashboardData(){

    const data =
        await RONGKHEM_DATA.loadAll([

            "village",

            "community",

            "citizen",

            "household",

            "elderly",

            "vulnerable",

            "health",

            "leader",

            "news",

            "activity",

            "project",

            "notification",

            "environment",

            "subnamjam"

        ]);


    return data;

}


/* ============================================================
   สรุปข้อมูล Dashboard
============================================================ */

function createDashboardSummary(
    data
){

    const citizens =
        data.citizen || [];


    const households =
        data.household || [];


    const elderly =
        data.elderly || [];


    const vulnerable =
        data.vulnerable || [];


    return {

        population:
            citizens.length,

        households:
            households.length,

        elderly:
            elderly.length,

        vulnerable:
            vulnerable.length,

        male:
            countGender(
                citizens,
                "ชาย"
            ),

        female:
            countGender(
                citizens,
                "หญิง"
            ),

        news:
            data.news || [],

        activities:
            data.activity || [],

        projects:
            data.project || [],

        environment:
            data.environment || [],

        village:
            data.village || [],

        community:
            data.community || []

    };

}


/* ============================================================
   GLOBAL
============================================================ */

window.RONGKHEM_DATA =
    RONGKHEM_DATA;


window.getDashboardData =
    getDashboardData;


window.createDashboardSummary =
    createDashboardSummary;


window.formatNumber =
    formatNumber;


window.formatThaiDate =
    formatThaiDate;


window.escapeHTML =
    escapeHTML;


console.log(
    "RONGKHEM e-VILLAGE DATA LOADER พร้อมใช้งาน"
);
