const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: {
        type: DataTypes.ENUM('client', 'admin'),
        defaultValue: 'client'
    },
    balance: {
        type: DataTypes.FLOAT,
        defaultValue: 0.0,
        comment: "Solde négatif = dette/frais de retard"
    }
});

module.exports = User;