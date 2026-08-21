import supabaseClient from "./supabase-config.js";


// ========================================
// กำหนดตารางและฟิลด์ของแต่ละเมนู
// ========================================

const MODULES = {

  news: {
    table: "news",
    fields: [
      "title",
      "content",
      "image_url",
      "published_at"
    ]
  },


  activity: {
    table: "activities",
    fields: [
      "title",
      "description",
      "image_url"
    ]
  },


  project: {
    table: "projects",
    fields: [
      "title",
      "description",
      "status",
      "image_url"
    ]
  },


  incident: {
    table: "incidents",
    fields: [
      "title",
      "description",
      "status",
      "incident_date"
    ]
  },


  complaint: {
    table: "complaints",
    fields: [
      "title",
      "detail",
      "status"
    ]
  },


  elderly: {
    table: "elderly",
    fields: [
      "title",
      "description",
      "image_url"
    ]
  },


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

  const module =
    MODULES[moduleName];


  if (!module) {

    throw new Error(
      `ไม่พบโมดูล: ${moduleName}`
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

    console.error(error);

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
  } =
    getModule(moduleName);


  const cleanData = {};


  for (
    const field of fields
  ) {

    if (
      payload[field] !== undefined
    ) {

      cleanData[field] =
        payload[field];

    }

  }


  const {
    data,
    error
  } =
    await supabaseClient
      .from(table)
      .insert(cleanData)
      .select()
      .single();


  if (error) {

    console.error(error);

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
  } =
    getModule(moduleName);


  const cleanData = {};


  for (
    const field of fields
  ) {

    if (
      payload[field] !== undefined
    ) {

      cleanData[field] =
        payload[field];

    }

  }


  const {
    data,
    error
  } =
    await supabaseClient
      .from(table)
      .update(cleanData)
      .eq(
        "id",
        id
      )
      .select()
      .single();


  if (error) {

    console.error(error);

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

  const { table } =
    getModule(moduleName);


  const { error } =
    await supabaseClient
      .from(table)
      .delete()
      .eq(
        "id",
        id
      );


  if (error) {

    console.error(error);

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
      .pop();


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

    console.error(error);

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
