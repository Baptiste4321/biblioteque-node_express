const express = require("express");
const router = express.Router();

const authCtrl = require('../controllers/auth');
const userCtrl = require('../controllers/users');
router.post('/login', async (req, res) => {
    if (typeof req.body == 'undefined') {
        return res.status(500).json({"error": "Aucune donnée reçu !"});
    }
    const {email, password} = req.body;

    try {
        const { token, user } = await authCtrl.login(email, password);

        // On renvoie le token ET les infos de l'utilisateur (sans le mot de passe)
        return res.status(200).json({
            jwt: token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        });
    } catch(error) {
        res.status(500).json({"error": error.message});
    }
});

router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body; // À ajouter avant l'appel à userCtrl

        // On utilise la fonction insertOne que tu as déjà créée dans users controller
        await userCtrl.insertOne(email, password);
        res.status(201).json({"message": "Utilisateur créé avec succès !"});
    } catch(error) {
        res.status(500).json({"error": error.message});
    }
});

module.exports = router;