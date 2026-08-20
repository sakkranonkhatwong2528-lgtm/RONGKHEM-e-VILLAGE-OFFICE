import { supabase }
from './supabase-config.js';


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

const titleInput =
document.getElementById('titleInput');

const detailInput =
document.getElementById('detailInput');

const imageInput =
document.getElementById('imageInput');

const currentImageUrl =
document.getElementById('currentImageUrl');

const imagePreview =
document.getElementById('imagePreview');

const imagePreviewContainer =
document.getElementById(
'imagePreviewContainer'
);

const tableBody =
document.getElementById('tableBody');

const resetBtn =
document.getElementById('resetBtn');


async function checkLogin(){

const {
data:{user}
}
=
await supabase.auth.getUser();

if(!user){

window.location.href =
'login.html';

return;

}

adminEmail.textContent =
user.email;

}


async function loadData(){

const table =
menuSelect.value;


tableBody.innerHTML = `

<tr>
<td colspan="5"
style="text-align:center">

กำลังโหลดข้อมูล...

</td>
</tr>

`;


const {
data,
error
}
=
await supabase
.from(table)
.select('*')
.order('id',{
ascending:false
});


if(error){

tableBody.innerHTML = `

<tr>

<td colspan="5">

เกิดข้อผิดพลาด:
${error.message}

</td>

</tr>

`;

return;

}


renderTable(data);

}


function renderTable(data){

tableBody.innerHTML = '';


if(!data.length){

tableBody.innerHTML = `

<tr>

<td
colspan="5"
style="text-align:center">

ยังไม่มีข้อมูล

</td>

</tr>

`;

return;

}


data.forEach(item=>{

const image =
item.image_url
?
`<img
src="${item.image_url}"
class="img-preview">`
:
'-';


const tr =
document.createElement('tr');


tr.innerHTML = `

<td>
${item.id}
</td>

<td>
${image}
</td>

<td>
${escapeHtml(item.title)}
</td>

<td>
${escapeHtml(item.detail || '')}
</td>

<td>

<button
class="btn-edit">

✏️

</button>

<button
class="btn-delete">

🗑️

</button>

</td>

`;


tr.querySelector('.btn-edit')
.addEventListener(
'click',
()=>editData(item)
);


tr.querySelector('.btn-delete')
.addEventListener(
'click',
()=>deleteData(item.id)
);


tableBody.appendChild(tr);

});

}


imageInput.addEventListener(
'change',
()=>{

const file =
imageInput.files[0];

if(!file)return;

imagePreview.src =
URL.createObjectURL(file);

imagePreviewContainer.style.display =
'block';

}
);


async function uploadImage(file){

if(!file){

return currentImageUrl.value || null;

}


const extension =
file.name.split('.').pop();


const fileName =
`${Date.now()}-${crypto.randomUUID()}.${extension}`;


const path =
`uploads/${fileName}`;


const {
error
}
=
await supabase.storage
.from('village-images')
.upload(
path,
file
);


if(error){

throw error;

}


const {
data
}
=
supabase.storage
.from('village-images')
.getPublicUrl(path);


return data.publicUrl;

}


crudForm.addEventListener(
'submit',
async(e)=>{

e.preventDefault();


const table =
menuSelect.value;


try{

const imageUrl =
await uploadImage(
imageInput.files[0]
);


const payload = {

title:
titleInput.value.trim(),

detail:
detailInput.value.trim(),

image_url:
imageUrl

};


let result;


if(recordId.value){

result =
await supabase
.from(table)
.update(payload)
.eq(
'id',
recordId.value
);

}else{

result =
await supabase
.from(table)
.insert([payload]);

}


if(result.error){

throw result.error;

}


alert(
recordId.value
?
'แก้ไขข้อมูลเรียบร้อย'
:
'เพิ่มข้อมูลเรียบร้อย'
);


resetForm();

loadData();

}
catch(error){

alert(
'เกิดข้อผิดพลาด: '+
error.message
);

}

}
);


function editData(item){

recordId.value =
item.id;

titleInput.value =
item.title || '';

detailInput.value =
item.detail || '';

currentImageUrl.value =
item.image_url || '';


if(item.image_url){

imagePreview.src =
item.image_url;

imagePreviewContainer.style.display =
'block';

}


document.getElementById(
'formTitle'
).textContent =
'✏️ แก้ไขข้อมูล';

window.scrollTo({

top:0,

behavior:'smooth'

});

}


async function deleteData(id){

if(!confirm(
'ยืนยันการลบข้อมูล?'
))return;


const {
error
}
=
await supabase
.from(
menuSelect.value
)
.delete()
.eq(
'id',
id
);


if(error){

alert(
'ลบไม่สำเร็จ: '+
error.message
);

return;

}


alert(
'ลบข้อมูลเรียบร้อย'
);

loadData();

}


function resetForm(){

crudForm.reset();

recordId.value = '';

currentImageUrl.value = '';

imagePreview.src = '';

imagePreviewContainer.style.display =
'none';

document.getElementById(
'formTitle'
).textContent =
'➕ เพิ่มข้อมูลใหม่';

}


menuSelect.addEventListener(
'change',
()=>{

resetForm();

loadData();

}
);


resetBtn.addEventListener(
'click',
resetForm
);


logoutBtn.addEventListener(
'click',
async()=>{

await supabase.auth.signOut();

window.location.href =
'login.html';

}
);


async function init(){

await checkLogin();

await loadData();

}


init();
