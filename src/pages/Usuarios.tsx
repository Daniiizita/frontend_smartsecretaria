import React from 'react';
import { UsuarioList } from '../features/usuarios/UsuarioList';
import { RequireGestor } from '../routes/RequireGestor';

const UsuariosPage: React.FC = () => {
  return (
    <div>
      <RequireGestor>
        <UsuarioList />
      </RequireGestor>
    </div>
  );
};

export default UsuariosPage;
