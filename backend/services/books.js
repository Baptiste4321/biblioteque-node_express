const Book = require('../models/Book');

const createBook = async (data) => {
    try {
        const newBook = await Book.create(data);
        return newBook;
    } catch (error) {
        throw new Error("Erreur lors de la création du livre : " + error.message);
    }
};

const getAllBooks = async () => {
    try {
        return await Book.findAll();
    } catch (error) {
        throw new Error("Erreur lors de la récupération des livres : " + error.message);
    }
};

module.exports = { createBook, getAllBooks };