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

            const token = response.data.jwt;
            const user = response.data.user; // Maintenant, ceci contient bien l'objet user envoyé par le backend

            // Stockage
            localStorage.setItem('token', token);

            // CORRECTION IMPORTANTE :
            // BookList.js attend un objet JSON stocké sous la clé 'user'
            localStorage.setItem('user', JSON.stringify(user));

            // On peut garder 'role' si d'autres composants l'utilisent, mais 'user' est le plus important ici
            localStorage.setItem('role', user.role);

            alert("Connexion réussie !");
            window.location.href = '/books';
        } catch (err) {
            console.error(err);
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