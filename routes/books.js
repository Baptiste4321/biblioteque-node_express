const express = require('express');
const router = express.Router();
const multer = require('multer');

// Configuration de Multer (stockage en mémoire temporaire avant envoi à MinIO)
const upload = multer({ storage: multer.memoryStorage() });

const bookCtrl = require('../controllers/books');
const auth = require('../middlewares/auth'); // Vérifie le token JWT
const isAdmin = require('../middlewares/isAdmin'); // Vérifie le rôle admin

/**
 * @swagger
 * /api/books:
 * post:
 * summary: Ajouter un livre (Admin seulement)
 * security:
 * - bearerAuth: []
 * requestBody:
 * content:
 * multipart/form-data:
 * schema:
 * type: object
 * properties:
 * title:
 * type: string
 * author:
 * type: string
 * isbn:
 * type: string
 * stock:
 * type: integer
 * cover:
 * type: string
 * format: binary
 */
router.post('/', auth, isAdmin, upload.single('cover'), bookCtrl.createBook);

module.exports = router;