import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import de useNavigate et Link
import api from '../services/api'; // Assurez-vous d'importer votre service API

const BookList = () => {
    const [books, setBooks] = useState([]);
    const navigate = useNavigate();

    // Récupération de l'utilisateur et vérification du rôle
    // On suppose que l'objet user ressemble à { role: 'admin', ... }
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    const isAdmin = user && user.role === 'admin';

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const response = await api.get('/books');
            setBooks(response.data);
        } catch (error) {
            console.error("Erreur lors du chargement des livres", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce livre ?")) {
            try {
                await api.delete(`/books/${id}`);
                // On rafraîchit la liste après suppression
                setBooks(books.filter(book => book.id !== id));
                alert("Livre supprimé !");
            } catch (error) {
                console.error("Erreur lors de la suppression", error);
                alert("Erreur lors de la suppression");
            }
        }
    };

    const handleBorrow = async (id) => {
        try {
            await api.post(`/loans`, { bookId: id });
            alert("Livre emprunté avec succès !");
            // Optionnel : recharger les livres pour mettre à jour le stock
            fetchBooks();
        } catch (error) {
            alert("Erreur : " + (error.response?.data?.error || "Impossible d'emprunter"));
        }
    };

    return (
        <div className="book-list-container">
            <h2>Bibliothèque</h2>

            {/* Bouton Ajouter visible seulement pour l'admin */}
            {isAdmin && (
                <div style={{ marginBottom: '20px' }}>
                    <Link to="/add-book" className="btn-add">
                        ➕ Ajouter un nouveau livre
                    </Link>
                </div>
            )}

            <div className="books-grid">
                {books.map((book) => (
                    <div key={book.id} className="book-card">
                        {book.coverUrl && <img src={book.coverUrl} alt={book.title} className="book-cover" />}
                        <h3>{book.title}</h3>
                        <p>Auteur: {book.author}</p>
                        <p>Stock: {book.stock}</p>

                        <div className="book-actions">
                            {isAdmin ? (
                                // Interface ADMIN : Modifier / Supprimer
                                <>
                                    <button
                                        onClick={() => navigate(`/edit-book/${book.id}`)}
                                        className="btn-edit"
                                    >
                                        Modifier
                                    </button>
                                    <button
                                        onClick={() => handleDelete(book.id)}
                                        className="btn-delete"
                                        style={{ marginLeft: '10px', backgroundColor: '#ff4444', color: 'white' }}
                                    >
                                        Supprimer
                                    </button>
                                </>
                            ) : (
                                // Interface UTILISATEUR : Emprunter
                                <button
                                    onClick={() => handleBorrow(book.id)}
                                    disabled={book.stock <= 0}
                                    className="btn-borrow"
                                >
                                    {book.stock > 0 ? 'Emprunter' : 'Indisponible'}
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BookList;