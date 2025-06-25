import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from '../../components/footer/footer';
import "./upload.css";

const Upload: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
    setFiles(selectedFiles);
    setError(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFiles = Array.from(e.dataTransfer.files);
    const validFiles = droppedFiles.filter(file => {
      const extension = file.name.split('.').pop()?.toLowerCase();
      return ['.doc', '.docx', '.pdf'].includes(`.${extension}`);
    });
    if (validFiles.length !== droppedFiles.length) {
      setError('Некоторые файлы имеют неподдерживаемый формат. Поддерживаются только .doc, .docx и .pdf файлы.');
    }
    setFiles(validFiles);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    try {
      const response = await fetch('http://localhost:8000/check-results-ai', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });
      if (!response.ok) {
        throw new Error('Ошибка при проверке файлов');
      }
      const data = await response.json();
      navigate('/check-results', { state: { results: data } });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getCheckTypeText = () => {
    if (files.length === 0) return "Проверить на плагиат";
    if (files.length === 1) return "Проверить на ИИ-плагиат";
    return "Проверить на плагиат и схожесть";
  };

  return (
    <div className="upload-container">
      <div className="upload-box">
        <form onSubmit={handleSubmit}>
          <div className="upload-area" onDragOver={handleDragOver} onDrop={handleDrop}>
            <input
              type="file"
              id="file-upload"
              multiple
              onChange={handleFileChange}
              accept=".doc,.docx,.pdf"
              style={{ display: 'none' }}
            />
            <label htmlFor="file-upload" className="upload-label">
              <div className="upload-icon">📄</div>
              <div className="upload-text">
                {files.length > 0 
                  ? `Выбрано файлов: ${files.length}` 
                  : "Перетащите файлы сюда или нажмите для выбора"}
              </div>
            </label>
          </div>
          {error && <div className="error-message">{error}</div>}
          <div className="buttons-container">
            <button 
              type="submit" 
              className="check-button"
              disabled={loading}
            >
              {loading ? "Проверка..." : getCheckTypeText()}
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default Upload; 