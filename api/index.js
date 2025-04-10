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

app.use(express.json()); // Pour traiter le JSON dans les requêtes
app.use(express.static('public')); // Pour servir des fichiers statiques (images, etc.)

// Simuler une base de données en mémoire pour les véhicules
let vehicles = [];

// Route pour la page d'accueil
app.get('/', (req, res) => {
  res.send('Bienvenue sur la concession GTA!');
});

// Route pour uploader les fichiers sur Cloudinary
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/upload', upload.fields([{ name: 'image' }, { name: 'permis' }, { name: 'identite' }]), (req, res) => {
  if (!req.files) {
    return res.status(400).send('Aucun fichier n\'a été téléchargé.');
  }

  const files = req.files;
  const promises = [];

  Object.keys(files).forEach(fileKey => {
    const file = files[fileKey][0];
    const uploadPromise = new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
        if (error) reject(error);
        resolve(result.secure_url);
      }).end(file.buffer);
    });
    promises.push(uploadPromise);
  });

  Promise.all(promises)
    .then(urls => {
      res.json({
        imageUrl: urls[0],
        permisUrl: urls[1],
        identiteUrl: urls[2]
      });
    })
    .catch(error => {
      res.status(500).send('Erreur lors de l\'upload des fichiers : ' + error);
    });
});

// Route pour ajouter un véhicule (POST)
app.post('/api/vehicles', (req, res) => {
  const { nomVehicule, plaque, vendeurNom, vendeurPrenom, acheteurNom, acheteurPrenom, prix, dateAchat, heureAchat } = req.body;

  // Ajouter un véhicule dans la "base de données" en mémoire
  const newVehicle = {
    nomVehicule,
    plaque,
    vendeurNom,
    vendeurPrenom,
    acheteurNom,
    acheteurPrenom,
    prix,
    dateAchat,
    heureAchat,
  };

  vehicles.push(newVehicle);
  res.status(201).json(newVehicle); // Retourner le véhicule ajouté
});

// Route pour récupérer tous les véhicules (GET)
app.get('/api/vehicles', (req, res) => {
  res.json(vehicles);
});

// Route pour effacer tous les véhicules (DELETE)
app.delete('/api/vehicles', (req, res) => {
  vehicles = []; // Vider la liste des véhicules
  res.status(200).send('Tous les véhicules ont été supprimés');
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur backend démarré sur http://localhost:${port}`);
});
