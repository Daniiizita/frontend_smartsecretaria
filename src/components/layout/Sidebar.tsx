import React from 'react';
import { NavLink } from 'react-router-dom';

const navLinkClasses = "flex items-center px-4 py-2 text-slate-100 hover:bg-slate-700 rounded-md";
const activeNavLinkClasses = "bg-slate-700";

export const Sidebar: React.FC = () => {
  return (
    <div className="w-64 bg-slate-800 text-white flex flex-col p-4">
      <div className="text-2xl font-bold mb-10 px-4">
        SmartSecretaria
      </div>
      <nav className="flex flex-col space-y-2">
        <NavLink
          to="/dashboard"
          className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/alunos"
          className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}
        >
          Alunos
        </NavLink>
        <NavLink
          to="/professores"
          className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}
        >
          Professores
        </NavLink>
        {/* Adicione outros links aqui */}
      </nav>
    </div>
  );
};

