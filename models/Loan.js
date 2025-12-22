const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Book = require('./Book');

const Loan = sequelize.define('Loan', {
    loanDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    dueDate: { type: DataTypes.DATE, allowNull: false }, // Date prévue de retour
    returnDate: { type: DataTypes.DATE, allowNull: true }, // Date réelle
    status: {
        type: DataTypes.ENUM('active', 'returned', 'late'),
        defaultValue: 'active'
    }
});

User.hasMany(Loan);
Loan.belongsTo(User);
Book.hasMany(Loan);
Loan.belongsTo(Book);

module.exports = Loan;