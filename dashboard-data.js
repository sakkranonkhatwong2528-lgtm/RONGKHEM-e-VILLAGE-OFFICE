// ข้อมูลสถิติหมู่บ้านร้องเข็ม (อัปเดตล่าสุด)
const villageData = {
    citizens: {
        total: 960,
        male: 471,
        female: 489
    },
    households: 352,
    specialGroups: {
        elderly: 92,
        disabled: 3,
        chronicIllness: 1,
        vulnerableTotal: 95
    },
    surveysCompleted: 202
};

// นำออกข้อมูลสำหรับเรียกใช้งานในหน้า HTML ต่างๆ
if (typeof module !== 'undefined' && module.exports) {
    module.exports = villageData;
}
