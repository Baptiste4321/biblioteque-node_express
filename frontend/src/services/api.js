import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};
const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
});

export const registerUser = (email, password) => axios.post(`${API_URL}/auth/register`, { email, password });

export const loginUser = (email, password) => axios.post(`${API_URL}/auth/login`, { email, password });

// LIVRES
export const fetchBooks = () => axios.get(`${API_URL}/books`);

export const createBook = (formData) => {
    return axios.post(`${API_URL}/books`, formData, {
        headers: { ...getAuthHeaders(), 'Content-Type': 'multipart/form-data' }
    });
};

// AJOUT : Modifier et Supprimer
export const updateBook = (id, data) => axios.put(`${API_URL}/books/${id}`, data, { headers: getAuthHeaders() });
export const deleteBook = (id) => axios.delete(`${API_URL}/books/${id}`, { headers: getAuthHeaders() });

// EMPRUNTS
export const borrowBook = (bookId) => axios.post(`${API_URL}/loans`, { bookId }, { headers: getAuthHeaders() });
export const returnBook = (loanId) => axios.post(`${API_URL}/loans/${loanId}/return`, {}, { headers: getAuthHeaders() });

// Pour afficher "Mes emprunts" (Il faudra peut-être créer cette route dans le backend si elle n'existe pas,
// sinon on filtre côté front ou on ajoute un endpoint GET /loans/my-loans dans backend/controllers/loans.js)
// Pour l'instant, supposons que nous créons une route dédiée dans le backend :
export const getMyLoans = () => axios.get(`${API_URL}/loans/my`, { headers: getAuthHeaders() });