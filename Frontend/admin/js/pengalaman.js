if (!localStorage.getItem("token")) {
    window.location.href = "login.html";
}


function logout() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
}


async function loadExperience() {
    try {
        const res = await fetch("/api/experiences");
        const result = await res.json();

        const container = document.getElementById("experienceList");
        container.innerHTML = "";

        result.data.forEach(exp => {
            container.innerHTML += `
                <div class="exp-card">

                    <div class="exp-header">
                        <span class="periode">
                            ${exp.durasi}
                        </span>
                    </div>

                    <h3>${exp.posisi}</h3>

                    <p class="company">
                        ${exp.perusahaan}
                    </p>

                    <p>
                        ${exp.deskripsi}
                    </p>

                </div>
            `;
        });

    } catch (err) {
        console.log("Gagal load:", err);
    }
}


const form = document.querySelector("form");

form.addEventListener("submit", async function (e) {

    e.preventDefault();

    const durasi =
        document.querySelectorAll("input")[0].value;

    const posisi =
        document.querySelectorAll("input")[1].value;

    const perusahaan =
        document.querySelectorAll("input")[2].value;

    const deskripsi =
        document.querySelector("textarea").value;

    try {

        const res = await fetch("/api/experiences");
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",

                    "Authorization":
                        "Bearer " +
                        localStorage.getItem("token")
                },

                body: JSON.stringify({
                    durasi,
                    posisi,
                    perusahaan,
                    deskripsi
                })
            }
        );

        const result =
            await response.json();

        if (response.ok) {

            alert(
                "Pengalaman berhasil ditambahkan"
            );

            form.reset();

            loadExperience();

        } else {

            alert(
                result.message ||
                "Gagal menyimpan"
            );

        }

    } catch (error) {

        console.log(error);

        alert(
            "Tidak dapat terhubung ke server"
        );

    }

});


loadExperience();