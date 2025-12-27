import React, { useEffect, useState } from 'react';
import { getMyLoans, returnBook } from '../services/api';

const MyLoans = () => {
    const [loans, setLoans] = useState([]);

    const loadLoans = () => {
        getMyLoans().then(res => setLoans(res.data)).catch(console.error);
    };

    useEffect(() => {
        loadLoans();
    }, []);

    const handleReturn = async (loanId) => {
        try {
            const res = await returnBook(loanId);
            alert(res.data.message);
            loadLoans(); // Rafraichir la liste
        } catch (err) {
            alert("Erreur lors du retour");
        }
    };

    return (
        <div className="container">
            <h2>Mes Emprunts</h2>
            <div className="grid">
                {loans.map(loan => (
                    <div key={loan.id} className="card loan-card">
                        <h3>{loan.Book ? loan.Book.title : "Livre inconnu"}</h3>
                        <p>À rendre le : {new Date(loan.dueDate).toLocaleDateString()}</p>
                        <p>Statut : <span className={`status ${loan.status}`}>{loan.status}</span></p>
                        {loan.status === 'active' || loan.status === 'late' ? (
                            <button onClick={() => handleReturn(loan.id)}>Rendre le livre</button>
                        ) : null}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyLoans;