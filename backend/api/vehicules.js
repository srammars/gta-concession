import express from 'express';

const app = express();

app.get('/vehicules', (req, res) => {
  res.json({ message: 'Liste des véhicules' });
});

export default app;
