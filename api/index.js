const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

// Tableau en mémoire pour stocker les transactions
let transactions = [];

// Middleware pour parser le corps des requêtes en JSON
app.use(bodyParser.json());

// Servez les fichiers statiques depuis le dossier "public"
app.use(express.static(path.join(__dirname, '../public')));

// Route POST pour ajouter une transaction
app.post('/ajouter_transaction', (req, res) => {
    const { nom_vendeur, prenom_vendeur, nom_acheteur, prenom_acheteur, prix, nom_vehicule, type_vehicule, plaque } = req.body;
    
    // Vérification des champs nécessaires
    if (!nom_vendeur || !prenom_vendeur || !nom_acheteur || !prenom_acheteur || !prix || !nom_vehicule || !type_vehicule || !plaque) {
        return res.status(400).json({ error: 'Tous les champs sont requis' });
    }
    
    // Générer la date et l'heure actuelles pour la transaction
    const date_heure = new Date().toISOString().slice(0, 19).replace('T', ' ');

    // Créer un objet pour la nouvelle transaction
    const newTransaction = {
        nom_vendeur,
        prenom_vendeur,
        nom_acheteur,
        prenom_acheteur,
        prix,
        nom_vehicule,
        type_vehicule,
        plaque_immatriculation: plaque,
        date_heure,
    };

    // Ajouter la nouvelle transaction au tableau en mémoire
    transactions.push(newTransaction);

    // Répondre avec un message de succès
    res.status(200).json({ message: 'Transaction ajoutée avec succès', transaction: newTransaction });
});

// Route GET pour récupérer les transactions filtrées
app.get('/transactions', (req, res) => {
    const searchQuery = req.query.search || '';

    // Filtrer les transactions en fonction de la recherche
    const filtered = transactions.filter(t =>
        t.nom_vendeur.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.prenom_vendeur.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.nom_acheteur.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.prenom_acheteur.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.plaque_immatriculation.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Répondre avec les transactions filtrées
    res.status(200).json(filtered);
});

// Route de base pour servir index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// Démarrer le serveur sur le port 10000
const port = process.env.PORT || 10000;
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
