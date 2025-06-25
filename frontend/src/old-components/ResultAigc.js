import React, { useEffect, useState } from 'react';
import Header from '../Components/Header';
import Resultai from '../Components/Resultai';
import "./ResultAigc.css";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

const ResultAigc = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Проверяем авторизацию
    const token = localStorage.getItem('token');
    if (!token) {
      navigate("/login");
      return;
    }

    // Проверяем, есть ли данные результатов в location.state
    if (!location.state || !location.state.results) {
      // Если данных нет, перенаправляем на страницу загрузки
      navigate("/upload");
      return;
    }

    // Устанавливаем результаты из location.state
    setResults(location.state.results);
    setLoading(false);
  }, [location, navigate]);

  // Проверяем, был ли загружен только один файл
  const isSingleFile = Object.keys(results).length === 1;

  if (loading) {
    return (
      <div id="root">
        <Header />
        <div className="loading-container">
          <p>Загрузка результатов...</p>
        </div>
      </div>
    );
  }

  return (
    <div id="root">
      <Header />
      <div className="result-content">
        <h2 className='result-header'>Проверка на нейросетевой плагиат</h2>
        <Resultai results={results} />
        
        <div className="button-container">
          {isSingleFile ? (
            <NavLink to="/upload" className="button-link-center">
              <button type="submit" className="check-button-results">
                Вернуться
              </button>
            </NavLink>
          ) : (
            <>
              <NavLink to="/upload" className="button-link">
                <button type="submit" className="check-button-results">
                  Вернуться
                </button>
              </NavLink>
              <NavLink to="/similarity_matrix" state={{ results: location.state.results }} className="button-link">
                <button type="submit" className="check-button-results">
                  Матрица сходства
                </button>
              </NavLink>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultAigc;
