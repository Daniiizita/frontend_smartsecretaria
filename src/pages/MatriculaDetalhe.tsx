import React from 'react';
import { MatriculaDetalhe } from '../features/matriculas/MatriculaDetalhe';
import { RequireGestor } from '../routes/RequireGestor';

const MatriculaDetalhePage: React.FC = () => (
  <div className="max-w-4xl mx-auto">
    <RequireGestor>
      <MatriculaDetalhe />
    </RequireGestor>
  </div>
);

export default MatriculaDetalhePage;
