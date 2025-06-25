import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Resultai.css';

const SimilarityMatrix = ({ similarityMatrix, comparisons }) => {
  const navigate = useNavigate();
  const fileNames = Object.keys(similarityMatrix);
  
  // Обработчик клика по ячейке матрицы
  const handleCellClick = (file1, file2) => {
    if (file1 === file2) return; // Игнорируем клик по диагонали
    
    // Находим лучшее сравнение для этой пары файлов
    const comparison = comparisons.find(comp => 
      (comp.file1 === file1 && comp.file2 === file2) || 
      (comp.file1 === file2 && comp.file2 === file1)
    );
    
    if (comparison) {
      // Переходим на страницу детального сравнения
      navigate('/comparison_details', { 
        state: { comparison }
      });
    }
  };
  
  // Функция для определения класса ячейки в зависимости от значения сходства
  const getCellClass = (similarity) => {
    if (similarity === 1.0) return 'similarity-self'; // Диагональ
    if (similarity >= 0.8) return 'similarity-high';
    if (similarity >= 0.5) return 'similarity-medium';
    return 'similarity-low';
  };
  
  return (
    <div className="similarity-matrix-container">
      <h3>Матрица сходства файлов</h3>
      
      <div className="matrix-table-container">
        <table className="similarity-matrix">
          <thead>
            <tr>
              <th></th>
              {fileNames.map(fileName => (
                <th key={fileName} className="filename-header">{fileName}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {fileNames.map(rowFile => (
              <tr key={rowFile}>
                <th className="filename-header">{rowFile}</th>
                {fileNames.map(colFile => {
                  const similarity = similarityMatrix[rowFile][colFile];
                  const percentSimilarity = (similarity * 100).toFixed(1);
                  
                  return (
                    <td 
                      key={`${rowFile}-${colFile}`}
                      className={getCellClass(similarity)}
                      onClick={() => handleCellClick(rowFile, colFile)}
                      style={{ cursor: rowFile !== colFile ? 'pointer' : 'default' }}
                    >
                      {percentSimilarity}%
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="legend">
        <div className="legend-item">
          <span className="legend-color similarity-high"></span>
          <span>Высокое сходство (&gt;80%)</span>
        </div>
        <div className="legend-item">
          <span className="legend-color similarity-medium"></span>
          <span>Среднее сходство (50-80%)</span>
        </div>
        <div className="legend-item">
          <span className="legend-color similarity-low"></span>
          <span>Низкое сходство (&lt;50%)</span>
        </div>
      </div>
    </div>
  );
};

export default SimilarityMatrix; 