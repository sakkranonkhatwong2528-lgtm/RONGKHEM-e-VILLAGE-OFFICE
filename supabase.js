import supabaseClient from "./supabase-config.js";

// ========================================
// กำหนดโครงสร้างระบบหลังบ้าน
// ชื่อ module ต้องตรงกับ value ใน manage.html
// ========================================

const MODULES = {

  // ข่าวสาร
  news: {
    table: "news",
    fields: [
      "title",
      "content",
      "image_url",
      "published_at"
    ]
  },

  // กิจกรรม
  activity: {
    table: "activities",
    fields: [
      "title",
      "description",
      "image_url",
      "event_date"
    ]
  },

  // โครงการ
  project: {
    table: "projects",
    fields: [
      "title",
      "description",
      "status",
      "image_url"
    ]
  },

  // เหตุการณ์
  incident: {
    table: "incidents",
    fields: [
      "title",
      "description",
      "status",
      "incident_date"
    ]
  },

  // เรื่องร้องเรียน
  complaint: {
    table: "complaints",
    fields: [
      "title",
      "detail",
      "status",
      "created_at"
    ]
  },

  // ผู้สูงอายุ
  elderly: {
    table: "elderly",
    fields: [
      "title",
      "description",
      "image_url"
    ]
  },

  // กลุ่มเปราะบาง
  vulnerable: {
    table: "vulnerable",
    fields: [
      "title",
      "description",
      "image_url"
    ]
  }

};


// ========================================
// ตรวจสอบโมดูล
// ========================================

function getModule(moduleName) {

  const module = MODULES[moduleName];

  if (!module) {

    console.error("ไม่พบโมดูล:", moduleName);

    throw new Error(
      `Unknown module: ${moduleName}`
    );

  }

  return module;

}


// ========================================
// โหลดข้อมูล
// ========================================

export async function loadRecords(moduleName) {

  const { table } =
    getModule(moduleName);

  const { data, error } =
    await supabaseClient
      .from(table)
      .select("*")
      .order(
        "created_at",
        {
          ascending: false
        }
      );

  if (error) {

    console.error(
      "เกิดข้อผิดพลาดในการโหลดข้อมูล:",
      error
    );

    throw error;

  }

  return data || [];

}


// ========================================
// เพิ่มข้อมูล
// ========================================

export async function createRecord(
  moduleName,
  payload
) {

  const {
    table,
    fields
  } = getModule(moduleName);

  const cleanData = {};

  for (const field of fields) {

    if (
      payload[field] !== undefined &&
      payload[field] !== null
    ) {

      cleanData[field] =
        payload[field];

    }

  }


  const { data, error } =
    await supabaseClient
      .from(table)
      .insert(cleanData)
      .select()
      .single();


  if (error) {

    console.error(
      "เกิดข้อผิดพลาดในการเพิ่มข้อมูล:",
      error
    );

    throw error;

  }

  return data;

}


// ========================================
// แก้ไขข้อมูล
// ========================================

export async function updateRecord(
  moduleName,
  id,
  payload
) {

  const {
    table,
    fields
  } = getModule(moduleName);

  const cleanData = {};

  for (const field of fields) {

    if (
      payload[field] !== undefined
    ) {

      cleanData[field] =
        payload[field];

    }

  }


  const { data, error } =
    await supabaseClient
      .from(table)
      .update(cleanData)
      .eq("id", id)
      .select()
      .single();


  if (error) {

    console.error(
      "เกิดข้อผิดพลาดในการแก้ไขข้อมูล:",
      error
    );

    throw error;

  }

  return data;

}


// ========================================
// ลบข้อมูล
// ========================================

export async function deleteRecord(
  moduleName,
  id
) {

  const {
    table
  } = getModule(moduleName);


  const { error } =
    await supabaseClient
      .from(table)
      .delete()
      .eq("id", id);


  if (error) {

    console.error(
      "เกิดข้อผิดพลาดในการลบข้อมูล:",
      error
    );

    throw error;

  }

  return true;

}


// ========================================
// อัปโหลดรูปภาพ
// ========================================

export async function uploadImage(
  file,
  bucket = "images"
) {

  if (!file) {

    return null;

  }


  const extension =
    file.name
      .split(".")
      .pop()
      .toLowerCase();


  const fileName =
    `${Date.now()}-${crypto.randomUUID()}.${extension}`;


  const {
    error
  } =
    await supabaseClient
      .storage
      .from(bucket)
      .upload(
        fileName,
        file,
        {
          cacheControl: "3600",
          upsert: false
        }
      );


  if (error) {

    console.error(
      "เกิดข้อผิดพลาดในการอัปโหลดรูป:",
      error
    );

    throw error;

  }


  const {
    data
  } =
    supabaseClient
      .storage
      .from(bucket)
      .getPublicUrl(
        fileName
      );


  return data.publicUrl;

}


// ========================================
// ลบรูปภาพออกจาก Storage
// ========================================

export async function deleteImage(
  imageUrl,
  bucket = "images"
) {

  if (!imageUrl) {

    return true;

  }


  try {

    const marker =
      `/storage/v1/object/public/${bucket}/`;


    const index =
      imageUrl.indexOf(marker);


    if (index === -1) {

      return true;

    }


    const filePath =
      imageUrl.substring(
        index + marker.length
      );


    const {
      error
    } =
      await supabaseClient
        .storage
        .from(bucket)
        .remove([
          filePath
        ]);


    if (error) {

      console.error(
        "ไม่สามารถลบรูปได้:",
        error
      );

    }


    return true;

  }

  catch (error) {

    console.error(
      error
    );

    return false;

  }

}


// ========================================
// รายชื่อโมดูล
// ========================================

export function getModules() {

  return MODULES;

}
