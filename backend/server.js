require('dotenv').config({ 'path': '.env' });
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');

// Import des configurations
const sequelize = require('./config/database');
const { swaggerUi, specs } = require('./config/swagger');

// Import des modèles (nécessaire pour sequelize.sync)
require('./models/User');
require('./models/Book');
require('./models/Loan');
require('./models/Review');

// Import des routes
const booksRoutes = require('./routes/books');
const usersRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const loansRoutes = require('./routes/loans');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan('combined'));

app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.send('Bienvenue sur notre API Express !');
});

app.use('/api/users', usersRoutes);
app.use('/api/books', booksRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/loans', loansRoutes);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs));

// Fonction de démarrage sécurisée
// Remplacez la fin de votre fichier server.js par ceci :

async function startApp() {
    try {
        console.log('--- Tentative de connexion ---');
        await sequelize.authenticate();
        console.log('✅ Connexion à la base de données établie.');

        await sequelize.sync({ force: false });
        console.log("✅ Base de données synchronisée");

        const server = app.listen(PORT, () => {
            console.log(`Serveur Express en écoute sur http://localhost:${PORT}`);
        });

        // Capture les erreurs spécifiques au serveur HTTP
        server.on('error', (err) => {
            console.error('❌ Erreur du serveur HTTP:', err);
        });

    } catch (error) {
        console.error("❌ Erreur lors du startApp:", error);
        process.exit(1);
    }
}

// Gestion des erreurs globales pour voir ce qui fait quitter Node
process.on('uncaughtException', (err) => {
    console.error('🔥 Erreur critique non capturée:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('🔥 Promesse non gérée rejetée:', reason);
});

startApp();