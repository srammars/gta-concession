const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
const app = express();
const port = process.env.PORT || 3000;

dotenv.config();

// Configurer Cloudinary avec les variables d'environnement
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Middleware pour analyser les données JSON
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
  const { nomVehicule, plaque, vendeurNom, vendeurPrenom, acheteurNom, acheteurPrenom, prix, dateAchat, heureAchat } = req.body;

  if (!nomVehicule || !plaque || !vendeurNom || !vendeurPrenom || !acheteurNom || !acheteurPrenom || !prix) {
    return res.status(400).json({ error: 'Tous les champs sont requis.' });
  }

  // Simuler l'ajout d'un véhicule (sans base de données réelle)
  const newVehicle = {
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

  storedVehicles.push(newVehicle);
  res.status(201).json(newVehicle);
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur backend démarré sur http://localhost:${port}`);
});
