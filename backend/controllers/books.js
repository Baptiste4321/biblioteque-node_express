const minioService = require('../services/minio');
const booksService = require('../services/books');

const createBook = async (req, res) => {
    try {
        const { title, author, isbn, stock } = req.body;
        const file = req.file; // Fichier envoyé par Multer

        if (!title || !author || !isbn) {
            return res.status(400).json({ error: "Champs obligatoires manquants" });
        }

        let coverUrl = null;
        if (file) {
            // Upload vers MinIO
            coverUrl = await minioService.uploadFile(file);
        }

        const bookData = {
            title,
            author,
            isbn,
            stock: stock || 1,
            coverUrl
        };

        const newBook = await booksService.createBook(bookData);
        res.status(201).json(newBook);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const getAllBooks = async (req, res) => {
    try {
        const books = await booksService.getAllBooks();
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
module.exports = { createBook };