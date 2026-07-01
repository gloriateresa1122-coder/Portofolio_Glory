alert("skill.js terbaca");

async function loadSkill() {

    console.log("loadSkill dijalankan");

    try {

        const response = await fetch("http://127.0.0.1:5000/api/skills");

        console.log("Status:", response.status);

        const result = await response.json();

        console.log("Result:", result);

        const container = document.getElementById("skillList");

        console.log("Container:", container);

        container.innerHTML = "";

        const skills = result.data || [];

        console.log("Jumlah skill:", skills.length);

        skills.forEach(skill => {

            console.log("Skill:", skill);

            container.innerHTML += `
                <div class="project-card">
                    <div class="project-image">
                        <i class="${skill.icon_class || 'fa-solid fa-star'}"></i>
                    </div>

                    <h3>${skill.nama_skill}</h3>

                    <div class="actions">
                        <button onclick="deleteSkill(${skill.id})">
                            Hapus
                        </button>
                    </div>
                </div>
            `;
        });

        console.log("Selesai render");

    } catch(err) {

        console.error(err);

    }

}
```

}

async function addSkill(e){

e.preventDefault();

const nama_skill =
document.getElementById(
"skillName"
).value;

const icon_class =
document.getElementById(
"skillIcon"
).value;

const token =
localStorage.getItem(
"token"
);

try{

const response =
await fetch(
"http://127.0.0.1:5000/api/skills",
{
method:"POST",


headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}` 
},

body:
JSON.stringify({

nama_skill,
icon_class

})

}

);

const result =
await response.json();

if(response.ok){

alert(
"Skill berhasil ditambah"
);

document
.getElementById(
"skillForm"
)
.reset();

loadSkill();

}else{

alert(
result.error
);

}

}catch(err){

console.log(err);

}

}

async function deleteSkill(id){

const token =
localStorage.getItem(
"token"
);

if(
!confirm(
"Hapus skill?"
)
)return;

await fetch(

`http://127.0.0.1:5000/api/skills/${id}`,

{

method:
"DELETE",

headers:{

Authorization:
`Bearer ${token}`

}

}

);

loadSkill();

}

document
.getElementById(
"skillForm"
)
.addEventListener(
"submit",
addSkill
);

loadSkill();

console.log("skills.js berhasil dimuat");