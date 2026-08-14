/* =========================================================
   RONGKHEM e-VILLAGE
   DATABASE V2
   ฐานข้อมูลกลางสำหรับระบบจริง
   ========================================================= */

create extension if not exists pgcrypto;


/* =========================================================
   1. ข้อมูลหมู่บ้าน
========================================================= */

create table if not exists village_settings (

    id uuid primary key
        default gen_random_uuid(),

    village_name text
        default 'บ้านร่องเข็ม',

    village_no text
        default '6',

    subdistrict text
        default 'จำป่าหวาย',

    district text
        default 'เมืองพะเยา',

    province text
        default 'พะเยา',

    leader_name text
        default 'นายศักรนนท์ ขัติ์วงศ์',

    leader_position text
        default 'ผู้ใหญ่บ้าน หมู่ที่ 6',

    phone text
        default '088-888-8888',

    line_id text
        default 'rongkhem.village',

    facebook text
        default 'ร่องเข็ม หมู่ 6',

    updated_at timestamptz
        default now()

);


/* =========================================================
   2. VERIFIED DATA
   ข้อมูลจริงที่ยืนยันแล้ว
========================================================= */

create table if not exists verified_statistics (

    id uuid primary key
        default gen_random_uuid(),

    population_total integer
        default 960,

    population_male integer
        default 471,

    population_female integer
        default 489,

    households_total integer
        default 352,

    survey_total integer
        default 202,

    survey_households integer
        default 202,

    elderly_60_plus integer
        default 92,

    elderly_percent numeric(5,2)
        default 45.5,

    disabled_total integer
        default 3,

    chronic_disease_total integer
        default 1,

    vulnerable_selections integer
        default 95,

    source text
        default 'VERIFIED DATA BUILD',

    verified boolean
        default true,

    updated_at timestamptz
        default now()

);


/* =========================================================
   3. ประชาชน
========================================================= */

create table if not exists citizens (

    id uuid primary key
        default gen_random_uuid(),

    house_no text,

    first_name text,

    last_name text,

    gender text,

    birth_date date,

    age integer,

    occupation text,

    phone text,

    status text
        default 'ปกติ',

    notes text,

    created_at timestamptz
        default now(),

    updated_at timestamptz
        default now()

);


/* =========================================================
   4. ครัวเรือน
========================================================= */

create table if not exists households (

    id uuid primary key
        default gen_random_uuid(),

    house_no text,

    head_name text,

    members_count integer
        default 0,

    status text
        default 'อาศัยอยู่จริง',

    phone text,

    address text,

    notes text,

    created_at timestamptz
        default now(),

    updated_at timestamptz
        default now()

);


/* =========================================================
   5. ผู้นำชุมชน
========================================================= */

create table if not exists leaders (

    id uuid primary key
        default gen_random_uuid(),

    name text,

    position text,

    phone text,

    photo_url text,

    sort_order integer
        default 0,

    active boolean
        default true,

    created_at timestamptz
        default now(),

    updated_at timestamptz
        default now()

);


/* =========================================================
   6. ข่าว
========================================================= */

create table if not exists news (

    id uuid primary key
        default gen_random_uuid(),

    title text,

    category text,

    body text,

    image_url text,

    published boolean
        default true,

    published_at timestamptz
        default now(),

    created_at timestamptz
        default now(),

    updated_at timestamptz
        default now()

);


/* =========================================================
   7. กิจกรรม
========================================================= */

create table if not exists activities (

    id uuid primary key
        default gen_random_uuid(),

    title text,

    activity_date date,

    location text,

    description text,

    image_url text,

    created_at timestamptz
        default now(),

    updated_at timestamptz
        default now()

);


/* =========================================================
   8. เรื่องร้องเรียน / แจ้งเหตุ
========================================================= */

create table if not exists incidents (

    id uuid primary key
        default gen_random_uuid(),

    title text,

    description text,

    category text,

    reporter_name text,

    reporter_phone text,

    location text,

    status text
        default 'รอดำเนินการ',

    image_url text,

    created_at timestamptz
        default now(),

    updated_at timestamptz
        default now()

);


/* =========================================================
   9. บริการประชาชน
========================================================= */

create table if not exists services (

    id uuid primary key
        default gen_random_uuid(),

    title text,

    description text,

    contact text,

    link_url text,

    active boolean
        default true,

    created_at timestamptz
        default now(),

    updated_at timestamptz
        default now()

);


/* =========================================================
   10. โครงการ
========================================================= */

create table if not exists projects (

    id uuid primary key
        default gen_random_uuid(),

    title text,

    description text,

    status text,

    budget numeric(14,2),

    start_date date,

    end_date date,

    image_url text,

    created_at timestamptz
        default now(),

    updated_at timestamptz
        default now()

);


/* =========================================================
   11. สิ่งแวดล้อม / PM2.5
========================================================= */

create table if not exists environment (

    id uuid primary key
        default gen_random_uuid(),

    pm25 numeric(8,2),

    temperature numeric(6,2),

    humidity numeric(6,2),

    rain_chance numeric(6,2),

    wind text,

    source text,

    recorded_at timestamptz
        default now(),

    created_at timestamptz
        default now()

);


/* =========================================================
   12. แหล่งซับน้ำจำ
========================================================= */

create table if not exists wetland (

    id uuid primary key
        default gen_random_uuid(),

    name text,

    status text,

    description text,

    image_url text,

    created_at timestamptz
        default now(),

    updated_at timestamptz
        default now()

);


/* =========================================================
   13. สมาชิกกลุ่มข้าวสาร
========================================================= */

create table if not exists rice_members (

    id uuid primary key
        default gen_random_uuid(),

    member_name text,

    household_no text,

    status text
        default 'ปกติ',

    sent_count integer
        default 0,

    pending_count integer
        default 0,

    notes text,

    created_at timestamptz
        default now(),

    updated_at timestamptz
        default now()

);


/* =========================================================
   14. ผู้ดูแลระบบ
========================================================= */

create table if not exists admin_users (

    id uuid primary key,

    display_name text,

    role text
        default 'admin',

    active boolean
        default true,

    created_at timestamptz
        default now()

);


/* =========================================================
   15. ไฟล์
========================================================= */

create table if not exists media_files (

    id uuid primary key
        default gen_random_uuid(),

    file_name text,

    file_path text,

    file_url text,

    file_type text,

    file_size bigint,

    uploaded_by uuid,

    created_at timestamptz
        default now()

);


/* =========================================================
   16. ข้อมูลเริ่มต้น VERIFIED
========================================================= */

insert into verified_statistics (

    population_total,
    population_male,
    population_female,
    households_total,
    survey_total,
    survey_households,
    elderly_60_plus,
    elderly_percent,
    disabled_total,
    chronic_disease_total,
    vulnerable_selections,
    source,
    verified

)

select

    960,
    471,
    489,
    352,
    202,
    202,
    92,
    45.5,
    3,
    1,
    95,
    'VERIFIED DATA BUILD',
    true

where not exists (

    select 1
    from verified_statistics

);


/* =========================================================
   17. ข้อมูลหมู่บ้านเริ่มต้น
========================================================= */

insert into village_settings (

    village_name,
    village_no,
    subdistrict,
    district,
    province,
    leader_name,
    leader_position,
    phone,
    line_id,
    facebook

)

select

    'บ้านร่องเข็ม',
    '6',
    'จำป่าหวาย',
    'เมืองพะเยา',
    'พะเยา',
    'นายศักรนนท์ ขัติ์วงศ์',
    'ผู้ใหญ่บ้าน หมู่ที่ 6',
    '088-888-8888',
    'rongkhem.village',
    'ร่องเข็ม หมู่ 6'

where not exists (

    select 1
    from village_settings

);


/* =========================================================
   18. เปิด RLS
========================================================= */

alter table village_settings enable row level security;

alter table verified_statistics enable row level security;

alter table citizens enable row level security;

alter table households enable row level security;

alter table leaders enable row level security;

alter table news enable row level security;

alter table activities enable row level security;

alter table incidents enable row level security;

alter table services enable row level security;

alter table projects enable row level security;

alter table environment enable row level security;

alter table wetland enable row level security;

alter table rice_members enable row level security;

alter table media_files enable row level security;


/* =========================================================
   19. PUBLIC READ
========================================================= */

create policy
"public read village"
on village_settings
for select
using (true);


create policy
"public read verified"
on verified_statistics
for select
using (true);


create policy
"public read leaders"
on leaders
for select
using (active = true);


create policy
"public read news"
on news
for select
using (published = true);


create policy
"public read activities"
on activities
for select
using (true);


create policy
"public read services"
on services
for select
using (active = true);


create policy
"public read projects"
on projects
for select
using (true);


create policy
"public read environment"
on environment
for select
using (true);


create policy
"public read wetland"
on wetland
for select
using (true);


/* =========================================================
   20. AUTHENTICATED ADMIN WRITE
========================================================= */

create policy
"authenticated manage village"
on village_settings
for all
to authenticated
using (true)
with check (true);


create policy
"authenticated manage verified"
on verified_statistics
for all
to authenticated
using (true)
with check (true);


create policy
"authenticated manage citizens"
on citizens
for all
to authenticated
using (true)
with check (true);


create policy
"authenticated manage households"
on households
for all
to authenticated
using (true)
with check (true);


create policy
"authenticated manage leaders"
on leaders
for all
to authenticated
using (true)
with check (true);


create policy
"authenticated manage news"
on news
for all
to authenticated
using (true)
with check (true);


create policy
"authenticated manage activities"
on activities
for all
to authenticated
using (true)
with check (true);


create policy
"authenticated manage incidents"
on incidents
for all
to authenticated
using (true)
with check (true);


create policy
"authenticated manage services"
on services
for all
to authenticated
using (true)
with check (true);


create policy
"authenticated manage projects"
on projects
for all
to authenticated
using (true)
with check (true);


create policy
"authenticated manage environment"
on environment
for all
to authenticated
using (true)
with check (true);


create policy
"authenticated manage wetland"
on wetland
for all
to authenticated
using (true)
with check (true);


create policy
"authenticated manage rice"
on rice_members
for all
to authenticated
using (true)
with check (true);


create policy
"authenticated manage media"
on media_files
for all
to authenticated
using (true)
with check (true);


/* =========================================================
   21. VIEW สำหรับ Dashboard
========================================================= */

create or replace view dashboard_summary
as

select

    population_total,

    population_male,

    population_female,

    households_total,

    survey_total,

    survey_households,

    elderly_60_plus,

    elderly_percent,

    disabled_total,

    chronic_disease_total,

    vulnerable_selections,

    source,

    verified

from verified_statistics

order by updated_at desc

limit 1;
