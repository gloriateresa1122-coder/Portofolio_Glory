document.addEventListener("DOMContentLoaded", function() {
    
    fetch('/profiles', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })
    .then(response => response.json())
    .then(result => {
        if (result.success && result.data) {
            const data = result.data;

            if (data.foto_url) {

                const imgElement = document.getElementById('profile-img');
                if (imgElement) {
                    imgElement.src = data.foto_url;
                }
            }
            
            if (document.getElementById('nama-lengkap')) {
                document.getElementById('nama-lengkap').innerText = data.nama_lengkap;
            }
        }
    })
    .catch(error => console.error('Error:', error));
});