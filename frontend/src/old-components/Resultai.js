import React, { Component } from 'react';
import "./Resultai.css";

class Resultai extends Component {
  render() {
    const { results } = this.props; // Access results from props
    
    // Выводим в консоль полученные данные для отладки
    console.log("Полученные результаты:", results);

    if (!results || Object.keys(results).length === 0) {
      return <p>Нет данных для отображения.</p>;
    }

    return (
      <div className="app-content-resultai">
        {Object.entries(results).map(([filename, fileData]) => {
          console.log("Данные файла:", filename, fileData);
          
          // Получаем общий процент заимствования
          const averageAigcPercentage = fileData.aigc_percentage ? 
            (fileData.aigc_percentage * 100).toFixed(1) : 
            '0.0';
            
          // Объединяем все фрагменты кода в один блок
          const allCode = fileData.codes ? fileData.codes.join('\n\n') : '';
          
          return (
            <div key={filename} className="file-result-container">
              <h3 className="result-filename">{filename}</h3>
              
              <div className="file-summary">
                <div className={`file-summary-badge ${averageAigcPercentage > 50 ? 'high-risk' : 'low-risk'}`}>
                  Общая вероятность заимствования: <strong>{averageAigcPercentage}%</strong>
                </div>
              </div>
              
              <div className="code-result-card">
                <div className="result-stats">
                  <p className="probability">
                    <span className="stat-label">Вероятность заимствования:</span> 
                    <span className={averageAigcPercentage > 50 ? "high-probability" : "low-probability"}>
                      {averageAigcPercentage}%
                    </span>
                  </p>
                  <p className="verdict">
                    <span className="stat-label">Вердикт:</span> 
                    <span className={averageAigcPercentage > 50 ? "negative-verdict" : "positive-verdict"}>
                      {averageAigcPercentage > 50 ? 'Обнаружен плагиат' : 'Плагиат не обнаружен'}
                    </span>
                  </p>
                </div>
                <div className="code-container">
                  <p className="code-header">Выделенный код:</p>
                  <pre className="code-block">
                    {allCode}
                  </pre>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

export default Resultai;
