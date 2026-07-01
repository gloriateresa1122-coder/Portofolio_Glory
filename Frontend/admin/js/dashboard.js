if(!localStorage.getItem("token")){

window.location.href=
"login.html"

}



function logout(){

localStorage.removeItem(
"token"
)

window.location.href=
"login.html"

}



document
.getElementById(
"adminName"
)
.innerHTML=

localStorage.getItem(
"username"
)

||
"Admin"



async function loadDashboard() {

    try {

        const token = localStorage.getItem("token");

        const response = await fetch("/api/dashboard/stats", {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        const result = await response.json();

        console.log(response.status);
        console.log(result);

        if (result.success) {

            document.getElementById("profileCount").innerHTML = 1;
            document.getElementById("projectCount").innerHTML = result.data.projects_count;
            document.getElementById("skillCount").innerHTML = result.data.skills_count;
            document.getElementById("expCount").innerHTML = result.data.experiences_count;
            document.getElementById("adminName").innerHTML = result.data.admin_name;

        }

    } catch (err) {
        console.error(err);
    }

}

loadDashboard();