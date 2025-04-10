const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

// Données simulées pour les véhicules
let storedVehicles = [];

// Route pour récupérer les véhicules
app.get('/api/vehicles', (req, res) => {
  res.json(storedVehicles);
});

// Route pour ajouter un véhicule
app.post('/api/vehicles', (req, res) => {
  const { nomVehicule, plaque, vendeurNom, vendeurPrenom, acheteurNom, acheteurPrenom, prix } = req.body;

  if (!nomVehicule || !plaque || !vendeurNom || !vendeurPrenom || !acheteurNom || !acheteurPrenom || !prix) {
    return res.status(400).json({ error: 'Tous les champs sont requis.' });
  }

  // Date et heure actuelles
  const dateAchat = new Date().toLocaleDateString();
  const heureAchat = new Date().toLocaleTimeString();

  const vehicle = {
    nomVehicule,
    plaque,
    vendeurNom,
    vendeurPrenom,
    acheteurNom,
    acheteurPrenom,
    prix,
    dateAchat,
    heureAchat
  };

  storedVehicles.push(vehicle);
  res.status(201).json(vehicle);
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur backend démarré sur http://localhost:${port}`);
});
