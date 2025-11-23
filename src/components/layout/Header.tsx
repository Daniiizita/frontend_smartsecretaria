import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  School, 
  FileText, 
  Calendar, 
  ClipboardList,
  Bell,
  LogOut,
  Menu,
  X,
  Search
} from 'lucide-react';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { path: '/alunos', label: 'Alunos', icon: <Users size={18} /> },
    { path: '/professores', label: 'Professores', icon: <GraduationCap size={18} /> },
    { path: '/turmas', label: 'Turmas', icon: <School size={18} /> },
    { path: '/matriculas', label: 'Matrículas', icon: <ClipboardList size={18} /> },
    { path: '/calendario', label: 'Calendário', icon: <Calendar size={18} /> },
    { path: '/documentos', label: 'Documentos', icon: <FileText size={18} /> },
  ];

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
      isActive
        ? 'bg-blue-100 text-blue-600 font-semibold'
        : 'text-slate-600 hover:bg-slate-100'
    }`;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="flex justify-between items-center p-4">
        {/* Logo / Brand */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Barra de Busca */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Buscar alunos, professores, turmas..."
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={navLinkClasses}
            >
              {item.icon}
              <span className="text-sm">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          {/* Notificações */}
          <button
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors relative"
            aria-label="Notificações"
          >
            <Bell size={20} className="text-slate-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Perfil do Usuário */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-lg hover:bg-slate-100 cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
              A
            </div>
            <span className="text-sm text-slate-700">Admin</span>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200">
          <nav className="p-4 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={navLinkClasses}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

