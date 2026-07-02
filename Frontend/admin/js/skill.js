console.log("skills.js berhasil dimuat");

async function loadSkill() {
    console.log("loadSkill dijalankan");
    try {
        const response = await fetch("/api/skills");
        const result = await response.json();
        
        const container = document.getElementById("skillList");
        if (!container) return;
        
        container.innerHTML = "";
        const skills = result.data || [];
        
        skills.forEach(skill => {
            container.innerHTML += `
                <div class="project-card">
                    <div class="project-image">
                        <i class="${skill.icon_class || 'fa-solid fa-star'}"></i>
                    </div>
                    <h3>${skill.nama_skill}</h3>
                    <div class="actions">
                        <button onclick="editSkill(${skill.id}, '${skill.nama_skill}', '${skill.icon_class}')">Edit</button>
                        <button onclick="deleteSkill(${skill.id})">Hapus</button>
                    </div>
                </div>
            `;
        });
    } catch(err) {
        console.error("Error loadSkill:", err);
    }
}

// Fungsi untuk menyiapkan form saat tombol Edit diklik
function editSkill(id, nama, icon) {
    document.getElementById("skillName").value = nama;
    document.getElementById("skillIcon").value = icon;
    
    const btnSimpan = document.querySelector("#skillForm button");
    btnSimpan.innerText = "Update Skill";
    btnSimpan.dataset.editId = id; // Menyimpan ID ke form agar tahu ini proses Edit
    
    document.getElementById("skillForm").scrollIntoView({ behavior: 'smooth' });
}

async function addSkill(e) {
    e.preventDefault();
    const btn = document.querySelector("#skillForm button");
    const editId = btn.dataset.editId; // Cek apakah ada ID edit
    
    const nama_skill = document.getElementById("skillName").value;
    const icon_class = document.getElementById("skillIcon").value;
    const token = localStorage.getItem("token");

    // Jika ada editId, gunakan method PUT, jika tidak gunakan POST
    const method = editId ? "PUT" : "POST";
    const url = editId ? `/api/skills/${editId}` : "/api/skills";

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` 
            },
            body: JSON.stringify({ nama_skill, icon_class })
        });

        if (response.ok) {
            alert(editId ? "Skill berhasil diupdate" : "Skill berhasil ditambah");
            document.getElementById("skillForm").reset();
            btn.innerText = "Simpan Skill"; // Kembalikan teks tombol
            delete btn.dataset.editId; // Hapus ID edit
            loadSkill();
        } else {
            const result = await response.json();
            alert(result.error || "Gagal memproses skill");
        }
    } catch(err) {
        console.error(err);
    }
}

async function deleteSkill(id) {
    const token = localStorage.getItem("token");
    if (!confirm("Hapus skill?")) return;

    await fetch(`/api/skills/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
    });
    loadSkill();
}

document.getElementById("skillForm").addEventListener("submit", addSkill);
loadSkill();