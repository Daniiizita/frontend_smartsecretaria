import React, { useCallback, useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [menuAberto, setMenuAberto] = useState(false);
  const fecharMenu = useCallback(() => setMenuAberto(false), []);

  return (
    <div className="flex h-screen bg-slate-100">
      <Sidebar abertoNoCelular={menuAberto} onFechar={fecharMenu} />
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        <Header onAbrirMenu={() => setMenuAberto(true)} menuAberto={menuAberto} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-100 p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
