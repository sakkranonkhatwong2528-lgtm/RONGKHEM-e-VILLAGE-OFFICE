import supabaseClient from "./supabase-config.js";

// ========================================
// กำหนดตารางและฟิลด์ของแต่ละโมดูล
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
  const module = MODULES[moduleName];

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
  const { table } = getModule(moduleName);

  const { data, error } =
    await supabaseClient
      .from(table)
      .select("*")
      .order("created_at", {
        ascending: false
      });

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
// โหลดข้อมูลตาม ID
// ========================================

export async function loadRecordById(
  moduleName,
  id
) {
  const { table } =
    getModule(moduleName);

  const { data, error } =
    await supabaseClient
      .from(table)
      .select("*")
      .eq("id", id)
      .single();

  if (error) {
    console.error(
      "เกิดข้อผิดพลาดในการโหลดข้อมูล:",
      error
    );

    throw error;
  }

  return data;
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

  const {
    data,
    error
  } =
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
  const { table } =
    getModule(moduleName);

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
  bucket = "รูปภาพ"
) {
  if (!file) {
    return null;
  }

  const extension =
    file.name
      .split(".")
      .pop()
      ?.toLowerCase();

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
      "เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ:",
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
// ลบรูปภาพจาก Storage
// ========================================

export async function deleteImage(
  filePath,
  bucket = "รูปภาพ"
) {
  if (!filePath) {
    return true;
  }

  const { error } =
    await supabaseClient
      .storage
      .from(bucket)
      .remove([
        filePath
      ]);

  if (error) {
    console.error(
      "เกิดข้อผิดพลาดในการลบรูปภาพ:",
      error
    );

    throw error;
  }

  return true;
}

// ========================================
// ตรวจสอบการเชื่อมต่อ Supabase
// ========================================

export async function testConnection() {
  const {
    data,
    error
  } =
    await supabaseClient
      .from("news")
      .select("id")
      .limit(1);

  if (error) {
    console.error(
      "เชื่อมต่อ Supabase ไม่สำเร็จ:",
      error
    );

    return {
      success: false,
      error
    };
  }

  return {
    success: true,
    data
  };
}
