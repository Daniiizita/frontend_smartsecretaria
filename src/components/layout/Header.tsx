import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Menu } from 'lucide-react';
import { useUsuario } from '../../auth/useUsuario';
import { TIPO_LABELS, nomeDeExibicao } from '../../auth/papeis';
import { NotificacoesMenu } from './NotificacoesMenu';
import { logout } from '../../api/authService';

interface HeaderProps {
  onAbrirMenu: () => void;
  menuAberto: boolean;
}

// A navegação fica na barra lateral (montada por perfil); no celular ela abre pelo botão ☰.
export const Header: React.FC<HeaderProps> = ({ onAbrirMenu, menuAberto }) => {
  const navigate = useNavigate();
  const { usuario, limpar } = useUsuario();
  const nome = usuario ? nomeDeExibicao(usuario) : '';

  const handleLogout = async () => {
    await logout();
    limpar();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-30 print:hidden">
      <div className="flex items-center gap-3 p-4">
        <button
          type="button"
          onClick={onAbrirMenu}
          className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Abrir menu"
          aria-controls="menu-principal"
          aria-expanded={menuAberto}
        >
          <Menu size={22} className="text-slate-700" />
        </button>
        <span className="lg:hidden font-semibold text-slate-800">SmartSecretaria</span>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          {usuario && <NotificacoesMenu />}

          {usuario && (
            <Link
              to="/perfil"
              className="flex items-center gap-2 px-2 sm:px-3 py-1 rounded-lg hover:bg-slate-100 transition-colors"
              title="Meu perfil"
            >
              <div
                className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold"
                aria-hidden="true"
              >
                {nome.charAt(0).toUpperCase()}
              </div>
              <div className="leading-tight hidden md:block">
                <p className="text-sm text-slate-700">{nome}</p>
                <p className="text-xs text-slate-500">{TIPO_LABELS[usuario.tipo]}</p>
              </div>
            </Link>
          )}

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm"
            aria-label="Sair"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </div>
    </header>
  );
};
