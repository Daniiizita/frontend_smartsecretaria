import React from 'react';
import { TurmaList } from '../features/turmas/TurmaList';
import { RequireGestorOuProfessor } from '../routes/RequireGestor';

const TurmasPage: React.FC = () => (
  <RequireGestorOuProfessor>
    <TurmaList />
  </RequireGestorOuProfessor>
);

export default TurmasPage;
