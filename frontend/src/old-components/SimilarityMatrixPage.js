import React, { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import Header from '../Components/Header';
import SimilarityMatrix from '../Components/SimilarityMatrix';
import './ResultAigc.css';

const SimilarityMatrixPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [matrixData, setMatrixData] = useState(null);
  const [comparisons, setComparisons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Проверяем, есть ли данные результатов в location.state
    if (
      !location.state || 
      !location.state.results || 
      !location.state.results.similarity_matrix ||
      !location.state.results.comparisons
    ) {
      // Если данных нет или они неправильной структуры, перенаправляем на главную страницу
      navigate('/');
      return;
    }

    // Устанавливаем матрицу сходства и сравнения из location.state
    setMatrixData(location.state.results.similarity_matrix);
    setComparisons(location.state.results.comparisons || []);
    setLoading(false);
  }, [location, navigate]);

  if (loading) {
    return (
      <div>
        <Header />
        <div className="loading-container">
          <p>Загрузка матрицы сходства...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      
      <h2 className='result-header'>Матрица сходства кода</h2>
      
      {matrixData ? (
        <SimilarityMatrix 
          similarityMatrix={matrixData} 
          comparisons={comparisons} 
        />
      ) : (
        <div className="no-results-container">
          <p>Нет данных для отображения матрицы сходства. Загрузите не менее двух файлов для сравнения.</p>
        </div>
      )}

      <div className="button-container">
        <NavLink to="/results_bs" state={{ results: location.state.results }} className="button-link">
          <button type="submit" className="check-button-results">
            Вернуться
          </button>
        </NavLink>
        <NavLink to="/results_bs" state={{ results: location.state.results }} className="button-link">
          <button type="submit" className="check-button-results">
            Детали сравнений
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

export default SimilarityMatrixPage; 