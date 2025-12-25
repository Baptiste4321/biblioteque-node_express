const express = require('express');
const router = express.Router();

const loanCtrl = require('../controllers/loans'); // Assure-toi que ce fichier existe (étape précédente)
const auth = require('../middlewares/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     Loan:
 *       type: object
 *       properties:
 *         bookId:
 *           type: integer
 *           description: ID du livre à emprunter
 *           example: 1
 */

/**
 * @swagger
 * /api/loans:
 *   post:
 *     summary: Emprunter un livre
 *     tags:
 *       - Loans
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Loan'
 *     responses:
 *       '201':
 *         description: Livre emprunté avec succès
 *       '400':
 *         description: Livre indisponible ou stock épuisé
 *       '404':
 *         description: Livre non trouvé
 */
router.post('/', auth, loanCtrl.borrowBook);

/**
 * @swagger
 * /api/loans/{loanId}/return:
 *   post:
 *     summary: Rendre un livre
 *     tags:
 *       - Loans
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: loanId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de l'emprunt (Loan)
 *     responses:
 *       '200':
 *         description: Livre rendu avec succès (avec ou sans pénalité)
 *       '404':
 *         description: Emprunt non trouvé
 */
router.post('/:loanId/return', auth, loanCtrl.returnBook);

module.exports = router;