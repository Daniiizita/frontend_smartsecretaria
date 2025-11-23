import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import HomePage from './pages/Home';
import LoginPage from './pages/Login';
import Dashboard from './pages/Dashboard';
import AlunosPage from './pages/Alunos';
import AlunoFormPage from './pages/AlunoForm';
import ProfessoresPage from './pages/Professores';
import ProfessorFormPage from './pages/ProfessorForm';
import TurmasPage from './pages/Turmas';
import TurmaFormPage from './pages/TurmaForm';
import ProtectedRoute from './routes/ProtectedRoute';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Rotas Protegidas */}
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        
        {/* Alunos */}
        <Route path="/alunos" element={
          <ProtectedRoute><AlunosPage /></ProtectedRoute>
        } />
        <Route path="/alunos/novo" element={
          <ProtectedRoute><AlunoFormPage /></ProtectedRoute>
        } />
        <Route path="/alunos/:id" element={
          <ProtectedRoute><AlunoFormPage /></ProtectedRoute>
        } />
        
        {/* Professores */}
        <Route path="/professores" element={
          <ProtectedRoute><ProfessoresPage /></ProtectedRoute>
        } />
        <Route path="/professores/novo" element={
          <ProtectedRoute><ProfessorFormPage /></ProtectedRoute>
        } />
        <Route path="/professores/:id" element={
          <ProtectedRoute><ProfessorFormPage /></ProtectedRoute>
        } />
        
        {/* Turmas */}
        <Route path="/turmas" element={
          <ProtectedRoute><TurmasPage /></ProtectedRoute>
        } />
        <Route path="/turmas/nova" element={
          <ProtectedRoute><TurmaFormPage /></ProtectedRoute>
        } />
        <Route path="/turmas/:id" element={
          <ProtectedRoute><TurmaFormPage /></ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
};
