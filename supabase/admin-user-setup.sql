/* =====================================================
   RONGKHEM e-VILLAGE OFFICE
   ADMIN USER SETUP
   =====================================================

   บัญชีผู้ใหญ่บ้าน:

   Username:
   sakkranon

   Role:
   admin

   ===================================================== */


/* =====================================================
   STEP 1
   ตรวจสอบ User ใน Supabase Authentication
   =====================================================

   UUID ต้องมาจาก:
   Supabase
   → Authentication
   → Users

   เช่น:

   xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

   ===================================================== */


/* =====================================================
   STEP 2
   ใส่ UUID ตรงนี้
   ===================================================== */

do $$

declare

    admin_user_id uuid :=
        'YOUR_AUTH_USER_UUID';

begin


    /* =================================================
       ตรวจสอบ UUID
    ================================================= */

    if admin_user_id =
       'YOUR_AUTH_USER_UUID'::uuid then

        raise exception
        'กรุณาใส่ UUID ของ User ก่อน';

    end if;


    /* =================================================
       ตรวจสอบว่ามี User จริงหรือไม่
    ================================================= */

    if not exists (

        select 1

        from auth.users

        where id = admin_user_id

    ) then

        raise exception
        'ไม่พบ User UUID นี้ใน Authentication';

    end if;


    /* =================================================
       สร้าง / อัปเดต PROFILE
    ================================================= */

    insert into public.profiles
    (

        id,

        username,

        display_name,

        role,

        active

    )

    values
    (

        admin_user_id,

        'sakkranon',

        'ผู้ใหญ่บ้าน',

        'admin',

        true

    )

    on conflict (id)

    do update set

        username =
            'sakkranon',

        display_name =
            'ผู้ใหญ่บ้าน',

        role =
            'admin',

        active =
            true,

        updated_at =
            now();


    /* =================================================
       สำเร็จ
    ================================================= */

    raise notice
    'สร้างสิทธิ์ผู้ใหญ่บ้านสำเร็จ';

end $$;


/* =====================================================
   ตรวจสอบผลลัพธ์
===================================================== */

select

    id,

    username,

    display_name,

    role,

    active,

    created_at,

    updated_at

from public.profiles

where username =
    'sakkranon';
