import React from 'react';
import { TurmaDetalhe } from '../features/turmas/TurmaDetalhe';
import { RequireGestorOuProfessor } from '../routes/RequireGestor';

const TurmaDetalhePage: React.FC = () => (
  <div className="max-w-5xl mx-auto">
    <RequireGestorOuProfessor>
      <TurmaDetalhe />
    </RequireGestorOuProfessor>
  </div>
);

export default TurmaDetalhePage;
