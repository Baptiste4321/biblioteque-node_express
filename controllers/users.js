const usersService = require('../services/users');

const getAll = async () => {
    try {
        return await usersService.getAll();
    } catch(error) {
        throw error;
    }
}

const insertOne = async (email, password) => {
    if (typeof email == 'undefined' || typeof password == 'undefined') {
        throw new Error("Renseigner tous les champs !");
    }

    try {
        await usersService.insertOne(email, password);
    } catch(error) {
        throw error;
    }
}

module.exports = {
    getAll,
    insertOne
}