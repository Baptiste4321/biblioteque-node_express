const minioService = require('../services/minio');
const booksService = require('../services/books');
const Book = require('../models/Book');
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
exports.modifyBook = async (req, res) => {
    try {
        const book = await Book.findByPk(req.params.id);
        if (!book) return res.status(404).json({ error: "Livre non trouvé" });

        // Mise à jour des champs
        const { title, author, isbn, stock } = req.body;

        // Gestion simple : on met à jour si le champ est présent
        if (title) book.title = title;
        if (author) book.author = author;
        if (isbn) book.isbn = isbn;
        if (stock) book.stock = stock;

        await book.save();
        res.status(200).json({ message: "Livre modifié !", book });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteBook = async (req, res) => {
    try {
        const book = await Book.findByPk(req.params.id);
        if (!book) return res.status(404).json({ error: "Livre non trouvé" });

        await book.destroy();
        res.status(200).json({ message: "Livre supprimé !" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// Vérifiez bien cette ligne d'export :
module.exports = {
    createBook,
    getAllBooks,
    modifyBook,
    deleteBook
};