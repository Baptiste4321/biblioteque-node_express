const minioService = require('../services/minio');
const booksService = require('../services/books');
const Book = require('../models/Book');

const createBook = async (req, res) => {
    try {
        const { title, author, isbn, stock } = req.body;
        const file = req.file;

        if (!title || !author || !isbn) {
            return res.status(400).json({ error: "Champs obligatoires manquants" });
        }

        let coverUrl = null;
        if (file) {
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

// CORRECTION ICI : Utilisez 'const' au lieu de 'exports.'
const modifyBook = async (req, res) => {
    try {
        const book = await Book.findByPk(req.params.id);
        if (!book) return res.status(404).json({ error: "Livre non trouvé" });

        const { title, author, isbn, stock } = req.body;

        // On vérifie si la valeur est fournie (undefined check) pour permettre les chaînes vides ou 0
        if (title !== undefined) book.title = title;
        if (author !== undefined) book.author = author;
        if (isbn !== undefined) book.isbn = isbn;
        // Correction critique : permet de mettre le stock à 0
        if (stock !== undefined) book.stock = parseInt(stock, 10);

        await book.save();
        res.status(200).json({ message: "Livre modifié !", book });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// CORRECTION ICI : Utilisez 'const' au lieu de 'exports.'
const deleteBook = async (req, res) => {
    try {
        const book = await Book.findByPk(req.params.id);
        if (!book) return res.status(404).json({ error: "Livre non trouvé" });

        await book.destroy();
        res.status(200).json({ message: "Livre supprimé !" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Maintenant, toutes les variables existent et peuvent être exportées
module.exports = {
    createBook,
    getAllBooks,
    modifyBook,
    deleteBook
};