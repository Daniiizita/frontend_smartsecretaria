import React from 'react';
import { UsuarioList } from '../features/usuarios/UsuarioList';
import { RequireGestor } from '../routes/RequireGestor';

const UsuariosPage: React.FC = () => {
  return (
    <div className="p-8">
      <RequireGestor>
        <UsuarioList />
      </RequireGestor>
    </div>
  );
};

export default UsuariosPage;
