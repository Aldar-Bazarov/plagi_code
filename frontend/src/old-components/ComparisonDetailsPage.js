import React, { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import Header from '../Components/Header';
import './ResultAigc.css';

const ComparisonDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Проверяем, есть ли данные сравнения в location.state
    if (!location.state || !location.state.comparison) {
      // Если данных нет, перенаправляем на главную страницу
      navigate('/');
      return;
    }

    // Устанавливаем данные сравнения из location.state
    setComparison(location.state.comparison);
    setLoading(false);
  }, [location, navigate]);

  // Функция для определения класса индикатора сходства
  const getSimilarityClass = (similarity) => {
    if (similarity >= 0.8) return 'high-probability';
    if (similarity >= 0.5) return 'medium-probability';
    return 'low-probability';
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="loading-container">
          <p>Загрузка данных сравнения...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      
      <h2 className='result-header'>Детальное сравнение кода</h2>
      
      {comparison ? (
        <div className="app-content-resultai">
          <div className="comparison-header">
            <h3>Сравнение файлов: {comparison.file1} и {comparison.file2}</h3>
            <div className="similarity-badge">
              <span className="stat-label">Сходство:</span>
              <span className={getSimilarityClass(comparison.similarity)}>
                {(comparison.similarity * 100).toFixed(2)}%
              </span>
            </div>
          </div>
          
          <div className="comparison-result">
            <div className="file-comparison">
              <h3 className="result-filename">{comparison.file1}</h3>
              <div className="code-container">
                <pre className="code-block">
                  {typeof comparison.code1 === 'string' ? comparison.code1 : 'Некорректный формат данных'}
                </pre>
              </div>
            </div>
            
            <div className="comparison-indicators">
              <div className="similarity-arrow">→</div>
              <div className="similarity-indicator">
                <div className={`similarity-meter ${getSimilarityClass(comparison.similarity)}`}></div>
              </div>
              <div className="similarity-arrow">←</div>
            </div>
            
            <div className="file-comparison">
              <h3 className="result-filename">{comparison.file2}</h3>
              <div className="code-container">
                <pre className="code-block">
                  {typeof comparison.code2 === 'string' ? comparison.code2 : 'Некорректный формат данных'}
                </pre>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="no-results-container">
          <p>Нет данных для отображения сравнения.</p>
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
      </div>
    </div>
  );
};

export default ComparisonDetailsPage; 