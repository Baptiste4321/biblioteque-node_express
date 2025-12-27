import React, { useState } from 'react';
import { loginUser } from '../services/api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await loginUser(email, password);
            const token = response.data.jwt; // Ton API renvoie {"jwt": token}
            const user = response.data.user;

            // Stockage du token pour les futures requêtes (ex: emprunter un livre)
            localStorage.setItem('token', token);

            localStorage.setItem('role', user ? user.role : 'client');
            alert("Connexion réussie !");
            window.location.href = '/books'; // Redirection après succès
        } catch (err) {
            setError(err.response?.data?.error || "Email ou mot de passe incorrect");
        }
    };

    return (
        <div>
            <h2>Connexion</h2>
            <form onSubmit={handleSubmit}>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">Se connecter</button>
            </form>
            {error && <p style={{color: 'red'}}>{error}</p>}
        </div>
    );
};

export default Login;