import React, { useEffect, useState } from 'react';
import { fetchBooks, deleteBook, borrowBook } from '../services/api';

const BookList = () => {
    const [books, setBooks] = useState([]);
    const role = localStorage.getItem('role'); // 'admin' ou 'client'
    const isConnected = !!localStorage.getItem('token');

    const loadBooks = () => fetchBooks().then(res => setBooks(res.data));

    useEffect(() => { loadBooks(); }, []);

    const handleDelete = async (id) => {
        if(window.confirm("Supprimer ce livre ?")) {
            await deleteBook(id);
            loadBooks();
        }
    };

    const handleBorrow = async (id) => {
        try {
            await borrowBook(id);
            alert("Livre emprunté avec succès !");
            loadBooks(); // Pour mettre à jour le stock
        } catch (err) {
            alert(err.response?.data?.error || "Erreur emprunt");
        }
    };

    return (
        <div className="container">
            <h2>Bibliothèque</h2>
            <div className="grid">
                {books.map(book => (
                    <div key={book.id} className="card">
                        {book.coverUrl && <img src={book.coverUrl} alt={book.title} />}
                        <div className="card-content">
                            <h3>{book.title}</h3>
                            <p><i>{book.author}</i></p>
                            <p>Stock: {book.stock}</p>

                            <div className="actions">
                                {/* Admin Actions */}
                                {role === 'admin' && (
                                    <>
                                        <button className="btn-danger" onClick={() => handleDelete(book.id)}>Supprimer</button>
                                        {/* Pour modifier, l'idéal est de rediriger vers une page /edit-book/:id */}
                                    </>
                                )}

                                {/* Client Actions */}
                                {isConnected && role !== 'admin' && book.stock > 0 && (
                                    <button className="btn-primary" onClick={() => handleBorrow(book.id)}>Emprunter</button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BookList;