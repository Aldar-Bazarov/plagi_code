import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './check-results.css';

interface FileData {
    aigc_percentage: number;
    codes: string[];
}

interface Results {
    files: {
        [filename: string]: FileData;
    };
}

interface LocationState {
    results?: Results;
}

interface SelectedFile extends FileData {
    filename: string;
}

const CheckResults: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(null);
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state as LocationState;
    const results = state && state.results ? state.results : null;

    if (!results) {
        return <div className="error">Нет данных для отображения результатов</div>;
    }

    const handleRowClick = (file: SelectedFile) => {
        setSelectedFile(file);
    };

    const handleBack = () => {
        navigate('/upload');
    };

    return (
        <div className="check-results-container">
            <div className="results-header">
                <h2>Результаты проверки на плагиат</h2>
                <div className="header-buttons">
                    <button 
                        className="check-similarity-button"
                        onClick={() => navigate('/similarity-matrix')}
                    >
                        Проверить отчёты на схожесть
                    </button>
                    <button 
                        className="back-button"
                        onClick={handleBack}
                    >
                        Вернуться
                    </button>
                </div>
            </div>

            <div className="check-type-label">
                <h3>Проверка на нейросетевой плагиат</h3>
                <p>Результаты проверки файлов на наличие плагиата с использованием нейросетевых моделей</p>
            </div>

            <div className="results-content">
                <div className="results-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Название файла</th>
                                <th>Вероятность плагиата</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(results.files).map(([filename, fileData], index) => (
                                <tr 
                                    key={index}
                                    onClick={() => handleRowClick({ filename, ...fileData })}
                                    className={selectedFile && selectedFile.filename === filename ? 'selected' : ''}
                                >
                                    <td>{filename}</td>
                                    <td>{!fileData.codes || fileData.codes.length === 0 ? '?' : (fileData.aigc_percentage * 100).toFixed(1) + '%'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {selectedFile && (
                    <div className="file-details">
                        <h3>{selectedFile.filename}</h3>
                        <div className="plagiarism-info">
                            <p>Вероятность плагиата: {!selectedFile.codes || selectedFile.codes.length === 0 ? '?' : (selectedFile.aigc_percentage * 100).toFixed(1) + '%'}</p>
                        </div>
                        <div className="code-block">
                            <pre>{!selectedFile.codes || selectedFile.codes.length === 0 ? 'Код не найден. Возможно, обучающийся вставил код в виде скриншота.' : selectedFile.codes.join('\n\n')}</pre>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CheckResults; 