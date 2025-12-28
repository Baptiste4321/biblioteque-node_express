import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchBooks, deleteBook, borrowBook } from '../services/api';

const BookList = () => {
    const [books, setBooks] = useState([]);
    const navigate = useNavigate();

    // Vérification Admin
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    const isAdmin = user && user.role === 'admin';

    useEffect(() => {
        loadBooks();
    }, []);

    const loadBooks = async () => {
        try {
            const response = await fetchBooks();
            setBooks(response.data);
        } catch (error) {
            console.error("Erreur lors du chargement des livres", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce livre ?")) {
            try {
                await deleteBook(id);
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
            await borrowBook(id);
            alert("Livre emprunté avec succès !");
            loadBooks();
        } catch (error) {
            alert("Erreur : " + (error.response?.data?.error || "Impossible d'emprunter"));
        }
    };

    return (
        <div className="book-list-container">
            <h2>Bibliothèque</h2>

            {/* INTERFACE ADMIN : Bouton Ajouter */}
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
                                <>
                                    <button
                                        onClick={() => navigate(`/edit-book/${book.id}`, { state: { book } })}
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