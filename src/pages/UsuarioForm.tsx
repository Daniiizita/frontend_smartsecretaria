import React from 'react';
import { UsuarioForm } from '../features/usuarios/UsuarioForm';
import { RequireGestor } from '../routes/RequireGestor';

const UsuarioFormPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <RequireGestor>
        <UsuarioForm />
      </RequireGestor>
    </div>
  );
};

export default UsuarioFormPage;
