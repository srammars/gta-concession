const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Middleware pour parser les données du formulaire
app.use(bodyParser.urlencoded({ extended: true }));

// Serveur les fichiers statiques (comme index.html)
app.use(express.static('public'));

// Lire les transactions à partir du fichier JSON
const readTransactions = () => {
    const data = fs.readFileSync('data/transactions.json');
    return JSON.parse(data);
};

// Sauvegarder les transactions dans le fichier JSON
const saveTransactions = (transactions) => {
    fs.writeFileSync('data/transactions.json', JSON.stringify(transactions, null, 2));
};

// Route pour afficher le formulaire et les transactions
app.get('/', (req, res) => {
    const transactions = readTransactions();
    res.sendFile(__dirname + '/public/index.html');
});

// Route pour ajouter une transaction
app.post('/ajouter_transaction', (req, res) => {
    const { nom_vendeur, prenom_vendeur, nom_acheteur, prenom_acheteur, prix, nom_vehicule, type_vehicule, plaque } = req.body;
    const date_heure = new Date().toISOString().slice(0, 19).replace('T', ' ');

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

    const transactions = readTransactions();
    transactions.push(newTransaction);

    saveTransactions(transactions);

    res.redirect('/');
});

// Route pour récupérer toutes les transactions (avec filtrage par recherche)
app.get('/transactions', (req, res) => {
    const transactions = readTransactions();  // Récupérer les transactions depuis le fichier JSON ou une autre source
    const searchQuery = req.query.search || '';  // Récupérer le paramètre de recherche

    // Filtrer les transactions si un terme de recherche est fourni
    const filteredTransactions = transactions.filter(transaction => {
        return (
            transaction.nom_vendeur.toLowerCase().includes(searchQuery.toLowerCase()) ||
            transaction.prenom_vendeur.toLowerCase().includes(searchQuery.toLowerCase()) ||
            transaction.nom_acheteur.toLowerCase().includes(searchQuery.toLowerCase()) ||
            transaction.prenom_acheteur.toLowerCase().includes(searchQuery.toLowerCase()) ||
            transaction.plaque_immatriculation.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    if (filteredTransactions.length > 0) {
        res.json(filteredTransactions);  // Réponse avec les transactions filtrées en JSON
    } else {
        res.status(404).send('Aucune transaction trouvée');
    }
});

// Lancer le serveur
app.listen(port, () => {
    console.log(`Le serveur écoute sur http://localhost:${port}`);
});
