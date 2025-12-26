import axios from 'axios';

// Utilisation de la variable d'env ou repli sur le localhost
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const registerUser = (email, password) => {
    return axios.post(`${API_URL}/auth/register`, { email, password });
};

export const loginUser = (email, password) => {
    return axios.post(`${API_URL}/auth/login`, { email, password });
};