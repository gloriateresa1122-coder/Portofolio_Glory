const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async function(e){

    e.preventDefault();


    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;


    try {

        const response = await fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });


        const data = await response.json();


        if(response.ok){

            localStorage.setItem(
                "token",
                data.token
            );


            localStorage.setItem(
                "username",
                data.user.username
            );


            document.getElementById("message").innerHTML =
            "Login berhasil";


            setTimeout(() => {

                window.location.href = "/admin/dashboard.html";

            }, 1000);


        }else{

            document.getElementById("message").innerHTML =
            data.error;

        }


    } catch(error){

        document.getElementById("message").innerHTML =
        "Server tidak terhubung";

        console.log(error);

    }

});