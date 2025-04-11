const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    const filePath = path.join(__dirname, '../data/transactions.json');

    if (req.method === 'POST' && req.url === '/ajouter_transaction') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            const { nom_vendeur, prenom_vendeur, nom_acheteur, prenom_acheteur, prix, nom_vehicule, type_vehicule, plaque } = JSON.parse(body);
            if (!nom_vendeur || !prenom_vendeur || !nom_acheteur || !prenom_acheteur || !prix || !nom_vehicule || !type_vehicule || !plaque) {
                return res.status(400).json({ error: 'Tous les champs sont requis' });
            }
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
            const transactions = JSON.parse(fs.readFileSync(filePath, 'utf8') || '[]');
            transactions.push(newTransaction);
            fs.writeFileSync(filePath, JSON.stringify(transactions, null, 2));
            res.status(200).json({ message: 'Transaction ajoutée avec succès' });
        });
    } else if (req.method === 'GET' && req.url.startsWith('/transactions')) {
        const transactions = JSON.parse(fs.readFileSync(filePath, 'utf8') || '[]');
        const url = new URL(req.url, 'http://localhost');
        const searchQuery = url.searchParams.get('search') || '';
        const filtered = transactions.filter(t =>
            t.nom_vendeur.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.prenom_vendeur.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.nom_acheteur.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.prenom_acheteur.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.plaque_immatriculation.toLowerCase().includes(searchQuery.toLowerCase())
        );
        res.status(200).json(filtered);
    } else {
        res.status(404).json({ error: 'Not found' });
    }
});

// Ensure the server listens on the correct port (provided by Render or 10000 as fallback)
const port = process.env.PORT || 10000;
server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
