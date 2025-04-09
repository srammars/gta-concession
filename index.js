// backend/index.js
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

// Auth - Register
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashed], err => {
    if (err) return res.status(500).send(err);
    res.sendStatus(201);
  });
});

// Auth - Login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
    if (err || results.length === 0) return res.status(401).send('Utilisateur inconnu');
    const match = await bcrypt.compare(password, results[0].password);
    if (!match) return res.status(401).send('Mot de passe incorrect');
    const token = jwt.sign({ id: results[0].id }, 'secret_key');
    res.json({ token });
  });
});

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

// Clients
app.post('/clients', (req, res) => {
  const { nom, prenom, identite, joueur_id } = req.body;
  db.query('INSERT INTO clients (nom, prenom, identite, joueur_id) VALUES (?, ?, ?, ?)',
    [nom, prenom, identite, joueur_id], err => {
      if (err) return res.status(500).send(err);
      res.sendStatus(201);
    });
});

app.get('/clients', (req, res) => {
  db.query('SELECT * FROM clients', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Ventes
app.post('/ventes', (req, res) => {
  const { client_id, vehicule_id, vendeur, plaque } = req.body;
  db.query('INSERT INTO ventes (client_id, vehicule_id, vendeur, plaque) VALUES (?, ?, ?, ?)',
    [client_id, vehicule_id, vendeur, plaque], err => {
      if (err) return res.status(500).send(err);
      res.sendStatus(201);
    });
});

app.get('/ventes', (req, res) => {
  db.query(`SELECT v.id, c.nom, c.prenom, v.plaque, v.vendeur, ve.marque, ve.modele, ve.type, ve.prix, ve.image_url, v.date_vente
            FROM ventes v
            JOIN clients c ON v.client_id = c.id
            JOIN vehicules ve ON v.vehicule_id = ve.id`,
    (err, results) => {
      if (err) return res.status(500).send(err);
      res.json(results);
    });
});

app.listen(port, () => console.log(`🚀 Serveur backend lancé sur http://localhost:${port}`));
