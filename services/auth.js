const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userModel = require('../models/user');

exports.login = async (email, password) => {
    const user = await userModel.findOne({ where: { email } });
    if (!user) throw Error("Email non trouvé");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw Error("Mot de passe incorrect");

    return await jwt.sign({ user: user }, process.env.JWT_SECRET, { expiresIn: '1h' });
}