const http = require('http');

// Tableau en mémoire pour stocker les transactions
let transactions = [];

// Créer le serveur HTTP
const server = http.createServer((req, res) => {
    // Gestion de la route POST pour ajouter une transaction
    if (req.method === 'POST' && req.url === '/ajouter_transaction') {
        let body = '';
        
        // Collecter les données envoyées dans le corps de la requête
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            // Extraire les données de la requête
            const { nom_vendeur, prenom_vendeur, nom_acheteur, prenom_acheteur, prix, nom_vehicule, type_vehicule, plaque } = JSON.parse(body);
            
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
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json({ message: 'Transaction ajoutée avec succès' });
        });
    }

    // Gestion de la route GET pour récupérer les transactions filtrées
    else if (req.method === 'GET' && req.url.startsWith('/transactions')) {
        const url = new URL(req.url, 'http://localhost');
        const searchQuery = url.searchParams.get('search') || '';

        // Filtrer les transactions en fonction de la recherche
        const filtered = transactions.filter(t =>
            t.nom_vendeur.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.prenom_vendeur.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.nom_acheteur.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.prenom_acheteur.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.plaque_immatriculation.toLowerCase().includes(searchQuery.toLowerCase())
        );

        // Répondre avec les transactions filtrées
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(filtered);
    }

    // Gérer les routes non trouvées (404)
    else {
        res.status(404).json({ error: 'Not found' });
    }
});

// Démarrer le serveur sur le port spécifié ou 10000 par défaut
const port = process.env.PORT || 10000;
server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
