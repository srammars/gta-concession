document.getElementById("addVehicleForm").addEventListener("submit", function(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("marque", document.getElementById("marque").value);
    formData.append("modele", document.getElementById("modele").value);
    formData.append("prix", document.getElementById("prix").value);
    formData.append("vendeur", document.getElementById("vendeur").value);
    formData.append("image", document.getElementById("image").files[0]);
    formData.append("permis", document.getElementById("permis").files[0]);
    formData.append("identite", document.getElementById("identite").files[0]);

    fetch("http://localhost:3000/upload", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        const vehicleItem = document.createElement('li');
        vehicleItem.innerHTML = `
            <p>Marque: ${data.marque} - Modèle: ${data.modele} - Prix: ${data.prix}</p>
            <p>Vendeur: ${data.vendeur}</p>
            <p>Image: <img src="${data.imageUrl}" width="100" /></p>
            <p>Permis: <img src="${data.permisUrl}" width="100" /></p>
            <p>Identité: <img src="${data.identiteUrl}" width="100" /></p>
        `;
        document.getElementById("vehicleList").appendChild(vehicleItem);
    })
    .catch(error => console.error('Erreur:', error));
});
