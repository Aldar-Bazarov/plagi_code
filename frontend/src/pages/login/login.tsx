import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
import Footer from '../../components/footer/footer';

const Login: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        if (email === 'v.n.stryukov@utmn.ru' && password === 'L@HuGi200204') {
            localStorage.setItem('token', 'authorized');
            navigate('/upload');
        } else {
            setError('Неверный логин или пароль');
        }
    };

    return (
        <div className="page-container">
            <div className="login-container">
                <div className="login-box">
                    <h2>Вход в систему</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Email:</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="example@utmn.ru"
                            />
                        </div>
                        <div className="form-group">
                            <label>Пароль:</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {error && <div className="error-message">{error}</div>}
                        <button type="submit" className="submit-button">
                            Войти
                        </button>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Login; 