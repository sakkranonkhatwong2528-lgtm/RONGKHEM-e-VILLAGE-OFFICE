// ==========================================
// RONGKHEM e-VILLAGE
// manage-admin.js
// ระบบเพิ่ม / แก้ไข / ลบ ข้อมูล
// ==========================================

import { createClient } from
'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';


// ==========================================
// 1. ตั้งค่า Supabase
// ==========================================

const SUPABASE_URL = 'ใส่_SUPABASE_URL_ของคุณ';

const SUPABASE_ANON_KEY =
'ใส่_SUPABASE_ANON_KEY_ของคุณ';


const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);


// ==========================================
// 2. ตัวแปร DOM
// ==========================================

const adminEmail =
    document.getElementById('adminEmail');

const logoutBtn =
    document.getElementById('logoutBtn');

const menuSelect =
    document.getElementById('menuSelect');

const crudForm =
    document.getElementById('crudForm');

const recordId =
    document.getElementById('recordId');

const currentImageUrl =
    document.getElementById('currentImageUrl');

const titleInput =
    document.getElementById('titleInput');

const detailInput =
    document.getElementById('detailInput');

const imageInput =
    document.getElementById('imageInput');

const imagePreview =
    document.getElementById('imagePreview');

const imagePreviewContainer =
    document.getElementById(
        'imagePreviewContainer'
    );

const resetBtn =
    document.getElementById('resetBtn');

const tableBody =
    document.getElementById('tableBody');

const formTitle =
    document.getElementById('formTitle');


// ==========================================
// 3. ตรวจสอบการ Login
// ==========================================

async function checkLogin() {

    const {
        data: { user }
    } = await supabase.auth.getUser();


    if (!user) {

        alert(
            'กรุณาเข้าสู่ระบบก่อนใช้งาน'
        );

        window.location.href =
            'login.html';

        return;
    }


    adminEmail.textContent =
        user.email;

}


// ==========================================
// 4. ออกจากระบบ
// ==========================================

logoutBtn.addEventListener(
    'click',
    async () => {

        const confirmLogout =
            confirm(
                'ต้องการออกจากระบบใช่หรือไม่?'
            );


        if (!confirmLogout) return;


        const {
            error
        } =
        await supabase.auth.signOut();


        if (error) {

            alert(
                'ไม่สามารถออกจากระบบได้'
            );

            return;
        }


        window.location.href =
            'login.html';

    }
);


// ==========================================
// 5. โหลดข้อมูล
// ==========================================

async function loadData() {

    const tableName =
        menuSelect.value;


    tableBody.innerHTML = `

        <tr>
            <td colspan="5"
                style="
                    text-align:center;
                    padding:20px;
                "
            >
                กำลังโหลดข้อมูล...
            </td>
        </tr>

    `;


    const {
        data,
        error
    } =
    await supabase
        .from(tableName)
        .select('*')
        .order(
            'id',
            {
                ascending: false
            }
        );


    if (error) {

        console.error(error);


        tableBody.innerHTML = `

            <tr>

                <td colspan="5"
                    style="
                        text-align:center;
                        color:red;
                        padding:20px;
                    "
                >

                    เกิดข้อผิดพลาด:
                    ${error.message}

                </td>

            </tr>

        `;

        return;
    }


    renderTable(data);

}


// ==========================================
// 6. แสดงข้อมูลในตาราง
// ==========================================

function renderTable(data) {

    if (!data || data.length === 0) {

        tableBody.innerHTML = `

            <tr>

                <td colspan="5"
                    style="
                        text-align:center;
                        padding:20px;
                        color:#888;
                    "
                >

                    ยังไม่มีข้อมูล

                </td>

            </tr>

        `;

        return;

    }


    tableBody.innerHTML = '';


    data.forEach(item => {

        const imageUrl =
            item.image_url ||
            item.image ||
            '';


        const imageHtml =
            imageUrl
            ?
            `

            <img
                src="${imageUrl}"
                class="img-preview"
                alt="รูปภาพ"
            >

            `
            :
            'ไม่มีรูป';


        const row =
            document.createElement('tr');


        row.innerHTML = `

            <td>

                ${item.id}

            </td>


            <td>

                ${imageHtml}

            </td>


            <td>

                ${escapeHtml(
                    item.title ||
                    item.name ||
                    ''
                )}

            </td>


            <td>

                ${escapeHtml(
                    item.detail ||
                    item.description ||
                    ''
                )}

            </td>


            <td
                style="
                    text-align:center;
                "
            >

                <button
                    class="btn-edit"
                    data-id="${item.id}"
                >

                    ✏️ แก้ไข

                </button>


                <button
                    class="btn-delete"
                    data-id="${item.id}"
                >

                    🗑️ ลบ

                </button>

            </td>

        `;


        const editButton =
            row.querySelector(
                '.btn-edit'
            );


        const deleteButton =
            row.querySelector(
                '.btn-delete'
            );


        editButton.addEventListener(
            'click',
            () => editData(item)
        );


        deleteButton.addEventListener(
            'click',
            () =>
                deleteData(item.id)
        );


        tableBody.appendChild(row);

    });

}


// ==========================================
// ป้องกัน HTML Injection
// ==========================================

function escapeHtml(text) {

    if (!text) return '';


    return String(text)

        .replace(
            /&/g,
            '&amp;'
        )

        .replace(
            /</g,
            '&lt;'
        )

        .replace(
            />/g,
            '&gt;'
        )

        .replace(
            /"/g,
            '&quot;'
        )

        .replace(
            /'/g,
            '&#039;'
        );

}


// ==========================================
// 7. เปลี่ยนเมนู
// ==========================================

menuSelect.addEventListener(
    'change',
    () => {

        resetForm();

        loadData();

    }
);


// ==========================================
// 8. เลือกรูปภาพ Preview
// ==========================================

imageInput.addEventListener(
    'change',
    () => {

        const file =
            imageInput.files[0];


        if (!file) return;


        const imageUrl =
            URL.createObjectURL(file);


        imagePreview.src =
            imageUrl;


        imagePreviewContainer.style.display =
            'block';

    }
);


// ==========================================
// 9. อัปโหลดรูปภาพ
// ==========================================

async function uploadImage(file) {

    if (!file) {

        return currentImageUrl.value ||
            null;

    }


    const fileExtension =
        file.name
            .split('.')
            .pop();


    const fileName =

        `${Date.now()}-${Math.random()
            .toString(36)
            .substring(2)}.${fileExtension}`;


    const filePath =

        `uploads/${fileName}`;


    const {
        error
    } =
    await supabase.storage

        .from('village-images')

        .upload(
            filePath,
            file
        );


    if (error) {

        console.error(error);

        throw new Error(
            'อัปโหลดรูปภาพไม่สำเร็จ'
        );

    }


    const {
        data
    } =
    supabase.storage

        .from('village-images')

        .getPublicUrl(
            filePath
        );


    return data.publicUrl;

}


// ==========================================
// 10. เพิ่ม / แก้ไขข้อมูล
// ==========================================

crudForm.addEventListener(
    'submit',
    async event => {

        event.preventDefault();


        const tableName =
            menuSelect.value;


        const id =
            recordId.value;


        const file =
            imageInput.files[0];


        const saveButton =
            document.getElementById(
                'saveBtn'
            );


        saveButton.disabled =
            true;


        saveButton.textContent =
            'กำลังบันทึก...';


        try {

            const imageUrl =
                await uploadImage(
                    file
                );


            const payload = {

                title:
                    titleInput.value
                        .trim(),

                detail:
                    detailInput.value
                        .trim(),

                image_url:
                    imageUrl

            };


            let result;


            // ==========================
            // เพิ่มข้อมูลใหม่
            // ==========================

            if (!id) {

                result =
                    await supabase

                        .from(tableName)

                        .insert(
                            [payload]
                        );

            }


            // ==========================
            // แก้ไขข้อมูล
            // ==========================

            else {

                result =
                    await supabase

                        .from(tableName)

                        .update(
                            payload
                        )

                        .eq(
                            'id',
                            id
                        );

            }


            if (result.error) {

                throw result.error;

            }


            alert(

                id
                ?
                'แก้ไขข้อมูลเรียบร้อยแล้ว'
                :
                'เพิ่มข้อมูลเรียบร้อยแล้ว'

            );


            resetForm();


            await loadData();


        }

        catch (error) {

            console.error(error);


            alert(

                'เกิดข้อผิดพลาด: ' +
                error.message

            );

        }

        finally {

            saveButton.disabled =
                false;


            saveButton.textContent =
                'บันทึกข้อมูล';

        }

    }
);


// ==========================================
// 11. แก้ไขข้อมูล
// ==========================================

function editData(item) {

    recordId.value =
        item.id;


    titleInput.value =
        item.title ||
        item.name ||
        '';


    detailInput.value =
        item.detail ||
        item.description ||
        '';


    const imageUrl =
        item.image_url ||
        item.image ||
        '';


    currentImageUrl.value =
        imageUrl;


    if (imageUrl) {

        imagePreview.src =
            imageUrl;


        imagePreviewContainer.style.display =
            'block';

    }


    formTitle.textContent =
        '✏️ แก้ไขข้อมูล';


    document
        .querySelector(
            '.form-section'
        )

        .scrollIntoView({

            behavior:
                'smooth'

        });

}


// ==========================================
// 12. ลบข้อมูล
// ==========================================

async function deleteData(id) {

    const tableName =
        menuSelect.value;


    const confirmDelete =
        confirm(

            'คุณต้องการลบข้อมูลนี้ใช่หรือไม่?'

        );


    if (!confirmDelete) return;


    const {
        error
    } =
    await supabase

        .from(tableName)

        .delete()

        .eq(
            'id',
            id
        );


    if (error) {

        console.error(error);


        alert(

            'ลบข้อมูลไม่สำเร็จ: ' +
            error.message

        );


        return;

    }


    alert(
        'ลบข้อมูลเรียบร้อยแล้ว'
    );


    await loadData();

}


// ==========================================
// 13. รีเซ็ตฟอร์ม
// ==========================================

function resetForm() {

    crudForm.reset();


    recordId.value = '';


    currentImageUrl.value = '';


    imagePreview.src = '';


    imagePreviewContainer.style.display =
        'none';


    formTitle.textContent =
        '➕ เพิ่มข้อมูลใหม่';

}


// ==========================================
// 14. ปุ่มยกเลิก
// ==========================================

resetBtn.addEventListener(
    'click',
    resetForm
);


// ==========================================
// 15. เริ่มระบบ
// ==========================================

async function init() {

    await checkLogin();

    await loadData();

}


init();
