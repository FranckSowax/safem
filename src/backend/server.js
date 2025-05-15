/**
 * Point d'entrée principal du serveur backend Safem
 * Ce fichier configure et démarre le serveur Express.
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const errorHandler = require('./middleware/error');

// Routes
const productsRoutes = require('./routes/products');
// Importer d'autres routes au fur et à mesure qu'elles sont créées

// Initialisation de l'application Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging en développement
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Routes API
app.use('/api/products', productsRoutes);
// Ajouter d'autres routes ici au fur et à mesure

// Route de base pour tester que l'API fonctionne
app.get('/', (req, res) => {
  res.json({
    message: 'Bienvenue sur l\'API Safem',
    version: '1.0.0',
    status: 'online',
    timestamp: new Date().toISOString()
  });
});

// Middleware de gestion des erreurs (doit être le dernier middleware)
app.use(errorHandler);

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur Safem en cours d'exécution sur le port ${PORT}`);
  console.log(`Environnement: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Heure de démarrage: ${new Date().toISOString()}`);
});

// Gestion de l'arrêt propre du serveur
process.on('SIGTERM', () => {
  console.log('Signal SIGTERM reçu. Arrêt du serveur...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('Signal SIGINT reçu. Arrêt du serveur...');
  process.exit(0);
});

module.exports = app; // Pour les tests
