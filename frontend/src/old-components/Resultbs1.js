import React, { Component } from 'react'
import "./Resultai.css";

export default class Resultbs extends Component {
  render() {
    const { results } = this.props; // Access results from props
    
    // Выводим в консоль полученные данные для отладки
    console.log("Результаты сравнения:", results);

    if (!results || Object.keys(results).length === 0) {
      return <p>Нет данных для отображения.</p>;
    }

    return (
      <div className="app-content-resultai">
        <div className="results-grid">
          {results.map((result, index) => {
            console.log(`Результат сравнения ${index}:`, result);
            
            return (
              <div key={index} className="result-card">
                <div className="comparison-result">
                  <div className="file-comparison">
                    <h3 className="result-filename">{result.file1}</h3>
                    <div className="code-container">
                      <pre className="code-block">
                        {typeof result.code1 === 'string' ? result.code1 : 'Некорректный формат данных'}
                      </pre>
                    </div>
                  </div>
                  
                  <div className="similarity-indicator">
                    <p className="similarity-value">
                      <span className="stat-label">Сходство:</span> 
                      <span className={parseInt(result.similarity * 100) > 50 ? "high-probability" : "low-probability"}>
                        {(result.similarity * 100).toFixed(2)}%
                      </span>
                    </p>
                  </div>
                  
                  <div className="file-comparison">
                    <h3 className="result-filename">{result.file2}</h3>
                    <div className="code-container">
                      <pre className="code-block">
                        {typeof result.code2 === 'string' ? result.code2 : 'Некорректный формат данных'}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
