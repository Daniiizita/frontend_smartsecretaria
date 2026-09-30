import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { ChevronLeft, ChevronRight, X } from "lucide-react"; // ícones elegantes e padronizados
import { useUsuario } from "../../auth/useUsuario";
import { itensDeMenu } from "../../auth/navegacao";

const navLinkClasses =
  "flex items-center gap-3 px-4 py-2 text-slate-100 hover:bg-slate-700 rounded-md transition-colors duration-200";
const activeNavLinkClasses = "bg-slate-700";

interface SidebarProps {
  // Abertura em telas menores que 1024px (lg); no desktop a barra fica sempre visível.
  abertoNoCelular: boolean;
  onFechar: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ abertoNoCelular, onFechar }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const { usuario } = useUsuario();

  // Esc fecha o menu no celular.
  useEffect(() => {
    if (!abertoNoCelular) return;
    const aoTeclar = (e: KeyboardEvent) => e.key === "Escape" && onFechar();
    document.addEventListener("keydown", aoTeclar);
    return () => document.removeEventListener("keydown", aoTeclar);
  }, [abertoNoCelular, onFechar]);

  return (
    <>
      <aside
        id="menu-principal"
        className={`
          ${abertoNoCelular ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
          w-64 ${isMinimized ? "lg:w-20" : "lg:w-64"}
          bg-slate-800 text-white flex flex-col p-4 space-y-6
          fixed inset-y-0 left-0 lg:static shrink-0
          transition-all duration-300 ease-in-out
          z-50
        `}
      >
        <div className="flex items-center justify-between px-2">
          {(!isMinimized || abertoNoCelular) && (
            <h1 className="text-xl font-bold whitespace-nowrap">SmartSecretaria</h1>
          )}

          {/* Celular: fechar. Desktop: minimizar. */}
          <button
            type="button"
            onClick={onFechar}
            className="lg:hidden p-2 rounded-md hover:bg-slate-700 transition-colors"
            aria-label="Fechar menu"
          >
            <X size={20} />
          </button>
          <button
            type="button"
            onClick={() => setIsMinimized((v) => !v)}
            className="hidden lg:block p-2 rounded-md hover:bg-slate-700 transition-colors"
            aria-label={isMinimized ? "Expandir menu" : "Minimizar menu"}
          >
            {isMinimized ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        <nav className="flex flex-col space-y-2 mt-6" aria-label="Menu principal">
          {itensDeMenu(usuario).map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              onClick={onFechar}
              title={isMinimized ? label : undefined}
              className={({ isActive }) =>
                `${navLinkClasses} ${isActive ? activeNavLinkClasses : ""}`
              }
            >
              <Icon size={20} className="shrink-0" />
              <span className={isMinimized ? "lg:hidden" : ""}>{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Fundo translúcido atrás do menu no celular (toque fora fecha) */}
      {abertoNoCelular && (
        <div
          onClick={onFechar}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          aria-hidden="true"
        />
      )}
    </>
  );
};
