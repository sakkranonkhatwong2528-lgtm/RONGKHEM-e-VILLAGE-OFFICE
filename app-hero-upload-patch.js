/* =====================================================
   HERO IMAGE UPLOAD
   หมู่บ้านกองทุนแม่ของแผ่นดิน
   ===================================================== */

const HERO_IMAGE_KEY = "RONGKHEM_HERO_IMAGE";


/* =====================================================
   เปิดหน้าต่างเลือกภาพ
   ===================================================== */

window.openHeroUpload = function () {

    const input =
        document.createElement("input");

    input.type = "file";

    input.accept = "image/*";


    input.onchange = function () {

        const file =
            input.files &&
            input.files[0];


        if (!file) {
            return;
        }


        /* ตรวจสอบว่าเป็นรูปภาพ */

        if (!file.type.startsWith("image/")) {

            alert(
                "กรุณาเลือกไฟล์รูปภาพ"
            );

            return;
        }


        /* จำกัดขนาด 10 MB */

        if (file.size > 10 * 1024 * 1024) {

            alert(
                "รูปภาพต้องมีขนาดไม่เกิน 10 MB"
            );

            return;
        }


        const reader =
            new FileReader();


        reader.onload =
            function (event) {

                const image =
                    event.target.result;


                /* บันทึกรูปไว้ในเครื่อง */

                localStorage.setItem(
                    HERO_IMAGE_KEY,
                    image
                );


                /* เปลี่ยนรูปทันที */

                applyHeroImage(
                    image
                );


                alert(
                    "เปลี่ยนรูปภาพเรียบร้อยแล้ว"
                );

            };


        reader.readAsDataURL(file);

    };


    input.click();

};


/* =====================================================
   แสดงรูปที่เลือก
   ===================================================== */

function applyHeroImage(image) {

    const hero =
        document.getElementById(
            "heroBanner"
        );


    if (!hero) {
        return;
    }


    hero.style.backgroundImage =
        `url("${image}")`;


    hero.style.backgroundSize =
        "cover";


    hero.style.backgroundPosition =
        "center";


    hero.style.backgroundRepeat =
        "no-repeat";

}


/* =====================================================
   โหลดรูปที่เคยเลือกไว้
   ===================================================== */

function loadHeroImage() {

    const image =
        localStorage.getItem(
            HERO_IMAGE_KEY
        );


    if (!image) {
        return;
    }


    applyHeroImage(
        image
    );

}


/* =====================================================
   ทำงานเมื่อเปิดเว็บไซต์
   ===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadHeroImage();

    }
);
