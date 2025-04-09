
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Connexion BDD
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'gta_concession'
});

db.connect(err => {
  if (err) throw err;
  console.log('✅ Connecté à la base de données MySQL');
});

// Middleware auth
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).send('Token requis');
  jwt.verify(token, 'secret_key', (err, decoded) => {
    if (err) return res.status(403).send('Token invalide');
    req.user = decoded;
    next();
  });
};

// Multer (upload d'images)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// CRUD Véhicules
app.get('/vehicules', (req, res) => {
  db.query('SELECT * FROM vehicules', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

app.post('/vehicules', upload.single('image'), (req, res) => {
  const { marque, modele, type, prix } = req.body;
  const image_url = req.file ? '/uploads/' + req.file.filename : '';
  db.query('INSERT INTO vehicules (marque, modele, type, prix, image_url) VALUES (?, ?, ?, ?, ?)',
    [marque, modele, type, prix, image_url], err => {
      if (err) return res.status(500).send(err);
      res.sendStatus(201);
    });
});

// Start the server
app.listen(port, () => console.log(`🚀 Serveur backend lancé sur http://localhost:${port}`));
