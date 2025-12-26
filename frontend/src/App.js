import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import BookList from './components/BookList';
import AddBook from './components/AddBook';

function App() {
    return (
        <Router>
            <nav style={{ padding: '10px', background: '#f0f0f0', marginBottom: '20px' }}>
                <Link to="/">Accueil</Link> |{' '}
                <Link to="/register">Inscription</Link> |{' '}
                <Link to="/login">Connexion</Link> |{' '}
                <Link to="/add-book">Ajouter un livre (Admin)</Link>
            </nav>

            <Routes>
                <Route path="/" element={<BookList />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/add-book" element={<AddBook />} />
            </Routes>
        </Router>
    );
}

export default App;