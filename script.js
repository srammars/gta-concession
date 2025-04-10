function fetchVehicles() {
    fetch("/vehicules")
        .then(response => response.json())
        .then(vehicles => {
            const vehicleList = document.getElementById("vehicleList");
            vehicleList.innerHTML = "";
            vehicles.forEach(vehicle => {
                const listItem = document.createElement("li");
                listItem.innerHTML = `
                    <strong>${vehicle.marque} ${vehicle.modele}</strong><br>
                    Prix: ${vehicle.prix}€<br>
                    Vendu par: ${vehicle.vendeur}<br>
                    <img src="${vehicle.image_url}" alt="Image du véhicule" style="width: 100px;"><br>
                    Acheteur: ${vehicle.acheteur_nom} ${vehicle.acheteur_prenom}<br>
                    <img src="${vehicle.identite_url}" alt="Identité de l'acheteur" style="width: 100px;">
                    <img src="${vehicle.permis_url}" alt="Permis" style="width: 100px;">
                    <img src="${vehicle.plaque_url}" alt="Plaque" style="width: 100px;"><br>
                `;
                vehicleList.appendChild(listItem);
            });
        });
}

document.getElementById("addVehicleForm").addEventListener("submit", function(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("marque", document.getElementById("marque").value);
    formData.append("modele", document.getElementById("modele").value);
    formData.append("prix", document.getElementById("prix").value);
    formData.append("vendeur", document.getElementById("vendeur").value);
    formData.append("image", document.getElementById("image").files[0]);
    formData.append("acheteur_nom", document.getElementById("acheteur_nom").value);
    formData.append("acheteur_prenom", document.getElementById("acheteur_prenom").value);
    formData.append("identite", document.getElementById("identite").files[0]);
    formData.append("permis", document.getElementById("permis").files[0]);
    formData.append("plaque", document.getElementById("plaque").files[0]);

    fetch("/vehicules", {
        method: "POST",
        body: formData
    }).then(response => {
        if (response.ok) {
            fetchVehicles();
            document.getElementById("addVehicleForm").reset();
        }
    });
});

fetchVehicles();