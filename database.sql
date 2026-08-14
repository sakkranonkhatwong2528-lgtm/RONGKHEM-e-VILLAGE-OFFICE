/* =========================================================
   RONGKHEM e-VILLAGE
   DATABASE SYSTEM
   ที่ทำการผู้ใหญ่บ้านออนไลน์
   บ้านร่องเข็ม หมู่ที่ 6
   ตำบลจำป่าหวาย อำเภอเมืองพะเยา จังหวัดพะเยา
   ========================================================= */


/* =========================================================
   1. EXTENSIONS
   ========================================================= */

create extension if not exists pgcrypto;


/* =========================================================
   2. CITIZENS
   ========================================================= */

create table if not exists public.citizens (

    id uuid primary key default gen_random_uuid(),

    citizen_id text,

    prefix text,

    first_name text,

    last_name text,

    gender text,

    birth_date date,

    age integer,

    phone text,

    occupation text,

    house_number text,

    status text default 'ปกติ',

    notes text,

    created_at timestamptz default now(),

    updated_at timestamptz default now()

);


/* =========================================================
   3. HOUSEHOLDS
   ========================================================= */

create table if not exists public.households (

    id uuid primary key default gen_random_uuid(),

    house_number text not null,

    village_no text default '6',

    head_name text,

    members_count integer default 0,

    male_count integer default 0,

    female_count integer default 0,

    elderly_count integer default 0,

    disabled_count integer default 0,

    vulnerable_count integer default 0,

    occupation text,

    phone text,

    address_detail text,

    latitude numeric,

    longitude numeric,

    notes text,

    created_at timestamptz default now(),

    updated_at timestamptz default now()

);


/* =========================================================
   4. LEADERS
   ========================================================= */

create table if not exists public.leaders (

    id uuid primary key default gen_random_uuid(),

    prefix text,

    first_name text,

    last_name text,

    position text,

    phone text,

    image_url text,

    start_date date,

    end_date date,

    status text default 'ปฏิบัติหน้าที่',

    description text,

    created_at timestamptz default now(),

    updated_at timestamptz default now()

);


/* =========================================================
   5. NEWS
   ========================================================= */

create table if not exists public.news (

    id uuid primary key default gen_random_uuid(),

    title text not null,

    category text default 'ประชาสัมพันธ์',

    content text,

    image_url text,

    author text,

    publish_date timestamptz default now(),

    is_published boolean default true,

    is_important boolean default false,

    views integer default 0,

    created_at timestamptz default now(),

    updated_at timestamptz default now()

);


/* =========================================================
   6. ACTIVITIES
   ========================================================= */

create table if not exists public.activities (

    id uuid primary key default gen_random_uuid(),

    title text not null,

    description text,

    activity_date date,

    start_time time,

    end_time time,

    location text,

    organizer text,

    status text default 'กำหนดการ',

    image_url text,

    created_at timestamptz default now(),

    updated_at timestamptz default now()

);


/* =========================================================
   7. INCIDENTS
   ========================================================= */

create table if not exists public.incidents (

    id uuid primary key default gen_random_uuid(),

    incident_no text,

    reporter_name text,

    phone text,

    category text,

    title text,

    description text,

    location text,

    latitude numeric,

    longitude numeric,

    priority text default 'ปกติ',

    status text default 'รอดำเนินการ',

    assigned_to text,

    response_note text,

    resolved_at timestamptz,

    created_at timestamptz default now(),

    updated_at timestamptz default now()

);


/* =========================================================
   8. SERVICES
   ========================================================= */

create table if not exists public.services (

    id uuid primary key default gen_random_uuid(),

    service_name text not null,

    description text,

    category text,

    required_documents text,

    contact text,

    service_location text,

    service_hours text,

    status text default 'เปิดให้บริการ',

    created_at timestamptz default now(),

    updated_at timestamptz default now()

);


/* =========================================================
   9. PROJECTS
   ========================================================= */

create table if not exists public.projects (

    id uuid primary key default gen_random_uuid(),

    project_name text not null,

    project_type text,

    description text,

    budget numeric default 0,

    funding_source text,

    responsible_person text,

    start_date date,

    end_date date,

    progress integer default 0,

    status text default 'กำลังดำเนินการ',

    image_url text,

    created_at timestamptz default now(),

    updated_at timestamptz default now()

);


/* =========================================================
   10. ENVIRONMENT
   ========================================================= */

create table if not exists public.environment (

    id uuid primary key default gen_random_uuid(),

    pm25 numeric,

    pm10 numeric,

    temperature numeric,

    humidity numeric,

    air_quality text,

    burning_points integer default 0,

    fire_risk text,

    rainfall numeric,

    wind_speed numeric,

    recorded_at timestamptz default now(),

    created_at timestamptz default now()

);


/* =========================================================
   11. WETLAND
   ========================================================= */

create table if not exists public.wetland (

    id uuid primary key default gen_random_uuid(),

    name text default 'แหล่งซับน้ำจำ',

    water_level numeric,

    water_level_percent numeric,

    status text,

    rainfall numeric,

    temperature numeric,

    description text,

    recorded_at timestamptz default now(),

    created_at timestamptz default now()

);


/* =========================================================
   12. RICE MEMBERS
   ========================================================= */

create table if not exists public.rice_members (

    id uuid primary key default gen_random_uuid(),

    member_no text,

    name text not null,

    house_number text,

    phone text,

    status text default 'ส่งแล้ว',

    missed_count integer default 0,

    last_delivery_date date,

    total_delivery integer default 0,

    notes text,

    created_at timestamptz default now(),

    updated_at timestamptz default now()

);


/* =========================================================
   13. RICE FUNERALS
   ========================================================= */

create table if not exists public.rice_funerals (

    id uuid primary key default gen_random_uuid(),

    deceased_name text not null,

    funeral_date date,

    rice_amount numeric default 1,

    recipient_house text,

    responsible_person text,

    note text,

    created_at timestamptz default now(),

    updated_at timestamptz default now()

);


/* =========================================================
   14. RICE STOCK
   ========================================================= */

create table if not exists public.rice_stock (

    id uuid primary key default gen_random_uuid(),

    transaction_type text,

    amount numeric default 0,

    balance numeric default 0,

    source text,

    reference text,

    note text,

    created_at timestamptz default now()

);


/* =========================================================
   15. STATISTICS
   ========================================================= */

create table if not exists public.statistics (

    id uuid primary key default gen_random_uuid(),

    year integer,

    population integer default 0,

    male integer default 0,

    female integer default 0,

    households integer default 0,

    children integer default 0,

    working_age integer default 0,

    elderly integer default 0,

    disabled integer default 0,

    vulnerable integer default 0,

    agriculture_households integer default 0,

    shops integer default 0,

    created_at timestamptz default now(),

    updated_at timestamptz default now()

);


/* =========================================================
   16. NOTIFICATIONS
   ========================================================= */

create table if not exists public.notifications (

    id uuid primary key default gen_random_uuid(),

    title text not null,

    message text,

    type text default 'ทั่วไป',

    priority text default 'ปกติ',

    target text default 'ประชาชน',

    is_read boolean default false,

    is_active boolean default true,

    expires_at timestamptz,

    created_at timestamptz default now()

);


/* =========================================================
   17. SYSTEM LOGS
   ========================================================= */

create table if not exists public.system_logs (

    id uuid primary key default gen_random_uuid(),

    user_id uuid,

    user_name text,

    action text,

    description text,

    ip_address text,

    created_at timestamptz default now()

);


/* =========================================================
   18. VILLAGE PROFILE
   ========================================================= */

create table if not exists public.village_profile (

    id uuid primary key default gen_random_uuid(),

    village_name text default 'บ้านร่องเข็ม',

    village_no text default '6',

    subdistrict text default 'จำป่าหวาย',

    district text default 'เมืองพะเยา',

    province text default 'พะเยา',

    postal_code text,

    village_head text,

    phone text,

    email text,

    line_id text,

    facebook_url text,

    website_url text,

    address text,

    latitude numeric,

    longitude numeric,

    logo_url text,

    cover_url text,

    description text,

    created_at timestamptz default now(),

    updated_at timestamptz default now()

);


/* =========================================================
   19. INDEXES
   ========================================================= */

create index if not exists
idx_citizens_house
on public.citizens(house_number);


create index if not exists
idx_citizens_name
on public.citizens(first_name,last_name);


create index if not exists
idx_households_number
on public.households(house_number);


create index if not exists
idx_news_date
on public.news(created_at desc);


create index if not exists
idx_activities_date
on public.activities(activity_date);


create index if not exists
idx_incidents_status
on public.incidents(status);


create index if not exists
idx_projects_status
on public.projects(status);


create index if not exists
idx_environment_date
on public.environment(recorded_at desc);


create index if not exists
idx_wetland_date
on public.wetland(recorded_at desc);


create index if not exists
idx_rice_members_status
on public.rice_members(status);


create index if not exists
idx_rice_funerals_date
on public.rice_funerals(funeral_date desc);


create index if not exists
idx_notifications_active
on public.notifications(is_active);


create index if not exists
idx_logs_date
on public.system_logs(created_at desc);


/* =========================================================
   20. ENABLE RLS
   ========================================================= */

alter table public.citizens enable row level security;

alter table public.households enable row level security;

alter table public.leaders enable row level security;

alter table public.news enable row level security;

alter table public.activities enable row level security;

alter table public.incidents enable row level security;

alter table public.services enable row level security;

alter table public.projects enable row level security;

alter table public.environment enable row level security;

alter table public.wetland enable row level security;

alter table public.rice_members enable row level security;

alter table public.rice_funerals enable row level security;

alter table public.rice_stock enable row level security;

alter table public.statistics enable row level security;

alter table public.notifications enable row level security;

alter table public.system_logs enable row level security;

alter table public.village_profile enable row level security;


/* =========================================================
   21. PUBLIC READ POLICIES
   ========================================================= */


/* CITIZENS */

create policy
"citizens_public_read"

on public.citizens

for select

to anon, authenticated

using (true);


/* HOUSEHOLDS */

create policy
"households_public_read"

on public.households

for select

to anon, authenticated

using (true);


/* LEADERS */

create policy
"leaders_public_read"

on public.leaders

for select

to anon, authenticated

using (true);


/* NEWS */

create policy
"news_public_read"

on public.news

for select

to anon, authenticated

using (
    is_published = true
);


/* ACTIVITIES */

create policy
"activities_public_read"

on public.activities

for select

to anon, authenticated

using (true);


/* SERVICES */

create policy
"services_public_read"

on public.services

for select

to anon, authenticated

using (
    status = 'เปิดให้บริการ'
);


/* PROJECTS */

create policy
"projects_public_read"

on public.projects

for select

to anon, authenticated

using (true);


/* ENVIRONMENT */

create policy
"environment_public_read"

on public.environment

for select

to anon, authenticated

using (true);


/* WETLAND */

create policy
"wetland_public_read"

on public.wetland

for select

to anon, authenticated

using (true);


/* RICE MEMBERS */

create policy
"rice_members_public_read"

on public.rice_members

for select

to anon, authenticated

using (true);


/* RICE FUNERALS */

create policy
"rice_funerals_public_read"

on public.rice_funerals

for select

to anon, authenticated

using (true);


/* RICE STOCK */

create policy
"rice_stock_public_read"

on public.rice_stock

for select

to anon, authenticated

using (true);


/* STATISTICS */

create policy
"statistics_public_read"

on public.statistics

for select

to anon, authenticated

using (true);


/* NOTIFICATIONS */

create policy
"notifications_public_read"

on public.notifications

for select

to anon, authenticated

using (
    is_active = true
);


/* VILLAGE PROFILE */

create policy
"village_profile_public_read"

on public.village_profile

for select

to anon, authenticated

using (true);


/* =========================================================
   22. DEMO VILLAGE PROFILE
   ========================================================= */

insert into public.village_profile (

    village_name,

    village_no,

    subdistrict,

    district,

    province,

    village_head,

    description

)

select

    'บ้านร่องเข็ม',

    '6',

    'จำป่าหวาย',

    'เมืองพะเยา',

    'พะเยา',

    'ผู้ใหญ่บ้าน',

    'RONGKHEM e-VILLAGE — ที่ทำการผู้ใหญ่บ้านออนไลน์'

where not exists (

    select 1

    from public.village_profile

);


/* =========================================================
   23. DEMO STATISTICS
   ========================================================= */

insert into public.statistics (

    year,

    population,

    male,

    female,

    households,

    children,

    working_age,

    elderly,

    disabled,

    vulnerable,

    agriculture_households,

    shops

)

select

    2569,

    642,

    311,

    331,

    192,

    82,

    437,

    123,

    14,

    17,

    137,

    19

where not exists (

    select 1

    from public.statistics

    where year = 2569

);


/* =========================================================
   24. DEMO RICE MEMBERS
   ========================================================= */

insert into public.rice_members (

    member_no,

    name,

    house_number,

    status,

    missed_count

)

select

    'RK-001',

    'สมชาย ใจดี',

    '12',

    'ส่งแล้ว',

    0

where not exists (

    select 1

    from public.rice_members

    where member_no = 'RK-001'

);


insert into public.rice_members (

    member_no,

    name,

    house_number,

    status,

    missed_count

)

select

    'RK-002',

    'มาลี วงศ์คำ',

    '18',

    'ส่งแล้ว',

    0

where not exists (

    select 1

    from public.rice_members

    where member_no = 'RK-002'

);


insert into public.rice_members (

    member_no,

    name,

    house_number,

    status,

    missed_count

)

select

    'RK-003',

    'ประเสริฐ คำดี',

    '25',

    'ค้างส่ง',

    1

where not exists (

    select 1

    from public.rice_members

    where member_no = 'RK-003'

);


/* =========================================================
   25. INITIAL RICE STOCK
   ========================================================= */

insert into public.rice_stock (

    transaction_type,

    amount,

    balance,

    source,

    note

)

select

    'ยอดตั้งต้น',

    147,

    147,

    'กลุ่มข้าวสาร',

    'ยอดสต็อกเริ่มต้น'

where not exists (

    select 1

    from public.rice_stock

);


/* =========================================================
   26. INITIAL NOTIFICATION
   ========================================================= */

insert into public.notifications (

    title,

    message,

    type,

    priority,

    target,

    is_active

)

select

    'ยินดีต้อนรับสู่ RONGKHEM e-VILLAGE',

    'ระบบที่ทำการผู้ใหญ่บ้านออนไลน์ บ้านร่องเข็ม',

    'ระบบ',

    'ปกติ',

    'ประชาชน',

    true

where not exists (

    select 1

    from public.notifications

);


/* =========================================================
   27. FINISHED
   ========================================================= */

select
    'RONGKHEM e-VILLAGE DATABASE READY'
    as status;
