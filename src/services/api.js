import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

export const registerUser = (email, password) => {
    return axios.post(`${API_URL}/auth/register`, { email, password });
};

export const loginUser = (email, password) => {
    return axios.post(`${API_URL}/auth/login`, { email, password });
};