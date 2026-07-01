document.addEventListener('DOMContentLoaded', async () => {
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // Load Data Utama
    await loadPublicData();

    // Handle Form Kontak
    setupContactForm();

    // Hamburger Menu
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    if(hamburger) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
});

async function loadPublicData() {
    try {
        // PERUBAHAN: Menambahkan URL lengkap agar mengarah ke Flask
        const response = await fetch('http://127.0.0.1:5000/api/main-profile');
        
        if (!response.ok) throw new Error(`Server error: ${response.status}`);
        
        const res = await response.json();
        
        if (!res.success || !res.data) {
            showError('Data profil belum tersedia.');
            return;
        }

        const { skills, experiences, projects } = res.data;
        const profile = res.data;

        if (!profile.nama_lengkap) {
            showError('Nama profil kosong.');
            return;
        }

        renderHero(profile);
        renderAbout(profile);
        renderSkills(skills || []);
        renderExperiences(experiences || []);
        renderProjects(projects || []);
        renderContact(profile);

    } catch (error) {
        console.error('Fetch Error:', error);
        showError('Gagal terhubung ke server.');
    }
}

function showError(msg) {
    const heroContent = document.getElementById('hero-content');
    if (heroContent) {
        heroContent.innerHTML = `<div class="error-state"><i class="fas fa-exclamation-circle"></i> ${msg}</div>`;
    }
}

function renderHero(p) {
    const hero = document.getElementById('hero-content');
    if (!hero) return;

    hero.innerHTML = `
        <h4>Selamat Datang di Portofolio Saya</h4>
        <h1>Halo, Saya <span>${escapeHtml(p.nama_lengkap)}</span></h1>
        <p>Mahasiswa Program Studi Sistem Informasi, Fakultas Teknologi Informasi, Universitas Kristen Satya Wacana</p>
        <a href="#projects" class="btn">Lihat Proyek Saya</a>
    `;
}

function renderAbout(p) {
    const img = document.getElementById('profile-photo');
    const placeholder = document.getElementById('photo-placeholder');
    
    if (img && placeholder) {
        if (p.foto_url) {
            img.src = p.foto_url;
            img.style.display = 'block';
            placeholder.style.display = 'none';
        } else {
            img.style.display = 'none';
            placeholder.style.display = 'flex';
        }
    }

    const aboutText = document.getElementById('about-text');
    if (aboutText) {
        aboutText.innerHTML = `
            <h3>Sistem Informasi</h3>
            <p>Saya memilih program studi ini karena saya tertarik pada dunia bisnis dan teknologi. Saya ingin mempelajari bagaimana sistem informasi dirancang untuk menciptakan efisiensi serta memberikan solusi nyata bagi kebutuhan bisnis masa kini.</p>
            <a href="#contact" class="btn">Hubungi Saya</a>
        `;
    }
}

function renderSkills(skills) {
    const container = document.getElementById('skills-container');
    if (!container) return;

    // Jika data dari database kosong, tampilkan pesan atau biarkan kosong
    if (!skills || skills.length === 0) {
        container.innerHTML = '<p>Belum ada keahlian yang ditambahkan.</p>';
        return;
    }

    // Gunakan data dari API (parameter 'skills')
    container.innerHTML = skills.map(s => `
        <div class="skill-card">
            <i class="${s.icon_class || 'fas fa-star'}"></i>
            <h4>${s.nama_skill}</h4>
        </div>
    `).join('');
}

function renderExperiences(exps) {
    const container = document.getElementById('experience-container');
    if (!container) return;

    // Data cadangan jika database kosong atau API gagal
    const dataStatis = [
        { durasi: "2024 - Sekarang", posisi: "Tim Promosi Universitas Kristen Satya Wacana", perusahaan: "UKSW", deskripsi: "Mengelola branding, menyusun strategi pemasaran, mempromosi UKSW ke berbagai kalangan, serta melakukan kampanye penerimaan mahasiswa baru." },
        { durasi: "2025 - Sekarang", posisi: "Tim Multimedia Gereja", perusahaan: "GPIB Salatiga", deskripsi: "Mendukung kelancaran ibadah dan pelayanan melalui media audio-visual." },
        { durasi: "2025 - Sekarang", posisi: "HMPSI FTI UKSW", perusahaan: "FTI UKSW", deskripsi: "Mengikuti Organisasi Lembaga Kemahasiswaan dengan bergabung menjadi pengurus Himpunanan Mahasiswa Program Studi S1 Sistem Informasi FTI UKSW" },
        { durasi: "2026", posisi: "Koordinator Acara Oracle Insight 2026", perusahaan: "FTI UKSW", deskripsi: "Menjadi koordinator acara dalam event Oracle Insight 2026 HMPSI FTI UKSW." }
    ];

    // Gunakan data API jika ada, jika tidak pakai dataStatis
    const dataToRender = (Array.isArray(exps) && exps.length > 0) ? exps : dataStatis;

    container.innerHTML = dataToRender.map(e => `
<div class="timeline-item">

    <div class="timeline-dot"></div>

    <div class="timeline-content">

        <div class="exp-left">

            <span class="periode">${e.durasi}</span>

            <h3>JABATAN : ${e.posisi}</h3>

            <h4>TEMPAT : ${e.perusahaan}</h4>

            <p>${e.deskripsi}</p>

        </div>

        <div class="exp-right">

            ${e.image_url ? `
                <img src="${e.image_url}" alt="${e.posisi}">
            ` : `
                <img src="images/no-image.png" alt="No Image">
            `}

        </div>

    </div>

</div>
`).join('');

}

function renderProjects(projs) {
    const container = document.getElementById('projects-container');
    if (!container) return;

    if (!projs || projs.length === 0) {
        container.innerHTML = '<p>Belum ada proyek.</p>';
        return;
    }

    container.innerHTML = projs.map(p => {

        const teknologi = (p.teknologi || "")
            .split(",")
            .map(item => `<span class="tech-tag">${item.trim()}</span>`)
            .join("");

        return `
            <div class="project-card">

                <div class="project-info">
                    <h3>${p.judul}</h3>

                    <p>${p.deskripsi}</p>

                    <div class="tech-list">
                        ${teknologi}
                    </div>

                </div>

            </div>
        `;

    }).join('');
}

function renderContact(p) {
    const emailDisplay = document.getElementById('contact-email-display');
    if (emailDisplay && p.email) {
        emailDisplay.innerHTML = `Tertarik berkolaborasi? Langsung kirim pesan ke bawah sini!`;
    }
}

function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const btn = document.getElementById('sendBtn');
        const originalText = btn.textContent;
        
        btn.disabled = true;
        btn.textContent = 'Mengirim...';
        
        try {
            const response = await fetch('http://127.0.0.1:5000/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: document.getElementById('contactName').value,
                    email: document.getElementById('contactEmail').value,
                    message: document.getElementById('contactMessage').value
                })
            });
            
            const result = await response.json();
            
            if (response.ok) {
                alert('✅ ' + result.message);
                contactForm.reset();
            } else {
                alert('❌ ' + (result.error || 'Gagal mengirim'));
            }
        } catch (error) {
            alert('❌ Terjadi kesalahan jaringan.');
        } finally {
            btn.disabled = false;
            btn.textContent = originalText;
        }
    });
}

function escapeHtml(text) {
    if (text === null || text === undefined) return '';
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return String(text).replace(/[&<>"']/g, m => map[m]);
}