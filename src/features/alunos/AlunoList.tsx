import React, { useState } from 'react';
import { useAlunos } from './useAlunos';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';

export const AlunoList: React.FC = () => {
  const { alunos, loading, error } = useAlunos();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAlunos = alunos.filter(aluno =>
    aluno.nome_completo.toLowerCase().includes(searchTerm.toLowerCase())
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
        <h2 className="text-2xl font-bold text-slate-800">Lista de Alunos</h2>
        <Link
          to="/alunos/novo"
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus size={20} />
          Novo Aluno
        </Link>
      </div>

      {/* Barra de Pesquisa */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
        <input
          type="text"
          placeholder="Buscar aluno..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Tabela */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Nome
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Telefone
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {filteredAlunos.map((aluno) => (
              <tr key={aluno.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {aluno.foto ? (
                      <img src={aluno.foto} alt={aluno.nome_completo} className="h-10 w-10 rounded-full mr-3" />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center mr-3">
                        <span className="text-slate-600 font-semibold">{aluno.nome_completo[0]}</span>
                      </div>
                    )}
                    <span className="font-medium text-slate-900">{aluno.nome_completo}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  {aluno.email || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  {aluno.telefone_contato}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link to={`/alunos/${aluno.id}`} className="text-blue-600 hover:text-blue-900 mr-3">
                    <Edit size={18} className="inline" />
                  </Link>
                  <button className="text-red-600 hover:text-red-900">
                    <Trash2 size={18} className="inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredAlunos.length === 0 && (
        <p className="text-center text-slate-500 py-8">Nenhum aluno encontrado.</p>
      )}
    </div>
  );
};

