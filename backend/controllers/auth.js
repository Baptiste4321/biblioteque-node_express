const authService = require('../services/auth');

exports.login = async (email, password) => {
    if (typeof email == 'undefined' || typeof password == 'undefined') {
        throw new Error("Renseigner tous les champs !");
    }

    try {
        return await authService.login(email, password);
    } catch(error) {
        throw error;
    }
}