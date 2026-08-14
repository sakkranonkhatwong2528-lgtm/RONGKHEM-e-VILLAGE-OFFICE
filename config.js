/* =========================================================
   RONGKHEM e-VILLAGE — CENTRAL CONFIGURATION
   ขั้นตอนที่ 1: จุดเชื่อมต่อฐานข้อมูลกลาง
   ========================================================= */

window.RONGKHEM_CONFIG = {

  // ==========================================
  // SUPABASE
  // ==========================================

  SUPABASE_URL:
    "https://YOUR-PROJECT.supabase.co",

  SUPABASE_KEY:
    "YOUR_PUBLISHABLE_OR_ANON_KEY",


  // ==========================================
  // ข้อมูลหมู่บ้าน
  // ==========================================

  village: {

    name:
      "บ้านร่องเข็ม",

    villageNo:
      "หมู่ที่ 6",

    subdistrict:
      "ตำบลจำป่าหวาย",

    district:
      "อำเภอเมืองพะเยา",

    province:
      "จังหวัดพะเยา"

  },


  // ==========================================
  // ระบบ
  // ==========================================

  system: {

    name:
      "RONGKHEM e-VILLAGE",

    title:
      "ที่ทำการผู้ใหญ่บ้านออนไลน์"

  }

};


// ==========================================
// รองรับระบบเดิม
// ==========================================

window.SUPABASE_URL =
  window.RONGKHEM_CONFIG.SUPABASE_URL;

window.SUPABASE_PUBLISHABLE_KEY =
  window.RONGKHEM_CONFIG.SUPABASE_KEY;

window.SUPABASE_KEY =
  window.RONGKHEM_CONFIG.SUPABASE_KEY;


// ==========================================
// ตรวจว่าตั้งค่า Supabase แล้วหรือยัง
// ==========================================

window.RONGKHEM_DB_READY = function () {

  const url =
    window.RONGKHEM_CONFIG.SUPABASE_URL;

  const key =
    window.RONGKHEM_CONFIG.SUPABASE_KEY;

  return Boolean(

    url &&
    key &&

    !url.includes(
      "YOUR-PROJECT"
    ) &&

    !key.includes(
      "YOUR_PUBLISHABLE"
    ) &&

    !key.includes(
      "xxxxxxxx"
    )

  );

};
