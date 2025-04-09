
const express = require('express');
const mysql = require('mysql2');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 3001;

app.use(express.json());
app.use('/uploads', express.static('uploads'));

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'gta_concession'
});

db.connect(err => {
  if (err) throw err;
  console.log('✅ Connected to MySQL');
});

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// CRUD for vehicles
app.post('/vehicules', upload.single('image'), (req, res) => {
  const { marque, modele, prix, vendeur } = req.body;
  const image_url = req.file ? '/uploads/' + req.file.filename : '';
  db.query('INSERT INTO vehicules (marque, modele, prix, vendeur, image_url) VALUES (?, ?, ?, ?, ?)', [marque, modele, prix, vendeur, image_url], err => {
    if (err) return res.status(500).send(err);
    res.sendStatus(201);
  });
});

app.get('/vehicules', (req, res) => {
  db.query('SELECT * FROM vehicules', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// CRUD for clients
app.post('/clients', upload.single('identite'), (req, res) => {
  const { nom, prenom, joueur_id, permis_conduire } = req.body;
  const identite_url = req.file ? '/uploads/' + req.file.filename : '';
  db.query('INSERT INTO clients (nom, prenom, joueur_id, identite, permis_conduire) VALUES (?, ?, ?, ?, ?)', [nom, prenom, joueur_id, identite_url, permis_conduire], err => {
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

// CRUD for sales
app.post('/ventes', (req, res) => {
  const { client_id, vehicule_id, plaque, vendeur } = req.body;
  db.query('INSERT INTO ventes (client_id, vehicule_id, plaque, vendeur) VALUES (?, ?, ?, ?)', [client_id, vehicule_id, plaque, vendeur], err => {
    if (err) return res.status(500).send(err);
    res.sendStatus(201);
  });
});

app.get('/ventes', (req, res) => {
  db.query(`SELECT v.id, c.nom, c.prenom, v.plaque, v.vendeur, ve.marque, ve.modele, ve.prix, ve.image_url, v.date_vente
            FROM ventes v
            JOIN clients c ON v.client_id = c.id
            JOIN vehicules ve ON v.vehicule_id = ve.id`,
    (err, results) => {
      if (err) return res.status(500).send(err);
      res.json(results);
    });
});

app.listen(port, () => console.log('🚀 Server running on http://localhost:' + port));
