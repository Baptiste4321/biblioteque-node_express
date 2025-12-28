// backend/seed_books.js
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const sequelize = require('./config/database');
const Book = require('./models/Book');
const minioService = require('./services/minio');

const booksData = [
    { title: "1984", author: "George Orwell", isbn: "978-0451524935", stock: 8 },
    { title: "Harry Potter à l'école des sorciers", author: "J.K. Rowling", isbn: "978-0747532743", stock: 15 },
    { title: "Le Seigneur des Anneaux", author: "J.R.R. Tolkien", isbn: "978-0618640157", stock: 5 },
    { title: "L'Étranger", author: "Albert Camus", isbn: "978-0679720201", stock: 12 },
    { title: "Dune", author: "Frank Herbert", isbn: "978-0441172719", stock: 7 },
    { title: "Les Misérables", author: "Victor Hugo", isbn: "978-0451419439", stock: 3 },
    { title: "Fahrenheit 451", author: "Ray Bradbury", isbn: "978-1451673319", stock: 20 },
    { title: "Moby Dick", author: "Herman Melville", isbn: "978-1503280786", stock: 6 },
    { title: "Orgueil et Préjugés", author: "Jane Austen", isbn: "978-0141439518", stock: 9 },
    { title: "La Nuit des temps", author: "René Barjavel", isbn: "978-2266000010", stock: 11 }
];

async function seed() {
    try {
        console.log('🔄 Connexion à la base de données...');
        await sequelize.authenticate();
        console.log('✅ Connexion réussie.');

        await sequelize.sync();

        console.log('📚 Début du peuplement des livres avec upload MinIO...');

        let count = 0;

        for (const [index, book] of booksData.entries()) {
            // Construit le chemin vers l'image : backend/services/requete/cover/coverX.jpg
            const imageName = `cover${index + 1}.jpg`;
            const imagePath = path.join(__dirname, 'services', 'requete', 'cover', imageName);

            let coverUrl = null;

            // Vérifie si l'image existe localement avant de tenter l'upload
            if (fs.existsSync(imagePath)) {
                try {
                    // On lit le fichier pour simuler l'objet que Multer enverrait
                    const fileBuffer = fs.readFileSync(imagePath);
                    const fileStat = fs.statSync(imagePath);

                    const mockFile = {
                        originalname: imageName,
                        buffer: fileBuffer,
                        size: fileStat.size,
                        mimetype: 'image/jpeg' // On suppose que ce sont des JPG
                    };

                    console.log(`📤 Upload de ${imageName} vers MinIO...`);
                    // Utilisation de ton service MinIO existant
                    coverUrl = await minioService.uploadFile(mockFile);
                } catch (err) {
                    console.error(`❌ Erreur lors de l'upload de ${imageName} :`, err.message);
                }
            } else {
                console.warn(`⚠️ Fichier image non trouvé : ${imagePath}`);
            }

            // Enregistrement en base de données
            const [instance, created] = await Book.findOrCreate({
                where: { isbn: book.isbn },
                defaults: {
                    ...book,
                    coverUrl: coverUrl // L'URL retournée par MinIO (ex: http://localhost:9000/covers/...)
                }
            });

            if (created) {
                console.log(`✅ Ajouté : ${book.title}`);
                count++;
            } else {
                console.log(`ℹ️  Déjà existant : ${book.title} (Pas de modification)`);
            }
        }

        console.log(`\n🎉 Terminé ! ${count} livres ont été ajoutés.`);
    } catch (error) {
        console.error('❌ Erreur critique lors du script :', error);
    } finally {
        await sequelize.close();
    }
}

seed();