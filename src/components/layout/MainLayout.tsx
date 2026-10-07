import React, { useCallback, useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { config } from '../../config/env';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [menuAberto, setMenuAberto] = useState(false);
  const fecharMenu = useCallback(() => setMenuAberto(false), []);

  return (
    <div className="flex h-screen bg-slate-100 print:block print:h-auto print:bg-white">
      <Sidebar abertoNoCelular={menuAberto} onFechar={fecharMenu} />
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden print:block print:overflow-visible">
        <Header onAbrirMenu={() => setMenuAberto(true)} menuAberto={menuAberto} />
        {config.demo.ativo && (
          <div className="bg-amber-50 border-b border-amber-200 text-amber-800 text-xs sm:text-sm px-4 py-2 text-center print:hidden">
            Demonstração de portfólio com dados fictícios, reiniciados periodicamente.
          </div>
        )}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-100 p-4 sm:p-6 lg:p-8 print:overflow-visible print:bg-white print:p-0">
          {children}
        </main>
      </div>
    </div>
  );
};
