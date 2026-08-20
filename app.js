import { supabase }
from './supabase-config.js';


async function getData(
table
){

const {
data,
error
}
=
await supabase
.from(table)
.select('*')
.order(
'id',
{
ascending:false
}
);


if(error){

console.error(
table,
error
);

return [];

}


return data;

}


async function loadNews(){

const data =
await getData('news');


const container =
document.getElementById(
'newsContainer'
);


if(!container)return;


container.innerHTML = '';


data.forEach(item=>{

container.innerHTML += `

<div class="news-card">

${item.image_url
?
`<img src="${item.image_url}">`
:
''
}

<h3>
${item.title}
</h3>

<p>
${item.detail || ''}
</p>

</div>

`;

});

}


async function loadActivity(){

const data =
await getData('activity');


const container =
document.getElementById(
'activityContainer'
);


if(!container)return;


container.innerHTML = '';


data.forEach(item=>{

container.innerHTML += `

<div class="activity-card">

${item.image_url
?
`<img src="${item.image_url}">`
:
''
}

<h3>
${item.title}
</h3>

<p>
${item.detail || ''}
</p>

</div>

`;

});

}


async function loadProject(){

const data =
await getData('project');


const container =
document.getElementById(
'projectContainer'
);


if(!container)return;


container.innerHTML = '';


data.forEach(item=>{

container.innerHTML += `

<div class="project-card">

<h3>
${item.title}
</h3>

<p>
${item.detail || ''}
</p>

</div>

`;

});

}


document.addEventListener(
'DOMContentLoaded',
()=>{

loadNews();

loadActivity();

loadProject();

}
);
