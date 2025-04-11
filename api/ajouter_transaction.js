import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
    if (req.method === 'POST') {
        const { nom_vendeur, prenom_vendeur, nom_acheteur, prenom_acheteur, prix, nom_vehicule, type_vehicule, plaque } = req.body;

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

        const filePath = path.join(process.cwd(), 'data/transactions.json');
        const fileData = fs.readFileSync(filePath);
        const transactions = JSON.parse(fileData);
        transactions.push(newTransaction);
        fs.writeFileSync(filePath, JSON.stringify(transactions, null, 2));

        return res.status(200).json({ message: 'Transaction ajoutée avec succès' });
    } else {
        return res.status(405).json({ error: 'Méthode non autorisée' });
    }
}
