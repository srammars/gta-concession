require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

const app = express();
const port = 3000;

// Configurer Cloudinary avec les variables d'environnement
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Middleware pour gérer les fichiers téléchargés
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Permet de gérer les requêtes JSON et les fichiers
app.use(express.json());

// Endpoint pour uploader une image sur Cloudinary
app.post('/upload', upload.fields([
  { name: 'image' }, 
  { name: 'permis' }, 
  { name: 'identite' }
]), (req, res) => {
  if (!req.files) {
    return res.status(400).send('Aucun fichier n\'a été téléchargé.');
  }

  const files = req.files;
  const promises = [];

  // Upload de chaque fichier vers Cloudinary
  Object.keys(files).forEach(fileKey => {
    const file = files[fileKey][0];  // Il peut y avoir plusieurs fichiers par clé
    const uploadPromise = new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
        if (error) reject(error);
        resolve(result.secure_url);
      }).end(file.buffer);
    });
    promises.push(uploadPromise);
  });

  // Attendre que tous les fichiers soient uploadés
  Promise.all(promises)
    .then(urls => {
      res.json({
        imageUrl: urls[0],   // URL de l'image principale
        permisUrl: urls[1],  // URL du permis de conduire
        identiteUrl: urls[2] // URL de la pièce d'identité
      });
    })
    .catch(error => {
      res.status(500).send('Erreur lors de l\'upload des fichiers : ' + error);
    });
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur backend démarré sur http://localhost:${port}`);
});
