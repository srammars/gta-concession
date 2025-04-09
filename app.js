// Configuration Firebase
const firebaseConfig = {
    apiKey: "TON_API_KEY",
    authDomain: "ton-projet-id.firebaseapp.com",
    projectId: "ton-projet-id",
    storageBucket: "ton-projet-id.appspot.com",
    messagingSenderId: "ton-sender-id",
    appId: "ton-app-id"
};

// Initialiser Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore(app);
const storage = firebase.storage();

// Fonction pour ajouter un véhicule
function addVehicle() {
    const nom = document.getElementById('vehicule_nom').value;
    const type = document.getElementById('vehicule_type').value;
    const prix = document.getElementById('vehicule_prix').value;

    db.collection("vehicules").add({
        nom: nom,
        type: type,
        prix: prix
    })
    .then(() => {
        document.getElementById('output').innerText = 'Véhicule ajouté avec succès';
    })
    .catch(error => {
        document.getElementById('output').innerText = 'Erreur : ' + error.message;
    });
}

// Fonction pour ajouter un client
function addClient() {
    const nom = document.getElementById('client_nom').value;
    const prenom = document.getElementById('client_prenom').value;
    const identite = document.getElementById('client_identite').files[0];
    const permis = document.getElementById('client_permis').files[0];

    if (identite && permis) {
        const identiteRef = storage.ref('clients/' + identite.name);
        const permisRef = storage.ref('clients/' + permis.name);

        identiteRef.put(identite).then(() => {
            permisRef.put(permis).then(() => {
                identiteRef.getDownloadURL().then(identiteUrl => {
                    permisRef.getDownloadURL().then(permisUrl => {
                        db.collection("clients").add({
                            nom: nom,
                            prenom: prenom,
                            identite_url: identiteUrl,
                            permis_url: permisUrl
                        })
                        .then(() => {
                            document.getElementById('output').innerText = 'Client ajouté avec succès';
                        })
                        .catch(error => {
                            document.getElementById('output').innerText = 'Erreur : ' + error.message;
                        });
                    });
                });
            });
        });
    } else {
        alert('Veuillez télécharger la pièce d\'identité et le permis de conduire');
    }
}

// Fonction pour enregistrer une vente
function addSale() {
    const acheteur = document.getElementById('ventes_acheteur').value;
    const vendeur = document.getElementById('ventes_vendeur').value;
    const image = document.getElementById('ventes_image').files[0];

    if (image) {
        const imageRef = storage.ref('ventes/' + image.name);
        imageRef.put(image).then(() => {
            imageRef.getDownloadURL().then(imageUrl => {
                db.collection("ventes").add({
                    acheteur: acheteur,
                    vendeur: vendeur,
                    image_url: imageUrl
                })
                .then(() => {
                    document.getElementById('output').innerText = 'Vente enregistrée avec succès';
                })
                .catch(error => {
                    document.getElementById('output').innerText = 'Erreur : ' + error.message;
                });
            });
        });
    } else {
        alert('Veuillez télécharger l\'image de la vente');
    }
}
