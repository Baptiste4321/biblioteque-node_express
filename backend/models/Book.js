const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Book = sequelize.define('Book', {
    title: { type: DataTypes.STRING, allowNull: false },
    author: { type: DataTypes.STRING, allowNull: false },
    isbn: { type: DataTypes.STRING, unique: true },
    coverUrl: { type: DataTypes.STRING, comment: "URL de l'image MinIO" },
    stock: { type: DataTypes.INTEGER, defaultValue: 1 }
});

module.exports = Book;