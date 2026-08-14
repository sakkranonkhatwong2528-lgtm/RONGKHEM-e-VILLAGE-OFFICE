-- สร้างหรืออัปเดตตารางข้อมูลสรุปสถิติหมู่บ้าน (Village Summary)
CREATE TABLE IF NOT EXISTS village_summary (
    id SERIAL PRIMARY KEY,
    total_citizens INT DEFAULT 0,
    male_citizens INT DEFAULT 0,
    female_citizens INT DEFAULT 0,
    total_households INT DEFAULT 0,
    elderly_count INT DEFAULT 0,
    disabled_count INT DEFAULT 0,
    chronic_illness_count INT DEFAULT 0,
    vulnerable_items INT DEFAULT 0,
    survey_count INT DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- แทรกข้อมูลหรืออัปเดตข้อมูลชุดปัจจุบัน
INSERT INTO village_summary (
    id, total_citizens, male_citizens, female_citizens, 
    total_households, elderly_count, disabled_count, 
    chronic_illness_count, vulnerable_items, survey_count
) VALUES (
    1, 960, 471, 489, 352, 92, 3, 1, 95, 202
)
ON CONFLICT (id) DO UPDATE SET
    total_citizens = EXCLUDED.total_citizens,
    male_citizens = EXCLUDED.male_citizens,
    female_citizens = EXCLUDED.female_citizens,
    total_households = EXCLUDED.total_households,
    elderly_count = EXCLUDED.elderly_count,
    disabled_count = EXCLUDED.disabled_count,
    chronic_illness_count = EXCLUDED.chronic_illness_count,
    vulnerable_items = EXCLUDED.vulnerable_items,
    survey_count = EXCLUDED.survey_count,
    updated_at = CURRENT_TIMESTAMP;
