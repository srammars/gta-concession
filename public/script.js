document.addEventListener('DOMContentLoaded', () => {
    const vehiculeList = document.getElementById('vehicule-list');
    const formAjoutVehicule = document.getElementById('form-ajout-vehicule');

    // Affichage des véhicules
    fetch('http://localhost:3001/vehicules')
        .then(response => response.json())
        .then(vehicules => {
            vehiculeList.innerHTML = '';
            vehicules.forEach(vehicule => {
                const vehiculeDiv = document.createElement('div');
                vehiculeDiv.classList.add('vehicule-item');
                vehiculeDiv.innerHTML = `
                    <h3>${vehicule.marque} ${vehicule.modele}</h3>
                    <p>Type: ${vehicule.type}</p>
                    <p>Prix: ${vehicule.prix}€</p>
                    ${vehicule.image_url ? `<img src="${vehicule.image_url}" alt="Image de ${vehicule.marque}" width="100%">` : ''}
                `;
                vehiculeList.appendChild(vehiculeDiv);
            });
        });

    // Formulaire d'ajout de véhicule
    formAjoutVehicule.addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('marque', document.getElementById('marque').value);
        formData.append('modele', document.getElementById('modele').value);
        formData.append('type', document.getElementById('type').value);
        formData.append('prix', document.getElementById('prix').value);
        formData.append('image', document.getElementById('image').files[0]);

        fetch('http://localhost:3001/vehicules', {
            method: 'POST',
            body: formData
        })
        .then(response => response.ok ? alert('Véhicule ajouté!') : alert('Erreur'))
        .catch(error => console.error('Erreur:', error));
    });
});
