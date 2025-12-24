const Book = require('../models/Book');

const createBook = async (data) => {
    try {
        const newBook = await Book.create(data);
        return newBook;
    } catch (error) {
        throw new Error("Erreur lors de la création du livre : " + error.message);
    }
};

module.exports = { createBook };