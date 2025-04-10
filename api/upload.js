require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { IncomingForm } = require('formidable');

// Configurer Cloudinary avec les variables d'environnement
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Middleware pour gérer les fichiers téléchargés via Formidable
const upload = new IncomingForm();
upload.keepExtensions = true;

// Fonction handler pour Vercel (en tant que fonction serverless)
module.exports = async (req, res) => {
  if (req.method === 'POST') {
    // Utilisation de Formidable pour gérer l'upload de fichiers
    upload.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ error: 'Erreur lors de l\'upload des fichiers' });
      }

      try {
        // Utilisation de Cloudinary pour uploader les fichiers
        const fileKeys = Object.keys(files);
        const uploadPromises = fileKeys.map((fileKey) => {
          const file = files[fileKey][0]; // Chaque fichier
          return new Promise((resolve, reject) => {
            cloudinary.uploader.upload(file.filepath, { resource_type: 'auto' }, (error, result) => {
              if (error) reject(error);
              resolve(result.secure_url); // Récupérer l'URL sécurisée du fichier
            });
          });
        });

        // Attendre que tous les fichiers soient uploadés
        const uploadedFilesUrls = await Promise.all(uploadPromises);

        // Répondre avec les URLs des fichiers téléchargés
        res.status(200).json({
          imageUrl: uploadedFilesUrls[0],   // URL de l'image principale
          permisUrl: uploadedFilesUrls[1],  // URL du permis de conduire
          identiteUrl: uploadedFilesUrls[2] // URL de la pièce d'identité
        });
      } catch (uploadError) {
        res.status(500).json({ error: 'Erreur lors du téléchargement sur Cloudinary', details: uploadError });
      }
    });
  } else {
    res.status(405).json({ error: 'Méthode non autorisée' });
  }
};
