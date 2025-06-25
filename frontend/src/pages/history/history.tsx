import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './history.css';

interface Check {
    id: string;
    timestamp: string;
    files_count: number;
}

const History: React.FC = () => {
    const [checks, setChecks] = useState<Check[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        fetchChecks();
    }, [navigate]);

    const fetchChecks = async () => {
        try {
            const response = await fetch('http://localhost:8000/checks/history', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) {
                throw new Error('Ошибка при загрузке истории проверок');
            }
            const data = await response.json();
            setChecks(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="loading">Загрузка...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="history-container">
            <div className="history-header">
                <h2>История проверок</h2>
                <div className="header-buttons">
                    <button 
                        className="back-button"
                        onClick={() => navigate(-1)}
                    >
                        Вернуться
                    </button>
                    <button 
                        className="new-check-button"
                        onClick={() => navigate('/upload')}
                    >
                        Новая проверка
                    </button>
                </div>
            </div>
            {checks.length === 0 ? (
                <div className="no-checks">История проверок пуста</div>
            ) : (
                <table className="checks-table">
                    <thead>
                        <tr>
                            <th>Дата</th>
                            <th>Время</th>
                            <th>Количество файлов</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {checks.map((check) => (
                            <tr key={check.id}>
                                <td>{new Date(check.timestamp).toLocaleDateString()}</td>
                                <td>{new Date(check.timestamp).toLocaleTimeString()}</td>
                                <td>{check.files_count}</td>
                                <td>
                                    <button 
                                        className="view-details-button"
                                        onClick={() => navigate(`/check/${check.id}`)}
                                    >
                                        Подробнее
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default History; 