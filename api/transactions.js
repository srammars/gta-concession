import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
    if (req.method === 'GET') {
        const searchQuery = req.query.search || '';

        const filePath = path.join(process.cwd(), 'data/transactions.json');
        const fileData = fs.readFileSync(filePath);
        const transactions = JSON.parse(fileData);

        const filtered = transactions.filter(t =>
            t.nom_vendeur.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.prenom_vendeur.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.nom_acheteur.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.prenom_acheteur.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.plaque_immatriculation.toLowerCase().includes(searchQuery.toLowerCase())
        );

        return res.status(filtered.length ? 200 : 404).json(filtered.length ? filtered : { error: 'Aucune transaction trouvée' });
    } else {
        return res.status(405).json({ error: 'Méthode non autorisée' });
    }
}
