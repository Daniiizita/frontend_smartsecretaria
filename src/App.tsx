import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // Exemplo com react-router-dom

import HomePage from './pages/Home';
import LoginPage from './pages/Login';
import Dashboard from './pages/Dashboard';
import AlunosPage from './pages/Alunos';
import ProfessoresPage from './pages/Professores';
import ProtectedRoute from './routes/ProtectedRoute';

export const App: React.FC = () => {
  return (
    // O BrowserRouter habilita o roteamento
    <BrowserRouter>
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Rotas Protegidas */}
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="/alunos" element={
          <ProtectedRoute><AlunosPage /></ProtectedRoute>
        } />
        <Route path="/professores" element={
          <ProtectedRoute><ProfessoresPage /></ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
};
