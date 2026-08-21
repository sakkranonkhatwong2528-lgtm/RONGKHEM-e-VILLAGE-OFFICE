import { supabase } from './supabase-config.js';

// ==========================================
// RONGKHEM e-VILLAGE OFFICE
// ADMIN CRUD SYSTEM
// ==========================================

const menuSelect = document.getElementById('menuSelect');
const crudForm = document.getElementById('crudForm');

const recordId = document.getElementById('recordId');
const currentImageUrl = document.getElementById('currentImageUrl');

const titleInput = document.getElementById('titleInput');
const detailInput = document.getElementById('detailInput');
const imageInput = document.getElementById('imageInput');

const imagePreviewContainer =
    document.getElementById('imagePreviewContainer');

const imagePreview =
    document.getElementById('imagePreview');

const formTitle =
    document.getElementById('formTitle');

const saveBtn =
    document.getElementById('saveBtn');

const resetBtn =
    document.getElementById('resetBtn');

const logoutBtn =
    document.getElementById('logoutBtn');

const adminEmail =
    document.getElementById('adminEmail');

const tableBody =
    document.getElementById('tableBody');


// ==========================================
// ตรวจสอบการ Login
// ==========================================

async function checkLogin() {

    const {
        data: { session },
        error
    } = await supabase.auth.getSession();

    if (error) {
        console.error(error);
    }

    if (!session) {

        window.location.href =
            'admin-login.html';

        return;
    }

    adminEmail.textContent =
        session.user.email;

}


// ==========================================
// โหลดข้อมูลจาก Supabase
// ==========================================

async function loadData() {

    const tableName =
        menuSelect.value;

    tableBody.innerHTML = `
        <tr>
            <td colspan="5"
                style="text-align:center">
                กำลังโหลดข้อมูล...
            </td>
        </tr>
    `;

    try {

        const {
            data,
            error
        } = await supabase
            .from(tableName)
            .select('*')
            .order('id', {
                ascending: false
            });

        if (error) {
            throw error;
        }

        if (!data || data.length === 0) {

            tableBody.innerHTML = `
                <tr>
                    <td colspan="5"
                        style="text-align:center">
                        ยังไม่มีข้อมูล
                    </td>
                </tr>
            `;

            return;
        }


        tableBody.innerHTML = '';

        data.forEach(function(item) {

            const tr =
                document.createElement('tr');


            const imageHtml =
                item.image_url
                    ? `
                    <img
                        src="${escapeHtml(item.image_url)}"
                        class="img-preview"
                        alt="รูปภาพ"
                    >
                    `
                    : 'ไม่มีรูป';


            tr.innerHTML = `

                <td>
                    ${item.id ?? '-'}
                </td>

                <td>
                    ${imageHtml}
                </td>

                <td>
                    ${escapeHtml(item.title ?? '')}
                </td>

                <td>
                    ${escapeHtml(item.detail ?? '')}
                </td>

                <td>

                    <button
                        class="btn-edit"
                        data-action="edit"
                        data-id="${item.id}">
                        ✏️ แก้ไข
                    </button>

                    <button
                        class="btn-delete"
                        data-action="delete"
                        data-id="${item.id}">
                        🗑 ลบ
                    </button>

                </td>

            `;

            tableBody.appendChild(tr);

        });

    }

    catch (error) {

        console.error(error);

        tableBody.innerHTML = `
            <tr>
                <td colspan="5"
                    style="text-align:center;color:red">

                    ❌ โหลดข้อมูลไม่สำเร็จ<br>
                    ${escapeHtml(error.message)}

                </td>
            </tr>
        `;

    }

}


// ==========================================
// Upload รูปภาพ
// ==========================================

async function uploadImage(file) {

    if (!file) {
        return null;
    }


    const extension =
        file.name.split('.').pop();

    const fileName =
        `${Date.now()}-${crypto.randomUUID()}.${extension}`;


    const filePath =
        `uploads/${fileName}`;


    const {
        error
    } = await supabase
        .storage
        .from('village-images')
        .upload(
            filePath,
            file,
            {
                upsert: false
            }
        );


    if (error) {
        throw error;
    }


    const {
        data
    } = supabase
        .storage
        .from('village-images')
        .getPublicUrl(filePath);


    return data.publicUrl;

}


// ==========================================
// เพิ่มข้อมูล / แก้ไขข้อมูล
// ==========================================

crudForm.addEventListener(
    'submit',
    async function(event) {

        event.preventDefault();


        const tableName =
            menuSelect.value;

        const title =
            titleInput.value.trim();

        const detail =
            detailInput.value.trim();

        const id =
            recordId.value;


        if (!title) {

            alert(
                'กรุณากรอกหัวข้อ'
            );

            return;

        }


        saveBtn.disabled = true;

        const oldButtonText =
            saveBtn.textContent;

        saveBtn.textContent =
            'กำลังบันทึก...';


        try {

            let imageUrl =
                currentImageUrl.value || null;


            if (
                imageInput.files &&
                imageInput.files.length > 0
            ) {

                imageUrl =
                    await uploadImage(
                        imageInput.files[0]
                    );

            }


            const payload = {

                title: title,

                detail: detail,

                image_url: imageUrl,

                updated_at:
                    new Date()
                        .toISOString()

            };


            if (id) {

                const {
                    error
                } = await supabase
                    .from(tableName)
                    .update(payload)
                    .eq(
                        'id',
                        id
                    );

                if (error) {
                    throw error;
                }


                alert(
                    '✅ แก้ไขข้อมูลสำเร็จ'
                );

            }

            else {

                delete payload.updated_at;


                const {
                    error
                } = await supabase
                    .from(tableName)
                    .insert({
                        ...payload,
                        created_at:
                            new Date()
                                .toISOString()
                    });

                if (error) {
                    throw error;
                }


                alert(
                    '✅ เพิ่มข้อมูลสำเร็จ'
                );

            }


            resetForm();

            await loadData();

        }

        catch (error) {

            console.error(error);

            alert(
                '❌ บันทึกไม่สำเร็จ\n\n' +
                error.message
            );

        }

        finally {

            saveBtn.disabled =
                false;

            saveBtn.textContent =
                oldButtonText;

        }

    }
);


// ==========================================
// แก้ไข / ลบ
// ==========================================

tableBody.addEventListener(
    'click',
    async function(event) {

        const button =
            event.target.closest('button');

        if (!button) {
            return;
        }


        const action =
            button.dataset.action;

        const id =
            button.dataset.id;


        if (!action || !id) {
            return;
        }


        const tableName =
            menuSelect.value;


        // ==========================
        // EDIT
        // ==========================

        if (action === 'edit') {

            try {

                const {
                    data,
                    error
                } = await supabase
                    .from(tableName)
                    .select('*')
                    .eq('id', id)
                    .single();


                if (error) {
                    throw error;
                }


                recordId.value =
                    data.id;

                currentImageUrl.value =
                    data.image_url || '';

                titleInput.value =
                    data.title || '';

                detailInput.value =
                    data.detail || '';


                if (data.image_url) {

                    imagePreview.src =
                        data.image_url;

                    imagePreviewContainer.style.display =
                        'block';

                }

                else {

                    imagePreviewContainer.style.display =
                        'none';

                }


                formTitle.textContent =
                    '✏️ แก้ไขข้อมูล ID: ' +
                    data.id;


                saveBtn.textContent =
                    '💾 บันทึกการแก้ไข';


                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });

            }

            catch (error) {

                console.error(error);

                alert(
                    '❌ ไม่สามารถโหลดข้อมูลได้\n\n' +
                    error.message
                );

            }

        }


        // ==========================
        // DELETE
        // ==========================

        if (action === 'delete') {

            const confirmDelete =
                confirm(
                    '⚠️ ยืนยันการลบข้อมูลนี้?\n\n' +
                    'เมื่อลบแล้วจะไม่สามารถกู้คืนได้'
                );


            if (!confirmDelete) {
                return;
            }


            try {

                const {
                    error
                } = await supabase
                    .from(tableName)
                    .delete()
                    .eq(
                        'id',
                        id
                    );


                if (error) {
                    throw error;
                }


                alert(
                    '🗑 ลบข้อมูลสำเร็จ'
                );


                if (
                    recordId.value === id
                ) {

                    resetForm();

                }


                await loadData();

            }

            catch (error) {

                console.error(error);

                alert(
                    '❌ ลบข้อมูลไม่สำเร็จ\n\n' +
                    error.message
                );

            }

        }

    }
);


// ==========================================
// เปลี่ยนเมนู
// ==========================================

menuSelect.addEventListener(
    'change',
    function() {

        resetForm();

        loadData();

    }
);


// ==========================================
// Preview รูป
// ==========================================

imageInput.addEventListener(
    'change',
    function() {

        const file =
            imageInput.files[0];


        if (!file) {
            return;
        }


        const reader =
            new FileReader();


        reader.onload =
            function(event) {

                imagePreview.src =
                    event.target.result;

                imagePreviewContainer.style.display =
                    'block';

            };


        reader.readAsDataURL(
            file
        );

    }
);


// ==========================================
// Reset Form
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


    saveBtn.textContent =
        '💾 บันทึกข้อมูล';

}


// ==========================================
// ปุ่มยกเลิก
// ==========================================

resetBtn.addEventListener(
    'click',
    function() {

        resetForm();

    }
);


// ==========================================
// Logout
// ==========================================

logoutBtn.addEventListener(
    'click',
    async function() {

        const confirmLogout =
            confirm(
                'ต้องการออกจากระบบหรือไม่?'
            );


        if (!confirmLogout) {
            return;
        }


        try {

            const {
                error
            } = await supabase
                .auth
                .signOut();


            if (error) {
                throw error;
            }


            window.location.href =
                'admin-login.html';

        }

        catch (error) {

            console.error(error);

            alert(
                'ออกจากระบบไม่สำเร็จ'
            );

        }

    }
);


// ==========================================
// ป้องกัน HTML Injection
// ==========================================

function escapeHtml(value) {

    return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');

}


// ==========================================
// เริ่มระบบ
// ==========================================

async function startApp() {

    await checkLogin();

    await loadData();

}

startApp();
