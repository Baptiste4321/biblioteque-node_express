// Fichier : frontend/src/components/EditBook.js
import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { updateBook } from '../services/api';

const EditBook = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    // On récupère les infos du livre passées par BookList
    const bookToEdit = location.state?.book || {};

    const [formData, setFormData] = useState({
        title: bookToEdit.title || '',
        author: bookToEdit.author || '',
        isbn: bookToEdit.isbn || '',
        stock: bookToEdit.stock || 1
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateBook(id, formData);
            alert('Livre modifié avec succès !');
            navigate('/');
        } catch (error) {
            console.error("Erreur modification", error);
            alert("Erreur lors de la modification");
        }
    };

    return (
        <div className="form-container">
            <h2>Modifier le livre</h2>
            <form onSubmit={handleSubmit}>
                <input name="title" placeholder="Titre" value={formData.title} onChange={handleChange} required />
                <input name="author" placeholder="Auteur" value={formData.author} onChange={handleChange} required />
                <input name="isbn" placeholder="ISBN" value={formData.isbn} onChange={handleChange} required />
                <input type="number" name="stock" placeholder="Stock" value={formData.stock} onChange={handleChange} required />
                <button type="submit">Enregistrer</button>
            </form>
        </div>
    );
};

export default EditBook;