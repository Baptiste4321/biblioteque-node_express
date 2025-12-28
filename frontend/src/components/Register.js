import React, { useState } from 'react';
import { registerUser } from '../services/api';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await registerUser(email, password);
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response?.data?.error || "Erreur lors de l'inscription");
        }
    };

    return (
        <div>
            <h2>Inscription</h2>
            <form onSubmit={handleSubmit}>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">S'inscrire</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Register;