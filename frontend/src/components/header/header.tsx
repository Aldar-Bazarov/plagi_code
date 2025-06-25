import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './header.css';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="header">
      <div className="header-content">
        <h1 className="logo">PlagiCode</h1>
        {location.pathname !== '/login' && (
          <button
            className="history-button"
            onClick={() => navigate('/history')}
          >
            История проверок
          </button>
        )}
      </div>
    </header>
  );
};

export default Header; 