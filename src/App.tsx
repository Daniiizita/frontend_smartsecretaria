import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import HomePage from './pages/Home';
import LoginPage from './pages/Login';
import InicioPage from './pages/Inicio';
import AlunosPage from './pages/Alunos';
import AlunoFormPage from './pages/AlunoForm';
import AlunoDetalhePage from './pages/AlunoDetalhe';
import ProfessoresPage from './pages/Professores';
import ProfessorFormPage from './pages/ProfessorForm';
import ProfessorDetalhePage from './pages/ProfessorDetalhe';
import TurmasPage from './pages/Turmas';
import TurmaFormPage from './pages/TurmaForm';
import TurmaDetalhePage from './pages/TurmaDetalhe';
import MatriculasPage from './pages/Matriculas';
import MatriculaDetalhePage from './pages/MatriculaDetalhe';
import MatriculaFormPage from './pages/MatriculaForm';
import DocumentosPage from './pages/Documentos';
import DocumentoDetalhePage from './pages/DocumentoDetalhe';
import DocumentoFormPage from './pages/DocumentoForm';
import UsuariosPage from './pages/Usuarios';
import MeuPerfilPage from './pages/MeuPerfil';
import UsuarioFormPage from './pages/UsuarioForm';
import ProtectedRoute from './routes/ProtectedRoute';
import { UsuarioProvider } from './auth/UsuarioProvider';
import { RequireGestor } from './routes/RequireGestor';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <UsuarioProvider>
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Rotas Protegidas */}
        <Route path="/dashboard" element={
          <ProtectedRoute><InicioPage /></ProtectedRoute>
        } />
        
        {/* Alunos */}
        <Route path="/alunos" element={
          <ProtectedRoute><AlunosPage /></ProtectedRoute>
        } />
        <Route path="/alunos/novo" element={
          <ProtectedRoute><RequireGestor><AlunoFormPage /></RequireGestor></ProtectedRoute>
        } />
        <Route path="/alunos/:id" element={
          <ProtectedRoute><AlunoDetalhePage /></ProtectedRoute>
        } />
        <Route path="/alunos/:id/editar" element={
          <ProtectedRoute><RequireGestor><AlunoFormPage /></RequireGestor></ProtectedRoute>
        } />
        
        {/* Professores */}
        <Route path="/professores" element={
          <ProtectedRoute><RequireGestor><ProfessoresPage /></RequireGestor></ProtectedRoute>
        } />
        <Route path="/professores/novo" element={
          <ProtectedRoute><RequireGestor><ProfessorFormPage /></RequireGestor></ProtectedRoute>
        } />
        <Route path="/professores/:id" element={
          <ProtectedRoute><ProfessorDetalhePage /></ProtectedRoute>
        } />
        <Route path="/professores/:id/editar" element={
          <ProtectedRoute><RequireGestor><ProfessorFormPage /></RequireGestor></ProtectedRoute>
        } />
        
        {/* Turmas */}
        <Route path="/turmas" element={
          <ProtectedRoute><TurmasPage /></ProtectedRoute>
        } />
        <Route path="/turmas/nova" element={
          <ProtectedRoute><RequireGestor><TurmaFormPage /></RequireGestor></ProtectedRoute>
        } />
        <Route path="/turmas/:id" element={
          <ProtectedRoute><TurmaDetalhePage /></ProtectedRoute>
        } />
        <Route path="/turmas/:id/editar" element={
          <ProtectedRoute><RequireGestor><TurmaFormPage /></RequireGestor></ProtectedRoute>
        } />

        {/* Matrículas (gestão escolar) */}
        <Route path="/matriculas" element={<ProtectedRoute><MatriculasPage /></ProtectedRoute>} />
        <Route path="/matriculas/nova" element={<ProtectedRoute><MatriculaFormPage /></ProtectedRoute>} />
        <Route path="/matriculas/:id" element={<ProtectedRoute><MatriculaDetalhePage /></ProtectedRoute>} />
        <Route path="/matriculas/:id/editar" element={<ProtectedRoute><MatriculaFormPage /></ProtectedRoute>} />

        {/* Documentos (gestão; o responsável abre os dos filhos) */}
        <Route path="/documentos" element={<ProtectedRoute><DocumentosPage /></ProtectedRoute>} />
        <Route path="/documentos/novo" element={<ProtectedRoute><DocumentoFormPage /></ProtectedRoute>} />
        <Route path="/documentos/:id" element={<ProtectedRoute><DocumentoDetalhePage /></ProtectedRoute>} />
        <Route path="/documentos/:id/editar" element={<ProtectedRoute><DocumentoFormPage /></ProtectedRoute>} />

        {/* Perfil do usuário logado (todos os perfis) */}
        <Route path="/perfil" element={
          <ProtectedRoute><MeuPerfilPage /></ProtectedRoute>
        } />

        {/* Usuários e permissões (gestão escolar) */}
        <Route path="/usuarios" element={
          <ProtectedRoute><UsuariosPage /></ProtectedRoute>
        } />
        <Route path="/usuarios/novo" element={
          <ProtectedRoute><UsuarioFormPage /></ProtectedRoute>
        } />
        <Route path="/usuarios/:id" element={
          <ProtectedRoute><UsuarioFormPage /></ProtectedRoute>
        } />
      </Routes>
      </UsuarioProvider>
    </BrowserRouter>
  );
};
