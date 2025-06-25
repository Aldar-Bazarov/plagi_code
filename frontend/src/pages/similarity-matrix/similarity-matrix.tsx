import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './similarity-matrix.css';

const MAX_FILENAME_LENGTH = 20;

type MatrixType = number[][];

type FilesType = string[];

const SimilarityMatrix: React.FC = () => {
    const [matrix, setMatrix] = useState<MatrixType>([]);
    const [files, setFiles] = useState<FilesType>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSimilarityMatrix = async () => {
            try {
                const response = await fetch('http://localhost:8000/similarity-matrix', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Ошибка при получении матрицы схожести');
                }

                const data = await response.json();
                setMatrix(data.matrix);
                setFiles(data.files);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSimilarityMatrix();
    }, []);

    const handleBack = () => {
        navigate('/check-results');
    };

    if (loading) {
        return <div className="loading">Загрузка матрицы схожести...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="similarity-matrix-container">
            <div className="matrix-header">
                <h2>Матрица схожести отчётов</h2>
                <button className="back-button" onClick={handleBack}>
                    Вернуться
                </button>
            </div>

            <div className="check-type-label">
                <h3>Проверка отчётов на схожесть</h3>
                <p>Матрица схожести между всеми проверенными отчётами. Значения показывают степень схожести между документами (от 0 до 1)</p>
            </div>

            <div className="matrix-content">
                <table className="similarity-table">
                    <thead>
                        <tr>
                            <th></th>
                            {files.map((file, index) => (
                                <th key={index} title={file}>
                                    {file.length > MAX_FILENAME_LENGTH ? file.substring(0, MAX_FILENAME_LENGTH) + '...' : file}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {matrix.map((row, i) => (
                            <tr key={i}>
                                <th title={files[i]}>
                                    {files[i].length > MAX_FILENAME_LENGTH ? files[i].substring(0, MAX_FILENAME_LENGTH) + '...' : files[i]}
                                </th>
                                {row.map((cell, j) => (
                                    <td 
                                        key={j}
                                        className={i === j ? 'diagonal' : cell > 0.7 ? 'high-similarity' : cell > 0.3 ? 'medium-similarity' : 'low-similarity'}
                                    >
                                        {cell.toFixed(2)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default SimilarityMatrix; 