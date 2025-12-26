import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Fonction utilitaire pour récupérer le token stocké (ex: lors du login)
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const registerUser = (email, password) => {
    return axios.post(`${API_URL}/auth/register`, { email, password });
};

export const loginUser = (email, password) => {
    return axios.post(`${API_URL}/auth/login`, { email, password });
};

// AJOUT : Récupérer les livres
export const fetchBooks = () => {
    return axios.get(`${API_URL}/books`);
};

// AJOUT : Créer un livre (nécessite token + FormData pour l'image)
export const createBook = (formData) => {
    return axios.post(`${API_URL}/books`, formData, {
        headers: {
            ...getAuthHeaders(),
            'Content-Type': 'multipart/form-data' // Important pour Multer
        }
    });
};