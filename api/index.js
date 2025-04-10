require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

const app = express();
const port = 3000;  // Port par défaut pour développement, mais Vercel choisira automatiquement un port.

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.json());

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

app.listen(port, () => {
  console.log(`Serveur backend démarré sur http://localhost:${port}`);
});
