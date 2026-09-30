import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useUsuario } from '../../auth/useUsuario';
import { TIPO_LABELS, nomeDeExibicao } from '../../auth/papeis';

// A navegação fica só na barra lateral (montada por perfil); o cabeçalho mostra quem está logado.
export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { usuario, limpar } = useUsuario();
  const nome = usuario ? nomeDeExibicao(usuario) : '';

  const handleLogout = () => {
    localStorage.clear();
    limpar();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="flex justify-end items-center gap-3 p-4">
        {usuario && (
          <Link
            to="/perfil"
            className="flex items-center gap-2 px-3 py-1 rounded-lg hover:bg-slate-100 transition-colors"
            title="Meu perfil"
          >
            <div
              className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold"
              aria-hidden="true"
            >
              {nome.charAt(0).toUpperCase()}
            </div>
            <div className="leading-tight hidden sm:block">
              <p className="text-sm text-slate-700">{nome}</p>
              <p className="text-xs text-slate-500">{TIPO_LABELS[usuario.tipo]}</p>
            </div>
          </Link>
        )}

        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm"
        >
          <LogOut size={18} />
          <span className="hidden sm:inline">Sair</span>
        </button>
      </div>
    </header>
  );
};
