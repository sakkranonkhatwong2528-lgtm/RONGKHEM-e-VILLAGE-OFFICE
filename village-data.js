/* =========================================================
   RONGKHEM e-VILLAGE OFFICE
   VILLAGE DATA SYSTEM v1.0
   ระบบข้อมูลกลางสำหรับ เพิ่ม / แก้ไข / ลบ
   ========================================================= */

(function () {
    "use strict";

    const STORAGE_KEY = "RONGKHEM_VILLAGE_DATA_V1";

    /* =====================================================
       ข้อมูลเริ่มต้น
       ===================================================== */

    const DEFAULT_DATA = {

        /* =========================
           ข้อมูลเว็บไซต์
        ========================= */

        site: {
            systemName: "RONGKHEM e-VILLAGE OFFICE",

            title:
                "ที่ทำการผู้ใหญ่บ้านออนไลน์ บ้านร่องเข็ม หมู่ที่ 6",

            address:
                "ตำบลจำป่าหวาย อำเภอเมืองพะเยา จังหวัดพะเยา",

            logo:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuCqrlPYE49MX4zPdFaBV9bMoVC6GxNVfJqP0QURhNeka8cEWq_cvTlbfpluNGHZmfgZ4RrH8QdXEDLyKWYaDFFcO3eD2GzO-ds_kRRXCpIqJc-ycOGcOYbN4njyaiVaQsBWAVN2izFQhnzBg2sX2y7l_lMbZLICOlsbDZatIsrh2Q6h4EXInhx2Fy0N_-ntwf3Vl8KB4LyYUx9OPJOSmZQtwjeVLuo728T0pTOnEmHqOjGhgVGoURT7s9aEquEvinDDCnOSu-HEtSNN6g",

            copyright:
                "© 2026 RONGKHEM e-VILLAGE OFFICE All rights reserved."
        },


        /* =========================
           หน้า Hero
        ========================= */

        hero: {
            image:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuCLmVd7ljjBr0z4XbfzHTwvsU9mt_Kv0DDesm4Bk39DJBSaWN74XD_USS5Sg7yunj_oI4F56Lt-4_DFedI0MCsJUEmOS6rD2I1MU7dlJc3TFONv5niuAkX1xHXJdZgcy7zCGlAjOGBe-plO5Uc2hG9hCXBLYfy6ScpgmRdAoZ6ZSTNhX3fK2xOJ92vyNoMLcF0Qk5IazTp8Y8dqgyVEa1mA6wafpSQUSzHhBILZLm-igfkCKLGwCiZK",

            title:
                "ร่วมสร้าง ร่วมพัฒนา",

            subtitle:
                "บ้านร่องเข็มให้น่าอยู่ อย่างยั่งยืน"
        },


        /* =========================
           ข้อมูลหมู่บ้าน
        ========================= */

        village: {

            name:
                "บ้านร่องเข็ม หมู่ที่ 6",

            subdistrict:
                "ตำบลจำป่าหวาย",

            district:
                "อำเภอเมืองพะเยา",

            province:
                "จังหวัดพะเยา",

            vision:
                "กล้าคิด กล้าทำ กล้านำ กล้าพัฒนา",

            description:
                "ร่วมสร้าง ร่วมพัฒนา บ้านร่องเข็มให้น่าอยู่ อย่างยั่งยืน"
        },


        /* =========================
           ผู้นำหมู่บ้าน
        ========================= */

        leaders: [

            {
                id: 1,

                position:
                    "ผู้ใหญ่บ้าน",

                name:
                    "นายศักรนนท์ ขัติย์วงค์",

                role:
                    "ผู้ใหญ่บ้าน หมู่ที่ 6",

                description:
                    "ดูแลการบริหารงานทั่วไปและประสานงานการพัฒนาหมู่บ้าน",

                phone:
                    "080-120-2529",

                image:
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuBRrrT5yWWoaG0Qnprcf-CU9A0JDlUpATd7hDoBbE-2MbFwRj5QxaTXHtTZUnppoviRE9FniyZMh7t6F_zKWeqzmjESsirls_qsXy8Ci3lxottc512PUbMcgGpGlDeSqKghZauar8IihQ5eZ0iTpvzxFDkeywNz82mSi7-kLJ0XeUy-mqsfgxw_aE3ppPpGt6rQJrqWdhYYOIf6JWPVBPHxyMTHNsz7YIBFxlmSuIJJGcvnWOcDUa9vf_Znn5iyRW_5iHfhjrTqjhqSTw"
            },

            {
                id: 2,

                position:
                    "ผู้ช่วยผู้ใหญ่บ้าน คนที่ 1",

                name:
                    "นายจักร์กวัส ประพลรัตนัง",

                role:
                    "ผู้ช่วยผู้ใหญ่บ้าน หมู่ที่ 6",

                description:
                    "ฝ่ายปกครองและรักษาความสงบเรียบร้อย",

                phone:
                    "085-139-9849",

                image:
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuDKb24U5PhLNgLK9I3GQSLTRf9pa_GQm0WsMwWdBc6axXWG5IHGHuNNYZQIsVmhy_DyKLJQzdr3yx6RrntV0TU3qmhn3yKyi4P0rLNwzJJdQMBTB6XrpngcNf85hhf1bPjMRkpJEOPW8DBobPj7h-HLUauPRpBR2B2AO_XyqSrzGVOuhZ5tP-1NbYz44QM1FMQYnmPgMqSqOr6clbI_4r4Zz-uk0iXrMYOlqMdBhbaFX81jEpquz13m0OscWCDKFD447g1U-goToyQzIA"
            },

            {
                id: 3,

                position:
                    "ผู้ช่วยผู้ใหญ่บ้าน คนที่ 2",

                name:
                    "น.ส. สุภาพร วังมูล",

                role:
                    "ผู้ช่วยผู้ใหญ่บ้าน หมู่ที่ 6",

                description:
                    "ฝ่ายปกครองและประสานงานชุมชน",

                phone:
                    "098-980-0089",

                image:
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuAeXcullg08r4-Wh_ob59hbrDZqq5U9jlhhsa1BTFc6oo9IfRNpS1tBgSNKZW4gCSZpI4zzrHxIwdVhKOXtS37giizoKW-5gN-5Gvl1RrMeOBDchIfM092dKdLvSGYkeXPlsaetEOXLFy6_BBt7Sgi2qmrGmopTD91AFsf1WxlvcD-65uWIi2vMFMvLqEmze-m_rZxhSK24NU_9_NOsQUeqDUUyeDa0msfsj0G0C79pRmzdlEx7k1QGvg6t-BxReZUtNG2onu3MTZAtXg"
            }
        ],


        /* =========================
           กิจกรรม
        ========================= */

        activities: [

            {
                id: 1,

                title:
                    "โครงการชุมชนตำบลยั่งยืน",

                date:
                    "15 พฤษภาคม 2569",

                location:
                    "ณ ศาลาประชาคมหมู่บ้าน",

                people:
                    "65 คน",

                image:
                    ""
            },

            {
                id: 2,

                title:
                    "ประชุมประชาคมหมู่บ้าน ครั้งที่ 3/2569",

                date:
                    "10 พฤษภาคม 2569",

                location:
                    "ณ ศาลาประชาคมหมู่บ้าน",

                people:
                    "78 คน",

                image:
                    ""
            },

            {
                id: 3,

                title:
                    "Big Cleaning Day",

                date:
                    "5 พฤษภาคม 2569",

                location:
                    "ณ บริเวณหมู่บ้าน",

                people:
                    "120 คน",

                image:
                    ""
            },

            {
                id: 4,

                title:
                    "โครงการปลูกต้นไม้เพิ่มพื้นที่สีเขียว",

                date:
                    "1 พฤษภาคม 2569",

                location:
                    "ณ ป่าชุมชนบ้านร่องเข็ม",

                people:
                    "45 คน",

                image:
                    ""
            }
        ],


        /* =========================
           ข่าวสาร / ประกาศ
        ========================= */

        news: [

            {
                id: 1,

                date:
                    "14 พ.ค. 69",

                title:
                    "ประกาศการจัดเก็บภาษีที่ดินและสิ่งปลูกสร้าง ประจำปี 2569",

                status:
                    "ใหม่",

                content:
                    ""
            },

            {
                id: 2,

                date:
                    "10 พ.ค. 69",

                title:
                    "ประชุมประชาคมหมู่บ้าน ครั้งที่ 3/2569",

                status:
                    "ใหม่",

                content:
                    ""
            },

            {
                id: 3,

                date:
                    "5 พ.ค. 69",

                title:
                    "เชิญร่วมกิจกรรม Big Cleaning Day",

                status:
                    "ใหม่",

                content:
                    ""
            },

            {
                id: 4,

                date:
                    "1 พ.ค. 69",

                title:
                    "ประกาศรับสมัครอาสาสมัครสาธารณสุขประจำหมู่บ้าน",

                status:
                    "",

                content:
                    ""
            }
        ],


        /* =========================
           บริการประชาชน
        ========================= */

        services: [

            {
                id: 1,
                icon: "fa-triangle-exclamation",
                title: "แจ้งเหตุ / ร้องเรียน",
                link: "complaint.html"
            },

            {
                id: 2,
                icon: "fa-file-lines",
                title: "แบบฟอร์มออนไลน์",
                link: "service.html"
            },

            {
                id: 3,
                icon: "fa-comments",
                title: "ถาม-ตอบ (Q&A)",
                link: "service.html"
            },

            {
                id: 4,
                icon: "fa-phone",
                title: "เบอร์โทรศัพท์สำคัญ",
                link: "service.html"
            },

            {
                id: 5,
                icon: "fa-map-location-dot",
                title: "แผนที่หมู่บ้าน",
                link: "community.html"
            }
        ],


        /* =========================
           สถิติหมู่บ้าน
        ========================= */

        statistics: {

            updated:
                "15 พฤษภาคม 2569",

            population: {
                value: 1247,
                label: "ประชากรรวม",
                unit: "คน"
            },

            households: {
                value: 352,
                label: "ครัวเรือนทั้งหมด",
                unit: "ครัวเรือน"
            },

            male: {
                value: 0,
                label: "ชาย",
                unit: "คน"
            },

            female: {
                value: 0,
                label: "หญิง",
                unit: "คน"
            },

            children: {
                value: 86,
                label: "เด็ก (0-5 ปี)",
                unit: "คน"
            },

            elderly: {
                value: 210,
                label: "ผู้สูงอายุ (60 ปีขึ้นไป)",
                unit: "คน"
            },

            disabled: {
                value: 18,
                label: "ผู้พิการ",
                unit: "คน"
            },

            vulnerable: {
                value: 23,
                label: "กลุ่มเปราะบาง",
                unit: "ครัวเรือน"
            },

            bedridden: {
                value: 0,
                label: "ผู้ป่วยติดเตียง",
                unit: "คน"
            }
        },


        /* =========================
           ข้อมูลติดต่อ
        ========================= */

        contact: {

            headman:
                "นายศักรนนท์ ขัติย์วงค์",

            position:
                "ผู้ใหญ่บ้าน หมู่ที่ 6",

            phone:
                "080-120-2529",

            line:
                "",

            facebook:
                "",

            email:
                ""
        },


        /* =========================
           รูปกิจกรรม
        ========================= */

        gallery: []
    };


    /* =====================================================
       โหลดข้อมูล
       ===================================================== */

    function loadData() {

        try {

            const saved =
                localStorage.getItem(STORAGE_KEY);

            if (saved) {

                return JSON.parse(saved);

            }

        } catch (error) {

            console.error(
                "ไม่สามารถโหลดข้อมูลหมู่บ้านได้",
                error
            );

        }

        return JSON.parse(
            JSON.stringify(DEFAULT_DATA)
        );
    }


    /* =====================================================
       บันทึกข้อมูล
       ===================================================== */

    function saveData(data) {

        try {

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(data)
            );

            return true;

        } catch (error) {

            console.error(
                "ไม่สามารถบันทึกข้อมูลได้",
                error
            );

            return false;

        }
    }


    /* =====================================================
       รีเซ็ตข้อมูล
       ===================================================== */

    function resetData() {

        const data =
            JSON.parse(
                JSON.stringify(DEFAULT_DATA)
            );

        saveData(data);

        return data;
    }


    /* =====================================================
       สร้าง ID ใหม่
       ===================================================== */

    function generateId(list) {

        if (!Array.isArray(list) ||
            list.length === 0) {

            return 1;
        }

        return Math.max(
            ...list.map(
                item =>
                    Number(item.id) || 0
            )
        ) + 1;
    }


    /* =====================================================
       เพิ่มข้อมูล
       ===================================================== */

    function addItem(
        collectionName,
        item
    ) {

        const data =
            loadData();

        if (!Array.isArray(
            data[collectionName]
        )) {

            throw new Error(
                "ไม่พบชุดข้อมูล: " +
                collectionName
            );
        }

        const newItem = {
            ...item,
            id: generateId(
                data[collectionName]
            )
        };

        data[collectionName].push(
            newItem
        );

        saveData(data);

        return newItem;
    }


    /* =====================================================
       แก้ไขข้อมูล
       ===================================================== */

    function updateItem(
        collectionName,
        id,
        newData
    ) {

        const data =
            loadData();

        const list =
            data[collectionName];

        if (!Array.isArray(list)) {

            throw new Error(
                "ไม่พบชุดข้อมูล: " +
                collectionName
            );
        }

        const index =
            list.findIndex(
                item =>
                    String(item.id) ===
                    String(id)
            );

        if (index === -1) {

            throw new Error(
                "ไม่พบข้อมูล ID: " + id
            );
        }

        list[index] = {

            ...list[index],

            ...newData,

            id: list[index].id
        };

        saveData(data);

        return list[index];
    }


    /* =====================================================
       ลบข้อมูล
       ===================================================== */

    function deleteItem(
        collectionName,
        id
    ) {

        const data =
            loadData();

        const list =
            data[collectionName];

        if (!Array.isArray(list)) {

            throw new Error(
                "ไม่พบชุดข้อมูล: " +
                collectionName
            );
        }

        const index =
            list.findIndex(
                item =>
                    String(item.id) ===
                    String(id)
            );

        if (index === -1) {

            return false;
        }

        list.splice(
            index,
            1
        );

        saveData(data);

        return true;
    }


    /* =====================================================
       แก้ไขข้อมูลทั่วไป
       ===================================================== */

    function updateSection(
        sectionName,
        newData
    ) {

        const data =
            loadData();

        data[sectionName] = {

            ...data[sectionName],

            ...newData
        };

        saveData(data);

        return data[sectionName];
    }


    /* =====================================================
       ค้นหาบ้านเลขที่ / ประชาชน
       สำหรับรองรับข้อมูลจริงในอนาคต
       ===================================================== */

    function searchCitizen(keyword) {

        const data =
            loadData();

        if (!Array.isArray(
            data.citizens
        )) {

            return [];
        }

        const query =
            String(keyword || "")
                .trim()
                .toLowerCase();

        if (!query) {

            return [];
        }

        return data.citizens.filter(
            person => {

                return [

                    person.houseNumber,

                    person.name,

                    person.idCard

                ]
                    .filter(Boolean)
                    .some(
                        value =>
                            String(value)
                                .toLowerCase()
                                .includes(query)
                    );

            }
        );
    }


    /* =====================================================
       เพิ่มข้อมูลประชาชนในอนาคต
       ===================================================== */

    function addCitizen(person) {

        const data =
            loadData();

        if (!Array.isArray(
            data.citizens
        )) {

            data.citizens = [];
        }

        const citizen = {

            id:
                generateId(
                    data.citizens
                ),

            houseNumber:
                "",

            name:
                "",

            gender:
                "",

            age:
                0,

            ...person
        };

        data.citizens.push(
            citizen
        );

        saveData(data);

        return citizen;
    }


    /* =====================================================
       Export ข้อมูลสำรอง
       ===================================================== */

    function exportData() {

        const data =
            loadData();

        return JSON.stringify(
            data,
            null,
            2
        );
    }


    /* =====================================================
       Import ข้อมูลสำรอง
       ===================================================== */

    function importData(jsonText) {

        try {

            const data =
                JSON.parse(jsonText);

            saveData(data);

            return true;

        } catch (error) {

            console.error(
                "ไฟล์ข้อมูลไม่ถูกต้อง",
                error
            );

            return false;
        }
    }


    /* =====================================================
       เปิดใช้งานระบบ
       ===================================================== */

    window.RongkhemData = {

        load:
            loadData,

        save:
            saveData,

        reset:
            resetData,

        add:
            addItem,

        update:
            updateItem,

        delete:
            deleteItem,

        updateSection:
            updateSection,

        searchCitizen:
            searchCitizen,

        addCitizen:
            addCitizen,

        export:
            exportData,

        import:
            importData,

        defaults:
            DEFAULT_DATA
    };


    /* =====================================================
       สร้างข้อมูลครั้งแรก
       ===================================================== */

    if (
        !localStorage.getItem(
            STORAGE_KEY
        )
    ) {

        saveData(
            JSON.parse(
                JSON.stringify(
                    DEFAULT_DATA
                )
            )
        );
    }

})();
