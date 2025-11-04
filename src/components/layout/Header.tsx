import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Header: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm p-4 flex justify-end items-center">
      {/* No futuro, aqui podemos adicionar busca global e notificações */}
      <div>
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm">
          Sair
        </button>
      </div>
    </header>
  );
};

