const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 3000;
dotenv.config();
app.use(express.json()); // Pour lire le JSON dans les requêtes
app.use(express.static('public'));

// Config Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Base utilisateurs (temporaire, pas de BDD ici)
const users = [];

// On ajoute un utilisateur manuel avec un mot de passe hashé
const addUserManually = async () => {
  const username = 'concess';
  const password = 'smallconcess'; // Mot de passe en clair

  // Vérifier si l'utilisateur existe déjà
  if (users.find(u => u.username === username)) {
    console.log('Utilisateur déjà existant');
    return;
  }

  // Hash du mot de passe
  const hashedPassword = await bcrypt.hash(password, 10);
  
  // Ajouter l'utilisateur à la base
  users.push({ username, password: hashedPassword });
  console.log('Utilisateur ajouté :', username);
};

// Appeler la fonction d'ajout d'utilisateur
addUserManually();

// Middleware d'authentification
const SECRET = 'vraimentSecret123';
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Route accueil
app.get('/', (req, res) => {
  res.send('Bienvenue sur la concession GTA!');
});

// ==========================
// AUTH : Register & Login
// ==========================

// Inscription
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ message: 'Utilisateur déjà existant' });
  }
  const hashed = await bcrypt.hash(password, 10);
  users.push({ username, password: hashed });
  res.json({ message: 'Inscription réussie' });
});

// Connexion
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (!user) return res.status(400).json({ message: 'Utilisateur non trouvé' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: 'Mot de passe incorrect' });

  const token = jwt.sign({ username }, SECRET, { expiresIn: '1h' });
  res.json({ token });
});

// ==========================
// Upload (protégé)
// ==========================

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/upload', authMiddleware, upload.fields([
  { name: 'image' }, { name: 'permis' }, { name: 'identite' }
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

// ==========================

app.listen(port, () => {
  console.log(`Serveur backend démarré sur http://localhost:${port}`);
});
