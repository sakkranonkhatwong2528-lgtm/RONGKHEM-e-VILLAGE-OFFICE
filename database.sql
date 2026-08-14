/* =========================================================
   RONGKHEM e-VILLAGE
   MASTER DATA FROM COMMUNITY DIAGNOSIS REPORT
   แหล่งข้อมูลหลัก:
   รายงานผลการวินิจฉัยชุมชน
   บ้านร่องเข็ม หมู่ 6
   ปีการศึกษา 2568
   ========================================================= */


/* =========================================================
   1. SOURCE DOCUMENT
   ========================================================= */

create table if not exists public.source_documents (

    id uuid primary key default gen_random_uuid(),

    title text not null,

    source_type text,

    academic_year text,

    description text,

    source_date date,

    created_at timestamptz default now()

);


/* =========================================================
   2. COMMUNITY HISTORY
   ========================================================= */

create table if not exists public.community_history (

    id uuid primary key default gen_random_uuid(),

    year_buddhist integer,

    title text not null,

    description text,

    sort_order integer default 0,

    source_document text,

    created_at timestamptz default now()

);


/* =========================================================
   3. COMMUNITY ORGANIZATIONS
   ========================================================= */

create table if not exists public.community_organizations (

    id uuid primary key default gen_random_uuid(),

    organization_name text not null,

    organization_type text,

    role_description text,

    member_count integer default 0,

    created_at timestamptz default now()

);


/* =========================================================
   4. COMMUNITY MEMBERS
   ========================================================= */

create table if not exists public.community_members (

    id uuid primary key default gen_random_uuid(),

    organization_id uuid references
        public.community_organizations(id)
        on delete cascade,

    name text not null,

    position text,

    created_at timestamptz default now()

);


/* =========================================================
   5. HEALTH SURVEY SUMMARY
   หมายเหตุ: เป็นกลุ่มตัวอย่าง ไม่ใช่ประชากรทั้งหมู่บ้าน
   ========================================================= */

create table if not exists public.health_survey_summary (

    id uuid primary key default gen_random_uuid(),

    survey_year integer,

    sample_size integer not null,

    category text not null,

    item_name text not null,

    amount integer default 0,

    percentage numeric(6,2),

    note text,

    created_at timestamptz default now()

);


/* =========================================================
   6. COMMUNITY HEALTH PROBLEMS
   ========================================================= */

create table if not exists public.community_health_problems (

    id uuid primary key default gen_random_uuid(),

    problem_name text not null,

    size_score integer,

    severity_score integer,

    difficulty_score integer,

    awareness_score integer,

    total_addition integer,

    total_multiplication integer,

    priority_rank integer,

    source_document text,

    created_at timestamptz default now()

);


/* =========================================================
   7. EPIDEMIOLOGICAL SURVEILLANCE
   ระดับอำเภอเมืองพะเยา ตามรายงาน
   ========================================================= */

create table if not exists public.epidemiology_surveillance (

    id uuid primary key default gen_random_uuid(),

    disease_code text,

    disease_name text not null,

    amount integer,

    area text,

    start_date date,

    end_date date,

    source_document text,

    created_at timestamptz default now()

);


/* =========================================================
   8. COMMUNITY CALENDAR
   ========================================================= */

create table if not exists public.community_calendar (

    id uuid primary key default gen_random_uuid(),

    activity_name text not null,

    category text,

    month_start integer,

    month_end integer,

    description text,

    created_at timestamptz default now()

);


/* =========================================================
   9. COMMUNITY PROJECTS FROM REPORT
   ========================================================= */

create table if not exists public.community_projects (

    id uuid primary key default gen_random_uuid(),

    project_name text not null,

    target_households integer,

    budget numeric,

    start_date date,

    end_date date,

    location text,

    description text,

    expected_result text,

    created_at timestamptz default now()

);


/* =========================================================
   10. SOURCE DOCUMENT
   ========================================================= */

insert into public.source_documents (

    title,

    source_type,

    academic_year,

    description,

    source_date

)

select

    'รายงานผลการวินิจฉัยชุมชน บ้านร่องเข็ม หมู่ 6',

    'รายงานการศึกษาชุมชน',

    '2568',

    'รายงานผลการวินิจฉัยชุมชน บ้านร่องเข็ม หมู่ 6 ตำบลจำป่าหวาย อำเภอเมืองพะเยา จังหวัดพะเยา',

    '2025-09-20'

where not exists (

    select 1
    from public.source_documents
    where title =
    'รายงานผลการวินิจฉัยชุมชน บ้านร่องเข็ม หมู่ 6'

);


/* =========================================================
   11. UPDATE VILLAGE PROFILE
   ========================================================= */

update public.village_profile

set

    village_name = 'บ้านร่องเข็ม',

    village_no = '6',

    subdistrict = 'จำป่าหวาย',

    district = 'เมืองพะเยา',

    province = 'พะเยา',

    village_head = 'นายศักรนนทน์ ขัติย์วงศ์',

    description =
        'ข้อมูลพื้นฐานอ้างอิงจากรายงานผลการวินิจฉัยชุมชน บ้านร่องเข็ม หมู่ 6 ปีการศึกษา 2568',

    updated_at = now();


/* =========================================================
   12. REAL VILLAGE STATISTICS
   ========================================================= */

insert into public.statistics (

    year,

    population,

    male,

    female,

    households

)

select

    2568,

    960,

    471,

    489,

    352

where not exists (

    select 1

    from public.statistics

    where year = 2568

);


/* =========================================================
   13. HISTORICAL VILLAGE LEADERS
   ========================================================= */

insert into public.leaders (

    first_name,

    last_name,

    position,

    start_date,

    end_date,

    status,

    description

)

select
    'คำมี',
    'นามจิต',
    'ผู้ใหญ่บ้าน',
    '1975-01-01',
    '1980-12-31',
    'พ้นจากตำแหน่ง',
    'ดำรงตำแหน่ง พ.ศ. 2518 ถึง พ.ศ. 2523'

where not exists (

    select 1
    from public.leaders
    where first_name='คำมี'
    and last_name='นามจิต'

);


insert into public.leaders (

    first_name,
    last_name,
    position,
    start_date,
    end_date,
    status,
    description

)

select
    'ผล',
    'นามจิต',
    'ผู้ใหญ่บ้าน',
    '1980-01-01',
    '1989-12-31',
    'พ้นจากตำแหน่ง',
    'ดำรงตำแหน่ง พ.ศ. 2523 ถึง พ.ศ. 2532'

where not exists (

    select 1
    from public.leaders
    where first_name='ผล'
    and last_name='นามจิต'

);


insert into public.leaders (

    first_name,
    last_name,
    position,
    start_date,
    end_date,
    status,
    description

)

select
    'ดวงคำ',
    'วังมูล',
    'ผู้ใหญ่บ้าน',
    '1989-01-01',
    '1993-12-31',
    'พ้นจากตำแหน่ง',
    'ดำรงตำแหน่ง พ.ศ. 2532 ถึง พ.ศ. 2536'

where not exists (

    select 1
    from public.leaders
    where first_name='ดวงคำ'
    and last_name='วังมูล'

);


insert into public.leaders (

    first_name,
    last_name,
    position,
    start_date,
    end_date,
    status,
    description

)

select
    'ทิน',
    'ศรีวิใจ',
    'ผู้ใหญ่บ้าน',
    '1993-01-01',
    '1998-12-31',
    'พ้นจากตำแหน่ง',
    'ดำรงตำแหน่ง พ.ศ. 2536 ถึง พ.ศ. 2541'

where not exists (

    select 1
    from public.leaders
    where first_name='ทิน'
    and last_name='ศรีวิใจ'

);


insert into public.leaders (

    first_name,
    last_name,
    position,
    start_date,
    end_date,
    status,
    description

)

select
    'มา',
    'วังมูล',
    'ผู้ใหญ่บ้าน',
    '1998-01-01',
    '2003-12-31',
    'พ้นจากตำแหน่ง',
    'ดำรงตำแหน่ง พ.ศ. 2541 ถึง พ.ศ. 2546'

where not exists (

    select 1
    from public.leaders
    where first_name='มา'
    and last_name='วังมูล'

);


insert into public.leaders (

    first_name,
    last_name,
    position,
    start_date,
    end_date,
    status,
    description

)

select
    'สมาน',
    'ศรีเมือง',
    'ผู้ใหญ่บ้าน',
    '2003-01-01',
    '2006-12-31',
    'พ้นจากตำแหน่ง',
    'ดำรงตำแหน่ง พ.ศ. 2546 ถึง พ.ศ. 2549'

where not exists (

    select 1
    from public.leaders
    where first_name='สมาน'
    and last_name='ศรีเมือง'

);


insert into public.leaders (

    first_name,
    last_name,
    position,
    start_date,
    end_date,
    status,
    description

)

select
    'สาคร',
    'ศรีชัยอินทร์',
    'ผู้ใหญ่บ้าน',
    '2006-01-01',
    '2014-12-31',
    'พ้นจากตำแหน่ง',
    'ดำรงตำแหน่ง พ.ศ. 2549 ถึง พ.ศ. 2557'

where not exists (

    select 1
    from public.leaders
    where first_name='สาคร'
    and last_name='ศรีชัยอินทร์'

);


insert into public.leaders (

    first_name,
    last_name,
    position,
    start_date,
    end_date,
    status,
    description

)

select
    'บุญธรรม',
    'ศรีเมือง',
    'ผู้ใหญ่บ้าน',
    '2014-01-01',
    '2016-12-31',
    'พ้นจากตำแหน่ง',
    'ดำรงตำแหน่ง พ.ศ. 2557 ถึง พ.ศ. 2559'

where not exists (

    select 1
    from public.leaders
    where first_name='บุญธรรม'
    and last_name='ศรีเมือง'

);


insert into public.leaders (

    first_name,
    last_name,
    position,
    start_date,
    end_date,
    status,
    description

)

select
    'สมเกียรติ',
    'อุปเสน',
    'ผู้ใหญ่บ้าน',
    '2016-01-01',
    '2025-12-31',
    'พ้นจากตำแหน่ง',
    'ดำรงตำแหน่ง พ.ศ. 2559 ถึง พ.ศ. 2568'

where not exists (

    select 1
    from public.leaders
    where first_name='สมเกียรติ'
    and last_name='อุปเสน'

);


insert into public.leaders (

    first_name,
    last_name,
    position,
    status,
    description

)

select
    'ศักรนนทน์',
    'ขัติย์วงศ์',
    'ผู้ใหญ่บ้าน',
    'ปัจจุบัน',
    'ดำรงตำแหน่งตั้งแต่ พ.ศ. 2568 ถึงปัจจุบัน'

where not exists (

    select 1
    from public.leaders
    where first_name='ศักรนนทน์'
    and last_name='ขัติย์วงศ์'

);


/* =========================================================
   14. CURRENT COMMUNITY LEADERS
   ========================================================= */

insert into public.community_organizations (

    organization_name,
    organization_type,
    role_description,
    member_count

)

select

    'กลุ่มผู้นำชุมชน',

    'ทางการ',

    'ดูแลการปกครอง ความสงบเรียบร้อย และการพัฒนาชุมชน',

    3

where not exists (

    select 1
    from public.community_organizations
    where organization_name='กลุ่มผู้นำชุมชน'

);


/* =========================================================
   15. COMMUNITY COMMITTEE
   ========================================================= */

insert into public.community_organizations (

    organization_name,
    organization_type,
    role_description,
    member_count

)

select

    'คณะกรรมการหมู่บ้าน',

    'ทางการ',

    'ช่วยงานผู้ใหญ่บ้านและร่วมวางแผนพัฒนาหมู่บ้าน',

    8

where not exists (

    select 1
    from public.community_organizations
    where organization_name='คณะกรรมการหมู่บ้าน'

);


/* =========================================================
   16. VILLAGE FUND
   ========================================================= */

insert into public.community_organizations (

    organization_name,
    organization_type,
    role_description,
    member_count

)

select

    'กองทุนหมู่บ้าน',

    'ทางการ',

    'เป็นแหล่งเงินทุนหมุนเวียนเพื่อพัฒนาอาชีพและสร้างรายได้',

    9

where not exists (

    select 1
    from public.community_organizations
    where organization_name='กองทุนหมู่บ้าน'

);


/* =========================================================
   17. VILLAGE HEALTH VOLUNTEERS
   ========================================================= */

insert into public.community_organizations (

    organization_name,
    organization_type,
    role_description,
    member_count

)

select

    'อาสาสมัครสาธารณสุขประจำหมู่บ้าน (อสม.)',

    'สุขภาพ',

    'ประสานงานด้านสุขภาพและดูแลครัวเรือนในพื้นที่',

    26

where not exists (

    select 1
    from public.community_organizations
    where organization_name='อาสาสมัครสาธารณสุขประจำหมู่บ้าน (อสม.)'

);


/* =========================================================
   18. INFORMAL GROUPS
   ========================================================= */

insert into public.community_organizations (

    organization_name,
    organization_type,
    role_description,
    member_count

)

select

    'กลุ่มแม่บ้าน',

    'ไม่เป็นทางการ',

    'รวมกลุ่มทำกิจกรรมและช่วยงานของหมู่บ้าน',

    15

where not exists (

    select 1
    from public.community_organizations
    where organization_name='กลุ่มแม่บ้าน'

);


insert into public.community_organizations (

    organization_name,
    organization_type,
    role_description,
    member_count

)

select

    'ชุดรักษาความปลอดภัยหมู่บ้าน (ชรบ.)',

    'ไม่เป็นทางการ',

    'ดูแลความปลอดภัยและความสงบเรียบร้อยในหมู่บ้าน',

    12

where not exists (

    select 1
    from public.community_organizations
    where organization_name='ชุดรักษาความปลอดภัยหมู่บ้าน (ชรบ.)'

);


insert into public.community_organizations (

    organization_name,
    organization_type,
    role_description,
    member_count

)

select

    'กลุ่มฌาปนกิจ',

    'ไม่เป็นทางการ',

    'ช่วยเหลือครอบครัวสมาชิกเมื่อมีผู้เสียชีวิต โดยเก็บเงินหลังคาเรือนละ 100 บาทต่อศพ',

    0

where not exists (

    select 1
    from public.community_organizations
    where organization_name='กลุ่มฌาปนกิจ'

);


/* =========================================================
   19. HEALTH SURVEY - SEX
   n = 22
   ========================================================= */

insert into public.health_survey_summary
(
    survey_year,
    sample_size,
    category,
    item_name,
    amount,
    percentage,
    note
)

select
    2568,
    22,
    'เพศ',
    'ชาย',
    5,
    23,
    'กลุ่มตัวอย่าง'

where not exists (
    select 1
    from public.health_survey_summary
    where survey_year=2568
    and category='เพศ'
    and item_name='ชาย'
);


/*หญิง*/

insert into public.health_survey_summary
(
    survey_year,
    sample_size,
    category,
    item_name,
    amount,
    percentage,
    note
)

select
    2568,
    22,
    'เพศ',
    'หญิง',
    17,
    77,
    'กลุ่มตัวอย่าง'

where not exists (
    select 1
    from public.health_survey_summary
    where survey_year=2568
    and category='เพศ'
    and item_name='หญิง'
);


/* =========================================================
   20. AGE
   ========================================================= */

insert into public.health_survey_summary
(
    survey_year,
    sample_size,
    category,
    item_name,
    amount,
    percentage,
    note
)

values

(
    2568,
    22,
    'อายุ',
    '40–60 ปี',
    2,
    9,
    'กลุ่มตัวอย่าง'
),

(
    2568,
    22,
    'อายุ',
    '61–80 ปี',
    18,
    82,
    'กลุ่มตัวอย่าง'
),

(
    2568,
    22,
    'อายุ',
    '81–90 ปี',
    2,
    9,
    'กลุ่มตัวอย่าง'
);


/* =========================================================
   21. OCCUPATION
   ========================================================= */

insert into public.health_survey_summary
(
    survey_year,
    sample_size,
    category,
    item_name,
    amount,
    percentage,
    note
)

values

(
    2568,
    22,
    'อาชีพ',
    'ไม่มีอาชีพ',
    8,
    36.36,
    'กลุ่มตัวอย่าง'
),

(
    2568,
    22,
    'อาชีพ',
    'เกษตรกรรม',
    10,
    45.47,
    'กลุ่มตัวอย่าง'
),

(
    2568,
    22,
    'อาชีพ',
    'ข้าราชการ',
    1,
    4.54,
    'กลุ่มตัวอย่าง'
),

(
    2568,
    22,
    'อาชีพ',
    'ค้าขาย',
    3,
    13.63,
    'กลุ่มตัวอย่าง'
);


/* =========================================================
   22. CHRONIC CONDITIONS
   ========================================================= */

insert into public.health_survey_summary
(
    survey_year,
    sample_size,
    category,
    item_name,
    amount,
    percentage,
    note
)

values

(2568,22,'โรคประจำตัว','ไม่มี',5,22.72,'กลุ่มตัวอย่าง'),

(2568,22,'โรคประจำตัว','มีโรคประจำตัว',17,77.28,'กลุ่มตัวอย่าง'),

(2568,22,'โรคประจำตัว','เบาหวาน',1,4.54,'กลุ่มตัวอย่าง'),

(2568,22,'โรคประจำตัว','ความดันโลหิต',8,36.36,'กลุ่มตัวอย่าง'),

(2568,22,'โรคประจำตัว','ไขมันในเลือดสูง',2,9.09,'กลุ่มตัวอย่าง'),

(2568,22,'โรคประจำตัว','ปวดเมื่อย',2,9.09,'กลุ่มตัวอย่าง'),

(2568,22,'โรคประจำตัว','ไต',1,4.54,'กลุ่มตัวอย่าง'),

(2568,22,'โรคประจำตัว','เก๊า',1,4.54,'กลุ่มตัวอย่าง'),

(2568,22,'โรคประจำตัว','กระดูกพรุน',1,4.54,'กลุ่มตัวอย่าง'),

(2568,22,'โรคประจำตัว','หอบหืด',1,4.54,'กลุ่มตัวอย่าง');


/* =========================================================
   23. SMOKING
   ========================================================= */

insert into public.health_survey_summary
(
    survey_year,
    sample_size,
    category,
    item_name,
    amount,
    percentage,
    note
)

values

(2568,22,'การสูบบุหรี่','ไม่สูบ',19,86.36,'กลุ่มตัวอย่าง'),

(2568,22,'การสูบบุหรี่','สูบ',3,16.63,'ตามตารางในรายงาน');


/* =========================================================
   24. ALCOHOL
   ========================================================= */

insert into public.health_survey_summary
(
    survey_year,
    sample_size,
    category,
    item_name,
    amount,
    percentage,
    note
)

values

(2568,22,'การดื่มสุรา','ไม่ดื่ม',18,81.81,'กลุ่มตัวอย่าง'),

(2568,22,'การดื่มสุรา','ดื่ม',4,18.18,'กลุ่มตัวอย่าง');


/* =========================================================
   25. COMMUNITY HEALTH PROBLEMS
   ========================================================= */

insert into public.community_health_problems
(
    problem_name,
    size_score,
    severity_score,
    difficulty_score,
    awareness_score,
    total_addition,
    total_multiplication,
    priority_rank,
    source_document
)

values

(
    'ความดันโลหิต',
    2,3,1,3,
    8,18,1,
    'รายงานผลการวินิจฉัยชุมชน ปีการศึกษา 2568'
),

(
    'ไขมันในเลือดสูง',
    1,2,2,4,
    7,16,2,
    'รายงานผลการวินิจฉัยชุมชน ปีการศึกษา 2568'
),

(
    'ปวดเมื่อยร่างกาย',
    1,2,1,4,
    8,8,3,
    'รายงานผลการวินิจฉัยชุมชน ปีการศึกษา 2568'
),

(
    'เบาหวาน',
    1,2,1,3,
    7,6,4,
    'รายงานผลการวินิจฉัยชุมชน ปีการศึกษา 2568'
),

(
    'สูบบุหรี่',
    1,1,2,2,
    6,4,5,
    'รายงานผลการวินิจฉัยชุมชน ปีการศึกษา 2568'
),

(
    'ดื่มแอลกอฮอล์',
    1,1,1,2,
    5,2,6,
    'รายงานผลการวินิจฉัยชุมชน ปีการศึกษา 2568'
);


/* =========================================================
   26. EPIDEMIOLOGY
   ข้อมูลระดับอำเภอเมืองพะเยา
   ไม่ใช่ข้อมูลเฉพาะหมู่บ้าน
   ========================================================= */

insert into public.epidemiology_surveillance
(
    disease_code,
    disease_name,
    amount,
    area,
    start_date,
    end_date,
    source_document
)

values

(
    'J09-J11',
    'ไข้หวัดใหญ่',
    34,
    'อำเภอเมืองพะเยา จังหวัดพะเยา',
    '2025-02-23',
    '2025-03-01',
    'รายงานผลการวินิจฉัยชุมชน'
),

(
    'J679',
    'ปอดอักเสบ',
    24,
    'อำเภอเมืองพะเยา จังหวัดพะเยา',
    '2025-02-23',
    '2025-03-01',
    'รายงานผลการวินิจฉัยชุมชน'
),

(
    'A05',
    'อาหารเป็นพิษ',
    5,
    'อำเภอเมืองพะเยา จังหวัดพะเยา',
    '2025-02-23',
    '2025-03-01',
    'รายงานผลการวินิจฉัยชุมชน'
);


/* =========================================================
   27. COMMUNITY HISTORY
   ========================================================= */

insert into public.community_history
(
    year_buddhist,
    title,
    description,
    sort_order,
    source_document
)

values

(
    2512,
    'ก่อสร้างวัดเวฬุวัน',
    'ก่อสร้างวัดเวฬุวัน (วัดร่องเข็ม)',
    1,
    'รายงานผลการวินิจฉัยชุมชน'
),

(
    2518,
    'แยกเป็นบ้านร่องเข็ม',
    'แยกออกจากหมู่ที่ 1 บ้านดาวเรือง',
    2,
    'รายงานผลการวินิจฉัยชุมชน'
),

(
    2522,
    'สร้างอุโบสถ',
    'สร้างอุโบสถวัดร่องเข็ม',
    3,
    'รายงานผลการวินิจฉัยชุมชน'
),

(
    2528,
    'ขึ้นทะเบียนตั้งวัด',
    'ยกฐานขึ้นทะเบียนตั้งวัด',
    4,
    'รายงานผลการวินิจฉัยชุมชน'
),

(
    2535,
    'ได้รับพระราชทานวิสุงคามสีมา',
    'ได้รับพระราชทานวิสุงคามสีมา',
    5,
    'รายงานผลการวินิจฉัยชุมชน'
);


/* =========================================================
   28. COMMUNITY PROJECT
   ========================================================= */

insert into public.community_projects
(
    project_name,
    target_households,
    budget,
    start_date,
    end_date,
    location,
    description,
    expected_result
)

values

(
    'โครงการเสริมสร้างสุขภาพลดปัญหาไขมันในเลือด',
    21,
    1040,
    '2025-08-20',
    '2025-09-30',
    'ชุมชนบ้านร่องเข็ม',
    'ส่งเสริมความรู้และพฤติกรรมสุขภาพเพื่อลดความเสี่ยงภาวะไขมันในเลือดสูง',
    'ประชาชนมีความรู้และสามารถปรับพฤติกรรมสุขภาพได้เหมาะสม'
);


/* =========================================================
   29. SOURCE TAG
   ========================================================= */

alter table public.statistics
add column if not exists source_document text;

update public.statistics

set source_document =
'รายงานผลการวินิจฉัยชุมชน บ้านร่องเข็ม หมู่ 6 ปีการศึกษา 2568'

where year = 2568;


/* =========================================================
   30. RLS
   ========================================================= */

alter table public.source_documents
enable row level security;

alter table public.community_history
enable row level security;

alter table public.community_organizations
enable row level security;

alter table public.community_members
enable row level security;

alter table public.health_survey_summary
enable row level security;

alter table public.community_health_problems
enable row level security;

alter table public.epidemiology_surveillance
enable row level security;

alter table public.community_calendar
enable row level security;

alter table public.community_projects
enable row level security;


/* =========================================================
   31. PUBLIC READ
   ========================================================= */

create policy
"source_documents_read"

on public.source_documents

for select

to anon, authenticated

using (true);


create policy
"community_history_read"

on public.community_history

for select

to anon, authenticated

using (true);


create policy
"community_organizations_read"

on public.community_organizations

for select

to anon, authenticated

using (true);


create policy
"community_members_read"

on public.community_members

for select

to anon, authenticated

using (true);


create policy
"health_survey_summary_read"

on public.health_survey_summary

for select

to anon, authenticated

using (true);


create policy
"community_health_problems_read"

on public.community_health_problems

for select

to anon, authenticated

using (true);


create policy
"epidemiology_surveillance_read"

on public.epidemiology_surveillance

for select

to anon, authenticated

using (true);


create policy
"community_calendar_read"

on public.community_calendar

for select

to anon, authenticated

using (true);


create policy
"community_projects_read"

on public.community_projects

for select

to anon, authenticated

using (true);


/* =========================================================
   FINISHED
   ========================================================= */

select
'RONGKHEM MASTER DATA FROM REPORT READY'
as status;
