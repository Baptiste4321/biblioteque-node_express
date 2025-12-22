module.exports = (req, res, next) => {
    // req.user est rempli par le middleware auth.js précédent (via le JWT)
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({ message: "Accès refusé. Réservé aux administrateurs." });
    }
};