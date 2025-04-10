module.exports = (req, res) => {
    if (req.method === 'POST') {
        // Traitement des données de la transaction
    } else {
        res.status(405).send('Méthode non autorisée');
    }
};