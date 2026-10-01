import React, { useState } from 'react';
import { useProfessores } from './useProfessores';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit, Eye, Mail, Phone } from 'lucide-react';

export const ProfessorList: React.FC = () => {
  const { professores, loading, error } = useProfessores();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProfessores = professores.filter(professor =>
    professor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (professor.email ?? '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <h2 className="text-2xl font-bold text-slate-800">Lista de Professores</h2>
        <Link
          to="/professores/novo"
          className="flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2.5 rounded-lg hover:bg-blue-600 transition-colors whitespace-nowrap"
        >
          <Plus size={20} />
          Novo Professor
        </Link>
      </div>

      {/* Barra de Pesquisa */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
        <input
          type="text"
          placeholder="Buscar professor..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Cartões: tocar no cartão abre o professor; Editar fica ao lado de Visualizar. */}
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredProfessores.map((professor) => (
          <li
            key={professor.id}
            className="relative bg-white rounded-lg shadow-md hover:shadow-lg hover:ring-1 hover:ring-blue-200 transition p-4 sm:p-6 flex flex-col"
          >
            <div className="flex items-center gap-4 mb-4">
              {professor.foto ? (
                <img src={professor.foto} alt="" className="h-14 w-14 rounded-full object-cover shrink-0" />
              ) : (
                <div className="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center shrink-0" aria-hidden="true">
                  <span className="text-blue-600 font-semibold text-lg">
                    {professor.nome.split(' ').map(n => n[0]).slice(0, 2).join('')}
                  </span>
                </div>
              )}
              <h3 className="min-w-0 font-semibold text-slate-900 text-lg">
                {/* Link "esticado" sobre o cartão inteiro */}
                <Link to={`/professores/${professor.id}`} className="after:absolute after:inset-0 after:rounded-lg">
                  {professor.nome}
                </Link>
              </h3>
            </div>

            <div className="space-y-2 mb-4 text-sm text-slate-600">
              {professor.email && (
                <p className="flex items-center gap-2 min-w-0">
                  <Mail size={16} className="text-slate-400 shrink-0" />
                  <span className="truncate">{professor.email}</span>
                </p>
              )}
              {professor.telefone_contato && (
                <p className="flex items-center gap-2">
                  <Phone size={16} className="text-slate-400 shrink-0" />
                  <span>{professor.telefone_contato}</span>
                </p>
              )}
            </div>

            <div className="relative z-10 mt-auto flex gap-2 pt-4 border-t border-slate-100">
              <Link
                to={`/professores/${professor.id}`}
                className="flex-1 flex items-center justify-center gap-2 min-h-11 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm"
              >
                <Eye size={16} />
                Visualizar
              </Link>
              <Link
                to={`/professores/${professor.id}/editar`}
                className="flex-1 flex items-center justify-center gap-2 min-h-11 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm"
              >
                <Edit size={16} />
                Editar
              </Link>
            </div>
          </li>
        ))}
      </ul>

      {filteredProfessores.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <p className="text-slate-500">Nenhum professor encontrado.</p>
        </div>
      )}
    </div>
  );
};