const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/User');

exports.login = async (email, password) => {
    const user = await userModel.findOne({ where: { email } });
    if (!user) throw Error("Email non trouvé");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw Error("Mot de passe incorrect");

    const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    // CORRECTION : On retourne un objet contenant le token ET l'utilisateur
    return { token, user };
}