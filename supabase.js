/* =========================================================
   RONGKHEM e-VILLAGE OFFICE
   supabase.js
   ระบบฐานข้อมูลกลาง Supabase
   ========================================================= */

/*
  1. เปลี่ยน SUPABASE_URL เป็น URL ของ Project
  2. เปลี่ยน SUPABASE_ANON_KEY เป็น anon/public key
*/

const SUPABASE_URL =
  "ใส่_SUPABASE_URL_ของคุณ";

const SUPABASE_ANON_KEY =
  "ใส่_SUPABASE_ANON_KEY_ของคุณ";


/* =========================================================
   สร้าง Client
   ========================================================= */

const rongkhemSupabase =
  window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  );


/* =========================================================
   CONFIG
   ========================================================= */

const RONGKHEM_DB = {

  settings: "village_settings",

  stats: "village_stats",

  leaders: "leaders",

  members: "community_members",

  contents: "contents",

  history: "village_history",

  bucket: "rongkhem-images"

};


/* =========================================================
   ตรวจสอบการเชื่อมต่อ
   ========================================================= */

async function checkSupabaseConnection() {

  try {

    const { data, error } =
      await rongkhemSupabase
        .from(RONGKHEM_DB.settings)
        .select("id")
        .limit(1);

    if (error) {
      console.error(
        "Supabase Connection Error:",
        error
      );

      return false;
    }

    console.log(
      "✅ RONGKHEM Supabase Connected"
    );

    return true;

  } catch (error) {

    console.error(error);

    return false;
  }
}


/* =========================================================
   VILLAGE SETTINGS
   ========================================================= */

async function getVillageSettings() {

  const { data, error } =
    await rongkhemSupabase
      .from(RONGKHEM_DB.settings)
      .select("*")
      .order("updated_at", {
        ascending: false
      })
      .limit(1)
      .maybeSingle();

  if (error) {

    console.error(
      "getVillageSettings:",
      error
    );

    return null;
  }

  return data;
}


async function saveVillageSettings(data) {

  const current =
    await getVillageSettings();

  let result;

  if (current?.id) {

    result =
      await rongkhemSupabase
        .from(RONGKHEM_DB.settings)
        .update({
          ...data,
          updated_at: new Date().toISOString()
        })
        .eq("id", current.id)
        .select()
        .single();

  } else {

    result =
      await rongkhemSupabase
        .from(RONGKHEM_DB.settings)
        .insert(data)
        .select()
        .single();

  }

  if (result.error) {

    console.error(
      "saveVillageSettings:",
      result.error
    );

    throw result.error;
  }

  return result.data;
}


/* =========================================================
   VILLAGE STATISTICS
   ========================================================= */

async function getVillageStats() {

  const { data, error } =
    await rongkhemSupabase
      .from(RONGKHEM_DB.stats)
      .select("*")
      .limit(1)
      .maybeSingle();

  if (error) {

    console.error(
      "getVillageStats:",
      error
    );

    return null;
  }

  return data;
}


async function saveVillageStats(data) {

  const current =
    await getVillageStats();

  let result;

  if (current?.id) {

    result =
      await rongkhemSupabase
        .from(RONGKHEM_DB.stats)
        .update({
          ...data,
          updated_at: new Date().toISOString()
        })
        .eq("id", current.id)
        .select()
        .single();

  } else {

    result =
      await rongkhemSupabase
        .from(RONGKHEM_DB.stats)
        .insert(data)
        .select()
        .single();

  }

  if (result.error) {

    console.error(
      "saveVillageStats:",
      result.error
    );

    throw result.error;
  }

  return result.data;
}


/* =========================================================
   LEADERS
   ========================================================= */

async function getLeaders() {

  const { data, error } =
    await rongkhemSupabase
      .from(RONGKHEM_DB.leaders)
      .select("*")
      .order("sort_order", {
        ascending: true
      });

  if (error) {

    console.error(
      "getLeaders:",
      error
    );

    return [];
  }

  return data || [];
}


async function createLeader(data) {

  const { data: result, error } =
    await rongkhemSupabase
      .from(RONGKHEM_DB.leaders)
      .insert({
        name: data.name,
        position: data.position,
        period: data.period || "",
        image_url: data.image_url || null,
        sort_order: data.sort_order || 0
      })
      .select()
      .single();

  if (error) throw error;

  return result;
}


async function updateLeader(id, data) {

  const { data: result, error } =
    await rongkhemSupabase
      .from(RONGKHEM_DB.leaders)
      .update({
        name: data.name,
        position: data.position,
        period: data.period || "",
        image_url: data.image_url || null,
        sort_order: data.sort_order || 0,
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .select()
      .single();

  if (error) throw error;

  return result;
}


async function deleteLeader(id) {

  const { error } =
    await rongkhemSupabase
      .from(RONGKHEM_DB.leaders)
      .delete()
      .eq("id", id);

  if (error) throw error;

  return true;
}


/* =========================================================
   COMMUNITY MEMBERS
   ========================================================= */

async function getCommunityMembers(
  groupKey = null
) {

  let query =
    rongkhemSupabase
      .from(RONGKHEM_DB.members)
      .select("*")
      .order("sort_order", {
        ascending: true
      });

  if (groupKey) {

    query =
      query.eq(
        "group_key",
        groupKey
      );
  }

  const { data, error } =
    await query;

  if (error) {

    console.error(
      "getCommunityMembers:",
      error
    );

    return [];
  }

  return data || [];
}


async function createCommunityMember(data) {

  const { data: result, error } =
    await rongkhemSupabase
      .from(RONGKHEM_DB.members)
      .insert({
        group_key: data.group_key,
        group_name: data.group_name,
        name: data.name,
        position: data.position || "",
        image_url: data.image_url || null,
        sort_order: data.sort_order || 0
      })
      .select()
      .single();

  if (error) throw error;

  return result;
}


async function updateCommunityMember(
  id,
  data
) {

  const { data: result, error } =
    await rongkhemSupabase
      .from(RONGKHEM_DB.members)
      .update({
        group_key: data.group_key,
        group_name: data.group_name,
        name: data.name,
        position: data.position || "",
        image_url: data.image_url || null,
        sort_order: data.sort_order || 0,
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .select()
      .single();

  if (error) throw error;

  return result;
}


async function deleteCommunityMember(id) {

  const { error } =
    await rongkhemSupabase
      .from(RONGKHEM_DB.members)
      .delete()
      .eq("id", id);

  if (error) throw error;

  return true;
}


/* =========================================================
   CONTENTS
   ========================================================= */

async function getContents(
  contentType = null
) {

  let query =
    rongkhemSupabase
      .from(RONGKHEM_DB.contents)
      .select("*")
      .order("sort_order", {
        ascending: true
      })
      .order("created_at", {
        ascending: false
      });

  if (contentType) {

    query =
      query.eq(
        "content_type",
        contentType
      );
  }

  const { data, error } =
    await query;

  if (error) {

    console.error(
      "getContents:",
      error
    );

    return [];
  }

  return data || [];
}


async function createContent(data) {

  const { data: result, error } =
    await rongkhemSupabase
      .from(RONGKHEM_DB.contents)
      .insert({
        content_type: data.content_type,
        title: data.title,
        detail: data.detail || "",
        date_text: data.date_text || "",
        time_text: data.time_text || "",
        location: data.location || "",
        value_text: data.value_text || "",
        status_text: data.status_text || "",
        image_url: data.image_url || null,
        sort_order: data.sort_order || 0
      })
      .select()
      .single();

  if (error) throw error;

  return result;
}


async function updateContent(
  id,
  data
) {

  const { data: result, error } =
    await rongkhemSupabase
      .from(RONGKHEM_DB.contents)
      .update({
        content_type: data.content_type,
        title: data.title,
        detail: data.detail || "",
        date_text: data.date_text || "",
        time_text: data.time_text || "",
        location: data.location || "",
        value_text: data.value_text || "",
        status_text: data.status_text || "",
        image_url: data.image_url || null,
        sort_order: data.sort_order || 0,
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .select()
      .single();

  if (error) throw error;

  return result;
}


async function deleteContent(id) {

  const { error } =
    await rongkhemSupabase
      .from(RONGKHEM_DB.contents)
      .delete()
      .eq("id", id);

  if (error) throw error;

  return true;
}


/* =========================================================
   VILLAGE HISTORY
   ========================================================= */

async function getVillageHistory() {

  const { data, error } =
    await rongkhemSupabase
      .from(RONGKHEM_DB.history)
      .select("*")
      .order("sort_order", {
        ascending: true
      });

  if (error) {

    console.error(
      "getVillageHistory:",
      error
    );

    return [];
  }

  return data || [];
}


async function saveVillageHistory(
  id,
  data
) {

  if (id) {

    const { data: result, error } =
      await rongkhemSupabase
        .from(RONGKHEM_DB.history)
        .update({
          ...data,
          updated_at:
            new Date().toISOString()
        })
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;

    return result;
  }

  const { data: result, error } =
    await rongkhemSupabase
      .from(RONGKHEM_DB.history)
      .insert(data)
      .select()
      .single();

  if (error) throw error;

  return result;
}


/* =========================================================
   IMAGE UPLOAD
   ========================================================= */

async function uploadRongkhemImage(
  file,
  folder = "general"
) {

  if (!file) {
    throw new Error(
      "ไม่ได้เลือกไฟล์รูปภาพ"
    );
  }

  const allowed = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif"
  ];

  if (!allowed.includes(file.type)) {

    throw new Error(
      "รองรับเฉพาะ JPG, PNG, WEBP และ GIF"
    );
  }

  const maxSize =
    10 * 1024 * 1024;

  if (file.size > maxSize) {

    throw new Error(
      "รูปภาพต้องมีขนาดไม่เกิน 10 MB"
    );
  }

  const ext =
    file.name
      .split(".")
      .pop()
      .toLowerCase();

  const filename =
    `${Date.now()}-${crypto.randomUUID()}.${ext}`;

  const path =
    `${folder}/${filename}`;

  const { error } =
    await rongkhemSupabase
      .storage
      .from(RONGKHEM_DB.bucket)
      .upload(
        path,
        file,
        {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type
        }
      );

  if (error) {

    console.error(
      "uploadRongkhemImage:",
      error
    );

    throw error;
  }

  const { data } =
    rongkhemSupabase
      .storage
      .from(RONGKHEM_DB.bucket)
      .getPublicUrl(path);

  return {
    path,
    url: data.publicUrl
  };
}


/* =========================================================
   DELETE IMAGE
   ========================================================= */

async function deleteRongkhemImage(
  path
) {

  if (!path) return true;

  const { error } =
    await rongkhemSupabase
      .storage
      .from(RONGKHEM_DB.bucket)
      .remove([path]);

  if (error) {

    console.error(
      "deleteRongkhemImage:",
      error
    );

    throw error;
  }

  return true;
}


/* =========================================================
   BANNER
   ========================================================= */

async function uploadHeroImage(file) {

  const result =
    await uploadRongkhemImage(
      file,
      "banner"
    );

  await saveVillageSettings({
    hero_image: result.url
  });

  return result.url;
}


/* =========================================================
   รูปผู้ใหญ่บ้าน
   ========================================================= */

async function uploadLeaderImage(file) {

  const result =
    await uploadRongkhemImage(
      file,
      "leaders"
    );

  await saveVillageSettings({
    leader_image: result.url
  });

  return result.url;
}


/* =========================================================
   REALTIME
   ========================================================= */

function subscribeRongkhemRealtime(
  callback
) {

  return rongkhemSupabase
    .channel(
      "rongkhem-village-realtime"
    )
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public"
      },
      payload => {

        console.log(
          "RONGKHEM DATA CHANGED:",
          payload
        );

        if (
          typeof callback ===
          "function"
        ) {

          callback(payload);
        }
      }
    )
    .subscribe();
}


/* =========================================================
   EXPORT GLOBAL
   ========================================================= */

window.RONGKHEM = {

  client:
    rongkhemSupabase,

  DB:
    RONGKHEM_DB,

  checkSupabaseConnection,

  getVillageSettings,
  saveVillageSettings,

  getVillageStats,
  saveVillageStats,

  getLeaders,
  createLeader,
  updateLeader,
  deleteLeader,

  getCommunityMembers,
  createCommunityMember,
  updateCommunityMember,
  deleteCommunityMember,

  getContents,
  createContent,
  updateContent,
  deleteContent,

  getVillageHistory,
  saveVillageHistory,

  uploadRongkhemImage,
  deleteRongkhemImage,

  uploadHeroImage,
  uploadLeaderImage,

  subscribeRongkhemRealtime

};


/* =========================================================
   เริ่มตรวจสอบ
   ========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    checkSupabaseConnection();

  }
);
