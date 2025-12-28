import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { updateBook, fetchBooks } from '../services/api'; // Import fetchBooks pour recharger si besoin

const EditBook = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [formData, setFormData] = useState({
        title: '',
        author: '',
        isbn: '',
        stock: 1
    });

    useEffect(() => {
        if (location.state?.book) {
            setFormData(location.state.book);
        } else {
            fetchBooks().then(res => {
                const foundBook = res.data.find(b => b.id.toString() === id);
                if (foundBook) setFormData(foundBook);
            }).catch(err => console.error("Erreur chargement livre", err));
        }
    }, [id, location.state]);

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
                <button type="submit" className="btn-primary">Enregistrer</button>
            </form>
        </div>
    );
};

export default EditBook;