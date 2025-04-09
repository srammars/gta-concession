
document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/vehicules')
        .then(response => response.json())
        .then(data => {
            const vehiculeList = document.getElementById('vehicule-list');
            data.forEach(vehicule => {
                const div = document.createElement('div');
                div.classList.add('vehicule-item');
                div.innerHTML = `
                    <h3>${vehicule.marque} ${vehicule.modele}</h3>
                    <p>Type: ${vehicule.type}</p>
                    <p>Prix: ${vehicule.prix} $</p>
                    <img src="${vehicule.image_url}" alt="Image du véhicule" width="150">
                `;
                vehiculeList.appendChild(div);
            });
        });

    document.getElementById('form-ajout-vehicule').addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('marque', document.getElementById('marque').value);
        formData.append('modele', document.getElementById('modele').value);
        formData.append('type', document.getElementById('type').value);
        formData.append('prix', document.getElementById('prix').value);
        formData.append('image', document.getElementById('image').files[0]);

        fetch('/api/vehicules', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(() => alert('Véhicule ajouté avec succès !'))
        .catch(error => console.error('Erreur:', error));
    });
});
