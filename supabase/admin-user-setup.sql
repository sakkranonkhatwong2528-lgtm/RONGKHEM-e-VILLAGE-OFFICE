-- =========================================
-- RONGKHEM e-VILLAGE DATABASE SETUP
-- =========================================

-- ข่าวสาร
create table if not exists news (
    id bigint generated always as identity primary key,
    title text not null,
    detail text,
    image_url text,
    created_at timestamptz default now()
);

-- เรื่องร้องเรียน
create table if not exists complaint (
    id bigint generated always as identity primary key,
    title text not null,
    detail text,
    image_url text,
    created_at timestamptz default now()
);

-- ผู้สูงอายุ
create table if not exists elderly (
    id bigint generated always as identity primary key,
    title text not null,
    detail text,
    image_url text,
    created_at timestamptz default now()
);

-- กลุ่มเปราะบาง
create table if not exists vulnerable (
    id bigint generated always as identity primary key,
    title text not null,
    detail text,
    image_url text,
    created_at timestamptz default now()
);

-- โครงการ
create table if not exists project (
    id bigint generated always as identity primary key,
    title text not null,
    detail text,
    image_url text,
    created_at timestamptz default now()
);

-- เหตุการณ์
create table if not exists incident (
    id bigint generated always as identity primary key,
    title text not null,
    detail text,
    image_url text,
    created_at timestamptz default now()
);

-- กิจกรรม
create table if not exists activity (
    id bigint generated always as identity primary key,
    title text not null,
    detail text,
    image_url text,
    created_at timestamptz default now()
);


-- =========================================
-- เปิด RLS
-- =========================================

alter table news enable row level security;
alter table complaint enable row level security;
alter table elderly enable row level security;
alter table vulnerable enable row level security;
alter table project enable row level security;
alter table incident enable row level security;
alter table activity enable row level security;


-- =========================================
-- อ่านข้อมูลได้
-- =========================================

create policy "news_public_read"
on news for select
using (true);

create policy "complaint_public_read"
on complaint for select
using (true);

create policy "elderly_public_read"
on elderly for select
using (true);

create policy "vulnerable_public_read"
on vulnerable for select
using (true);

create policy "project_public_read"
on project for select
using (true);

create policy "incident_public_read"
on incident for select
using (true);

create policy "activity_public_read"
on activity for select
using (true);


-- =========================================
-- ผู้ Login เพิ่มข้อมูล
-- =========================================

create policy "news_insert"
on news for insert
to authenticated
with check (true);

create policy "complaint_insert"
on complaint for insert
to authenticated
with check (true);

create policy "elderly_insert"
on elderly for insert
to authenticated
with check (true);

create policy "vulnerable_insert"
on vulnerable for insert
to authenticated
with check (true);

create policy "project_insert"
on project for insert
to authenticated
with check (true);

create policy "incident_insert"
on incident for insert
to authenticated
with check (true);

create policy "activity_insert"
on activity for insert
to authenticated
with check (true);


-- =========================================
-- ผู้ Login แก้ไข
-- =========================================

create policy "news_update"
on news for update
to authenticated
using (true)
with check (true);

create policy "complaint_update"
on complaint for update
to authenticated
using (true)
with check (true);

create policy "elderly_update"
on elderly for update
to authenticated
using (true)
with check (true);

create policy "vulnerable_update"
on vulnerable for update
to authenticated
using (true)
with check (true);

create policy "project_update"
on project for update
to authenticated
using (true)
with check (true);

create policy "incident_update"
on incident for update
to authenticated
using (true)
with check (true);

create policy "activity_update"
on activity for update
to authenticated
using (true)
with check (true);


-- =========================================
-- ผู้ Login ลบ
-- =========================================

create policy "news_delete"
on news for delete
to authenticated
using (true);

create policy "complaint_delete"
on complaint for delete
to authenticated
using (true);

create policy "elderly_delete"
on elderly for delete
to authenticated
using (true);

create policy "vulnerable_delete"
on vulnerable for delete
to authenticated
using (true);

create policy "project_delete"
on project for delete
to authenticated
using (true);

create policy "incident_delete"
on incident for delete
to authenticated
using (true);

create policy "activity_delete"
on activity for delete
to authenticated
using (true);


-- =========================================
-- STORAGE BUCKET
-- =========================================

insert into storage.buckets
(id, name, public)

values
('village-images', 'village-images', true)

on conflict (id) do nothing;


-- อ่านรูปได้
create policy "public_read_images"
on storage.objects
for select
using (bucket_id = 'village-images');


-- Login แล้วอัปโหลดรูปได้
create policy "auth_upload_images"
on storage.objects
for insert
to authenticated
with check (
    bucket_id = 'village-images'
);


-- Login แล้วแก้ไขรูปได้
create policy "auth_update_images"
on storage.objects
for update
to authenticated
using (
    bucket_id = 'village-images'
);


-- Login แล้วลบรูปได้
create policy "auth_delete_images"
on storage.objects
for delete
to authenticated
using (
    bucket_id = 'village-images'
);
