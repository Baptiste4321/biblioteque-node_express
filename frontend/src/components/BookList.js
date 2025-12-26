import React, { useEffect, useState } from 'react';
import { fetchBooks } from '../services/api';

const BookList = () => {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        fetchBooks()
            .then(res => setBooks(res.data))
            .catch(err => console.error("Erreur chargement livres", err));
    }, []);

    return (
        <div>
            <h2>Bibliothèque</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                {books.map(book => (
                    <div key={book.id} style={{ border: '1px solid #ccc', padding: '10px', width: '200px' }}>
                        {/* Affichage de l'image si elle existe */}
                        {book.coverUrl && (
                            <img src={book.coverUrl} alt={book.title} style={{ width: '100%', height: 'auto' }} />
                        )}
                        <h3>{book.title}</h3>
                        <p>Auteur: {book.author}</p>
                        <p>Stock: {book.stock}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BookList;