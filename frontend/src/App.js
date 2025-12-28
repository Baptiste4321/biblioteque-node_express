import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

import Register from './components/Register';
import Login from './components/Login';
import BookList from './components/BookList';
import AddBook from './components/AddBook';
import EditBook from './components/EditBook';
import MyLoans from './components/MyLoans';

function App() {
    const isConnected = !!localStorage.getItem('token');
    const isAdmin = localStorage.getItem('role') === 'admin';

    return (
        <Router>
            <nav>
                <Link to="/">Accueil</Link>
                {!isConnected && (
                    <>
                        <Link to="/register">Inscription</Link>
                        <Link to="/login">Connexion</Link>
                    </>
                )}
                {isConnected && (
                    <>
                        <Link to="/my-loans">Mes Emprunts</Link>
                        {/* Bouton de déconnexion simple */}
                        <a href="/" onClick={() => { localStorage.clear(); }}>Déconnexion</a>
                    </>
                )}
                {isAdmin && <Link to="/add-book">Admin: Ajouter</Link>}
            </nav>

            <div className="container">
                <Routes>
                    <Route path="/" element={<BookList />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/my-loans" element={<MyLoans />} />
                    {/* Routes Admin */}
                    <Route path="/add-book" element={<AddBook />} />
                    <Route path="/edit-book/:id" element={<EditBook />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;