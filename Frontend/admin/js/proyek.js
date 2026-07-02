if (!localStorage.getItem("token")) {
    window.location.href = "login.html";
}


async function loadProjects() {
    try {
        const res = await fetch("/api/projects", {
            headers: { "Authorization": "Bearer " + localStorage.getItem("token") }
        });
        const result = await res.json();
        const grid = document.getElementById("projectList");
        
        if (!grid) return;
        grid.innerHTML = "";
        
        const projects = result.data || [];
        projects.forEach(p => {

    const teknologi = (p.teknologi || "")
        .split(",")
        .map(item => `<span class="tech-tag">${item.trim()}</span>`)
        .join("");

    grid.innerHTML += `
    <div class="project-card">

        <h3>${p.judul}</h3>

        <p>${p.deskripsi}</p>

        <div class="project-tags">
            ${teknologi}
        </div>

        <div class="actions">
            <button onclick="editProject(${p.id})">Edit</button>
            <button onclick="deleteProject(${p.id})">Hapus</button>
        </div>

    </div>`;
});

    } catch (err) {
        console.log("Error:", err);
    }
}

const form = document.querySelector("form");
form.addEventListener("submit", async function(e) {
    e.preventDefault();
    const btn = form.querySelector("button");
    const editId = btn.dataset.editId; 

    const inputs = form.querySelectorAll("input");
    const data = {
        judul: inputs[0].value,
        teknologi: inputs[1].value,
        deskripsi: form.querySelector("textarea").value
    };


    const url = editId
        ? `/api/projects/${editId}`
        : "/api/projects";
    const method = editId ? "PUT" : "POST";

    try {
        const res = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            body: JSON.stringify(data)
        });

        if (res.ok) {
            alert(editId ? "Project berhasil diupdate" : "Project berhasil ditambahkan");
            form.reset();
            
            btn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Simpan Project';
            delete btn.dataset.editId; 
            loadProjects();
        } else {
            alert("Gagal memproses project");
        }
    } catch (err) {
        alert("Gagal koneksi server");
    }
});


loadProjects();

async function deleteProject(id) {
    if (!confirm("Yakin ingin menghapus?")) return;
    const res = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
        headers: { "Authorization": "Bearer " + localStorage.getItem("token") }
    });
    if (res.ok) loadProjects();
}

async function editProject(id) {
    
    const btn = event.target;
    const card = btn.closest('.project-card');
    
  
    const judul = card.querySelector('h3').innerText;
    const deskripsi = card.querySelector('p').innerText;
    const teknologi = card.querySelector('span').innerText;

    
    const inputs = document.querySelectorAll("form input");
    const textarea = document.querySelector("form textarea");
    
    inputs[0].value = judul;
    inputs[1].value = teknologi;
    textarea.value = deskripsi;

    /
    const btnSimpan = document.querySelector("form button");
    btnSimpan.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Update Project';
    btnSimpan.dataset.editId = id;

    document.getElementById('form-section').scrollIntoView({ 
        behavior: 'smooth' 
    });
}