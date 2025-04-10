const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

// Création de l'application Express
const app = express();
const port = process.env.PORT || 3000;

// Middleware pour gérer les requêtes JSON et CORS
app.use(bodyParser.json());
app.use(cors());

// Connexion à la base de données MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connecté à la base de données MongoDB'))
  .catch((err) => console.log('Erreur de connexion à la base de données MongoDB:', err));

// Schéma et modèle pour les véhicules
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

// Schéma et modèle pour les utilisateurs (vendeurs et acheteurs)
const userSchema = new mongoose.Schema({
  nom: String,
  prenom: String,
  role: String // "vendeur" ou "acheteur"
});

const User = mongoose.model('User', userSchema);

// Route pour récupérer tous les véhicules
app.get('/api/vehicles', async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.json(vehicles); // Renvoie les véhicules sous format JSON
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération des véhicules' });
  }
});

// Route pour récupérer tous les utilisateurs (vendeurs et acheteurs)
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users); // Renvoie les utilisateurs sous format JSON
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs' });
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
    res.status(201).json(savedVehicle); // Renvoie le véhicule ajouté
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de l\'ajout du véhicule' });
  }
});
// Route pour ajouter un utilisateur (vendeur ou acheteur)
app.post('/api/users', async (req, res) => {
  const { nom, prenom, role } = req.body;

  if (!nom || !prenom || !role) {
    return res.status(400).json({ error: 'Nom, prénom et rôle sont nécessaires.' });
  }

  const user = new User({ nom, prenom, role });

  try {
    const savedUser = await user.save();
    res.status(201).json(savedUser); // Renvoie l'utilisateur enregistré
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de l\'enregistrement de l\'utilisateur' });
  }
});

// Démarrer le serveur backend
app.listen(port, () => {
  console.log(`Serveur backend démarré sur http://localhost:${port}`);
});
