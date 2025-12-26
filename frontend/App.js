import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';

function App() {
    return (
        <Router>
            <nav>
                <Link to="/register">Inscription</Link> | <Link to="/login">Connexion</Link>
            </nav>

            <Routes>
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<h1>Bienvenue à la Bibliothèque</h1>} />
            </Routes>
        </Router>
    );
}

export default App;