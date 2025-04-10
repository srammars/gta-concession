const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Permet les requêtes CORS depuis le frontend

// Connexion à la base de données MongoDB
mongoose.connect('mongodb://localhost:27017/gta_concession', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connexion à la base de données MongoDB réussie'))
  .catch(err => console.error('Erreur de connexion à MongoDB', err));

// Schéma pour les utilisateurs (vendeur et acheteur)
const userSchema = new mongoose.Schema({
  nom: String,
  prenom: String,
  role: { type: String, enum: ['vendeur', 'acheteur'], required: true },
});

const User = mongoose.model('User', userSchema);

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
    console.error("Erreur lors de l'ajout de l'utilisateur :", err);
    res.status(500).json({ error: 'Erreur lors de l\'enregistrement de l\'utilisateur' });
  }
});

// Schéma pour les véhicules
const vehicleSchema = new mongoose.Schema({
  nomVehicule: String,
  plaque: String,
  vendeur: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  acheteur: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  prix: Number,
  dateAchat: Date,
  heureAchat: String,
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

// Route pour ajouter un véhicule
app.post('/api/vehicles', async (req, res) => {
  const { nomVehicule, plaque, vendeurId, acheteurId, prix, dateAchat, heureAchat } = req.body;

  if (!nomVehicule || !plaque || !vendeurId || !acheteurId || !prix) {
    return res.status(400).json({ error: 'Toutes les informations sont nécessaires.' });
  }

  try {
    const vehicle = new Vehicle({ nomVehicule, plaque, vendeur: vendeurId, acheteur: acheteurId, prix, dateAchat, heureAchat });
    await vehicle.save();
    res.status(201).json(vehicle); // Retourne le véhicule ajouté
  } catch (err) {
    console.error("Erreur lors de l'ajout du véhicule :", err);
    res.status(500).json({ error: 'Erreur lors de l\'enregistrement du véhicule' });
  }
});

// Route pour récupérer tous les véhicules
app.get('/api/vehicles', async (req, res) => {
  try {
    const vehicles = await Vehicle.find().populate('vendeur acheteur');
    res.status(200).json(vehicles);
  } catch (err) {
    console.error("Erreur lors de la récupération des véhicules :", err);
    res.status(500).json({ error: 'Erreur lors de la récupération des véhicules' });
  }
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur backend démarré sur http://localhost:${port}`);
});
