// frontend/script.js
document.getElementById('addClientForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append('nom', document.getElementById('nom').value);
    formData.append('prenom', document.getElementById('prenom').value);
    formData.append('joueur_id', document.getElementById('joueur_id').value);
    formData.append('identite', document.getElementById('identite').files[0]);
    formData.append('permis', document.getElementById('permis').files[0]);

    fetch('http://localhost:3001/clients', {
        method: 'POST',
        body: formData
    }).then(response => response.json())
      .then(data => alert(data.message))
      .catch(error => console.error('Error:', error));
});

document.getElementById('addVehicleForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append('marque', document.getElementById('marque').value);
    formData.append('modele', document.getElementById('modele').value);
    formData.append('prix', document.getElementById('prix').value);
    formData.append('image', document.getElementById('image').files[0]);
    formData.append('plaque', document.getElementById('plaque').files[0]);

    fetch('http://localhost:3001/vehicules', {
        method: 'POST',
        body: formData
    }).then(response => response.json())
      .then(data => alert(data.message))
      .catch(error => console.error('Error:', error));
});
