import React from 'react';
import { MeuPerfil } from '../features/perfil/MeuPerfil';

const MeuPerfilPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <MeuPerfil />
    </div>
  );
};

export default MeuPerfilPage;
