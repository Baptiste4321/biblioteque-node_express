const express = require("express");
const router = express.Router();

const authCtrl = require('../controllers/auth');

router.post('/login', async (req, res) => {
    if (typeof req.body == 'undefined') {
        return res.status(500).json({"error": "Aucune donnée reçu !"});
    }

    const {email, password} = req.body;

    try {
        const jwt = await authCtrl.login(email, password);
        return res.status(200).json({"jwt": jwt});
    } catch(error) {
        res.status(500).json({"error": error.message});
    }
});

router.post('/register', async (req, res) => {
    try {
        
    } catch(error) {
        res.status(500).json({"error": error.message});
    }
});

module.exports = router;