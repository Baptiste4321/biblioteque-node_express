const Loan = require('../models/Loan');
const Book = require('../models/Book');
const User = require('../models/User');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: process.env.SMTP_USER || 'ton_user',
        pass: process.env.SMTP_PASS || 'ton_pass'
    }
});

exports.borrowBook = async (req, res) => {
    try {
        const { bookId } = req.body;
        const userId = req.user.id;

        const book = await Book.findByPk(bookId);
        if (!book) return res.status(404).json({ error: "Livre non trouvé" });
        if (book.stock <= 0) return res.status(400).json({ error: "Livre indisponible" });

        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 14);

        const loan = await Loan.create({
            UserId: userId,
            BookId: bookId,
            dueDate: dueDate
        });

        book.stock -= 1;
        await book.save();

        res.status(201).json({ message: "Livre emprunté", loan });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Rendre un livre
exports.returnBook = async (req, res) => {
    try {
        const { loanId } = req.params;
        const loan = await Loan.findByPk(loanId, { include: [User, Book] });

        if (!loan) return res.status(404).json({ error: "Emprunt non trouvé" });
        if (loan.status === 'returned') return res.status(400).json({ error: "Livre déjà rendu" });

        const now = new Date();
        loan.returnDate = now;
        loan.status = 'returned';

        //Calcul des frais de retard
        let message = "Livre rendu avec succès.";
        if (now > loan.dueDate) {
            const diffTime = Math.abs(now - loan.dueDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const penalty = diffDays * 0.50;

            loan.User.balance -= penalty;
            await loan.User.save();

            loan.status = 'late';
            message = `Livre rendu en retard. Pénalité de ${penalty}€ appliquée.`;
        }

        await loan.save();

        const book = await Book.findByPk(loan.BookId);
        book.stock += 1;
        await book.save();

        await sendReturnEmail(loan.User.email, book.title, message);

        res.status(200).json({ message });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getMyLoans = async (req, res) => {
    try {
        const Loan = require('../models/Loan');
        const Book = require('../models/Book');
        // Récupérer les emprunts de l'utilisateur (actifs ou tous)
        const loans = await Loan.findAll({
            where: { UserId: req.user.id },
            include: [Book]
        });
        res.status(200).json(loans);
    } catch (e) { res.status(500).json({ error: e.message }); }
};
async function sendReturnEmail(email, bookTitle, statusMessage) {
    const mailOptions = {
        from: '"Ma Bibliothèque" <no-reply@biblio.com>',
        to: email,
        subject: `Retour du livre : ${bookTitle}`,
        text: `Bonjour,\n\nVous avez rendu le livre "${bookTitle}".\n${statusMessage}\n\nN'oubliez pas de laisser une note et un commentaire !\n\nCordialement.`
    };

    transporter.sendMail(mailOptions).catch(console.error);
}