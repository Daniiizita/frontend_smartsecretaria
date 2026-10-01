import React from 'react';
import { ProfessorDetalhe } from '../features/professores/ProfessorDetalhe';
import { RequireGestor } from '../routes/RequireGestor';

const ProfessorDetalhePage: React.FC = () => (
  <div className="max-w-4xl mx-auto">
    <RequireGestor>
      <ProfessorDetalhe />
    </RequireGestor>
  </div>
);

export default ProfessorDetalhePage;
