import React, { useState } from 'react';
import { useProfessores } from './useProfessores';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Mail, Phone } from 'lucide-react';

export const ProfessorList: React.FC = () => {
  const { professores, loading, error } = useProfessores();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProfessores = professores.filter(professor =>
    professor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    professor.email.toLowerCase().includes(searchTerm.toLowerCase())
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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Lista de Professores</h2>
        <Link
          to="/professores/novo"
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
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

      {/* Grid de Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProfessores.map((professor) => (
          <div key={professor.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
            {/* Foto e Nome */}
            <div className="flex items-center gap-4 mb-4">
              {professor.foto ? (
                <img 
                  src={professor.foto} 
                  alt={professor.nome} 
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-xl">
                    {professor.nome.split(' ').map(n => n[0]).slice(0, 2).join('')}
                  </span>
                </div>
              )}
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 text-lg">{professor.nome}</h3>
                <p className="text-sm text-slate-500">CPF: {professor.cpf}</p>
              </div>
            </div>

            {/* Informações de Contato */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Mail size={16} className="text-slate-400" />
                <span className="truncate">{professor.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Phone size={16} className="text-slate-400" />
                <span>{professor.telefone_contato}</span>
              </div>
            </div>

            {/* Ações */}
            <div className="flex gap-2 pt-4 border-t border-slate-100">
              <Link
                to={`/professores/${professor.id}`}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors text-sm"
              >
                <Edit size={16} />
                Editar
              </Link>
              <button
                className="flex items-center justify-center gap-2 bg-red-50 text-red-600 px-3 py-2 rounded-lg hover:bg-red-100 transition-colors text-sm"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredProfessores.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <p className="text-slate-500">Nenhum professor encontrado.</p>
        </div>
      )}
    </div>
  );
};