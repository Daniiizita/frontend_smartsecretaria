import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Users,
  User,
} from "lucide-react"; // ícones elegantes e padronizados

const navLinkClasses =
  "flex items-center gap-3 px-4 py-2 text-slate-100 hover:bg-slate-700 rounded-md transition-colors duration-200";
const activeNavLinkClasses = "bg-slate-700";

export const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleMinimize = () => setIsMinimized(!isMinimized);

  return (
    <div className="flex">
      {/* Botão para abrir no mobile */}
      <button
        className="lg:hidden p-3 text-white bg-slate-800"
        onClick={toggleSidebar}
        aria-label="Abrir menu"
      >
        {isOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          ${isMinimized ? "w-20" : "w-64"}
          bg-slate-800 text-white flex flex-col p-4 space-y-6
          fixed lg:static top-0 left-0 h-full
          transition-all duration-300 ease-in-out
          z-50
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-2">
          {!isMinimized && (
            <h1 className="text-xl font-bold whitespace-nowrap">
              SmartSecretaria
            </h1>
          )}

          <button
            onClick={toggleMinimize}
            className="p-2 rounded-md hover:bg-slate-700 transition-colors"
            aria-label="Minimizar sidebar"
          >
            {isMinimized ? (
              <ChevronRight size={20} />
            ) : (
              <ChevronLeft size={20} />
            )}
          </button>
        </div>

        {/* Navegação */}
        <nav className="flex flex-col space-y-2 mt-6">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `${navLinkClasses} ${isActive ? activeNavLinkClasses : ""}`
            }
          >
            <LayoutDashboard size={20} />
            {!isMinimized && <span>Dashboard</span>}
          </NavLink>

          <NavLink
            to="/alunos"
            className={({ isActive }) =>
              `${navLinkClasses} ${isActive ? activeNavLinkClasses : ""}`
            }
          >
            <Users size={20} />
            {!isMinimized && <span>Alunos</span>}
          </NavLink>

          <NavLink
            to="/professores"
            className={({ isActive }) =>
              `${navLinkClasses} ${isActive ? activeNavLinkClasses : ""}`
            }
          >
            <User size={20} />
            {!isMinimized && <span>Professores</span>}
          </NavLink>
        </nav>
      </aside>

      {/* Overlay para mobile */}
      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black bg-opacity-40 z-40 lg:hidden"
        />
      )}
    </div>
  );
};
