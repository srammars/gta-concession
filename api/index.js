const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = express();
const port = process.env.PORT || 3000;

dotenv.config();

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connecté à MongoDB !'))
  .catch(err => console.log('Erreur de connexion MongoDB :', err));

// Schéma pour les véhicules
const vehicleSchema = new mongoose.Schema({
  nomVehicule: String,
  plaque: String,
  vendeurNom: String,
  vendeurPrenom: String,
  acheteurNom: String,
  acheteurPrenom: String,
  prix: Number,
  dateAchat: String,
  heureAchat: String
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

// Middleware pour analyser le JSON
app.use(express.json());
app.use(express.static('public'));

// Route pour récupérer les véhicules
app.get('/api/vehicles', async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération des véhicules' });
  }
});

// Route pour ajouter un véhicule
app.post('/api/vehicles', async (req, res) => {
  const { nomVehicule, plaque, vendeurNom, vendeurPrenom, acheteurNom, acheteurPrenom, prix } = req.body;

  if (!nomVehicule || !plaque || !vendeurNom || !vendeurPrenom || !acheteurNom || !acheteurPrenom || !prix) {
    return res.status(400).json({ error: 'Tous les champs sont requis.' });
  }

  // Date et heure actuelles
  const dateAchat = new Date().toLocaleDateString();
  const heureAchat = new Date().toLocaleTimeString();

  const vehicle = new Vehicle({
    nomVehicule,
    plaque,
    vendeurNom,
    vendeurPrenom,
    acheteurNom,
    acheteurPrenom,
    prix,
    dateAchat,
    heureAchat
  });

  try {
    const savedVehicle = await vehicle.save();
    res.status(201).json(savedVehicle);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de l\'ajout du véhicule' });
  }
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur backend démarré sur http://localhost:${port}`);
});
