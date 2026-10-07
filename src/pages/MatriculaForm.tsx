import React from 'react';
import { MatriculaForm } from '../features/matriculas/MatriculaForm';
import { RequireGestor } from '../routes/RequireGestor';

const MatriculaFormPage: React.FC = () => (
  <div className="max-w-4xl mx-auto">
    <RequireGestor>
      <MatriculaForm />
    </RequireGestor>
  </div>
);

export default MatriculaFormPage;
