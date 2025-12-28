const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Book = require('./Book');

const Review = sequelize.define('Review', {
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1, max: 5 }
    },
    comment: { type: DataTypes.TEXT, allowNull: true }
});

User.hasMany(Review);
Book.hasMany(Review);

module.exports = Review;