import React, { useEffect, useState } from 'react';
import Header from '../Components/Header';
import Resultbs from '../Components/Resultbs';
import "./ResultAigc.css";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

const ResultBS = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Проверяем, есть ли данные результатов в location.state
    if (!location.state || !location.state.results || !location.state.results.comparisons) {
      // Если данных нет или они неправильной структуры, перенаправляем на главную страницу
      navigate("/");
      return;
    }

    // Устанавливаем результаты сравнения из location.state
    setResults(location.state.results.comparisons || []);
    setLoading(false);
  }, [location, navigate]);

  // Проверяем, есть ли результаты сравнения
  const hasResults = results && results.length > 0;

  if (loading) {
    return (
      <div>
        <Header />
        <div className="loading-container">
          <p>Загрузка результатов сравнения...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
        
      <h2 className='result-header'>Проверка на межстуденческий плагиат</h2>

      {hasResults ? (
        <Resultbs results={results} />
      ) : (
        <div className="no-results-container">
          <p>Нет данных для сравнения файлов. Загрузите не менее двух файлов для сравнения.</p>
        </div>
      )}

      <div className="button-container">
        <NavLink to="/" className="button-link">
          <button type="submit" className="check-button-results">
            Вернуться
          </button>
        </NavLink>
        <NavLink to="/similarity_matrix" state={{ results: location.state.results }} className="button-link">
          <button type="submit" className="check-button-results">
            Матрица сходства
          </button>
        </NavLink>
        <NavLink to="/results_ai_plagiat" state={{ results: location.state.results.files || {} }} className="button-link">
          <button type="submit" className="check-button-results">
            Нейросетевой плагиат
          </button>
        </NavLink>
      </div>
    </div>
  );
};

export default ResultBS;