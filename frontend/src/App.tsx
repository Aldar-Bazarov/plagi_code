import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/header/header';
import Login from './pages/login/login';
import Upload from './pages/upload/upload';
import History from './pages/history/history';
import CheckResults from './pages/check-results/сheck-results';
import SimilarityMatrix from './pages/similarity-matrix/similarity-matrix';
import './styles/App.css';

const App: React.FC = () => {
    return (
        <div className="App">
            <Header />
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/upload" element={<Upload />} />
                <Route path="/history" element={<History />} />
                <Route path="/check-results" element={<CheckResults />} />
                <Route path="/similarity-matrix" element={<SimilarityMatrix />} />
                <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
        </div>
    );
}

export default App; 