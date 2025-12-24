const User = require('./models/User');
const Book = require('./models/Book');
const Loan = require('./models/Loan');
const Review = require('./models/Review');
const booksRoutes = require('./routes/books');
const express = require('express');
require('dotenv').config({'path': '.env'});
const morgan = require('morgan');
const helmet = require('helmet');
const { swaggerUi, specs } = require('./config/swagger');

const sequelize = require('./config/database');
sequelize.sync({ alter: true }) // crée ou met à jour les tables
  .then(() => console.log("✅ Base de données synchronisée"))
  .catch(err => console.error("❌ Erreur :", err));

const usersRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');

// Créé l'application Express
const app = express();

// Changement de headers
app.use(helmet());

// Ajout des logs de connexion
app.use(morgan('combined'));

// parse la requete pour extraire le donnée JSON
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Première route d'accueil de l'API
app.get('/', (req, res) => {
  res.send('Bienvenue sur notre API Express !');
});

// Ajout les routes correspondant aux users
app.use('/api/users', usersRoutes);
app.use('/api/books', booksRoutes);
app.use('/api/auth',  authRoutes);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs));

// Lance le server
app.listen(PORT, () => {
  console.log(`Serveur Express en écoute sur http://localhost:${PORT}`);
});
sequelize.sync({ alter: true }) // Met à jour les tables avec les nouveaux champs