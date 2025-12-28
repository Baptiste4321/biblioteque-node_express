import React, { useState, useEffect } from 'react';
import { createBook } from '../services/api';
import { useNavigate } from 'react-router-dom';

const AddBook = () => {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [isbn, setIsbn] = useState('');
    const [stock, setStock] = useState(1);
    const [file, setFile] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        if (!token || role !== 'admin') {
            alert("Accès réservé aux administrateurs connectés.");
            navigate('/login');
        }
    }, [navigate]);
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', title);
        formData.append('author', author);
        formData.append('isbn', isbn);
        formData.append('stock', stock);
        if (file) {
            formData.append('cover', file);
        }

        try {
            await createBook(formData);
            alert('Livre ajouté !');
            navigate('/');
        } catch (error) {
            console.error(error);
            alert("Erreur: Êtes-vous connecté en tant qu'ADMIN ?");
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: 'auto' }}>
            <h2>Ajouter un livre</h2>
            <div>
                <input type="text" placeholder="Titre" value={title} onChange={e => setTitle(e.target.value)} required />
            </div>
            <div>
                <input type="text" placeholder="Auteur" value={author} onChange={e => setAuthor(e.target.value)} required />
            </div>
            <div>
                <input type="text" placeholder="ISBN" value={isbn} onChange={e => setIsbn(e.target.value)} required />
            </div>
            <div>
                <input type="number" placeholder="Stock" value={stock} onChange={e => setStock(e.target.value)} />
            </div>
            <div>
                <label>Couverture : </label>
                <input type="file" onChange={e => setFile(e.target.files[0])} />
            </div>
            <button type="submit">Ajouter</button>
        </form>
    );
};

export default AddBook;