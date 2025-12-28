const bcrypt = require('bcrypt');

const userModel = require('../models/User');

const insertOne = async (email, password) => {
    if (password.length < 6) {
        throw new Error("Mot de passe trop petit !");
    }
    const role = email.endsWith('@admin.com') ? 'admin' : 'client';

    try {
        await userModel.create({
            email: email,
            password: await bcrypt.hash(password, 10),
            role: role
        });
    } catch (error) {
        throw new Error("Erreur lors de la création du user");
    }
}

const getAll = async () => {
    try {
        const users = await userModel.findAll();
        return users;
    } catch (error) {
        console.log(error);
        throw new Error("Erreur lors de la récupération des users");
    }
}

module.exports ={
    getAll,
    insertOne
}