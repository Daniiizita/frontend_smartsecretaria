import React from 'react';
import { MatriculaList } from '../features/matriculas/MatriculaList';
import { RequireGestor } from '../routes/RequireGestor';

const MatriculasPage: React.FC = () => (
  <div>
    <RequireGestor>
      <MatriculaList />
    </RequireGestor>
  </div>
);

export default MatriculasPage;
