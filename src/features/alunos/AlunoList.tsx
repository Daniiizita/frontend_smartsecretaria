import React, { useState } from 'react';
import { useAlunos } from './useAlunos';
import { Link, useSearchParams } from 'react-router-dom';
import { Plus, Search, Edit } from 'lucide-react';
import { useUsuario } from '../../auth/useUsuario';
import { isGestor } from '../../auth/papeis';

export const AlunoList: React.FC = () => {
  const { alunos, loading, error } = useAlunos();
  const [searchTerm, setSearchTerm] = useState('');
  const [params, setParams] = useSearchParams();
  const turmaFiltro = Number(params.get('turma')) || null;
  const { usuario } = useUsuario();
  const gestao = isGestor(usuario);

  const filteredAlunos = alunos.filter(aluno =>
    aluno.nome_completo.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (turmaFiltro === null || aluno.turma === turmaFiltro)
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
        <h2 className="text-2xl font-bold text-slate-800">{gestao ? 'Lista de Alunos' : 'Meus alunos'}</h2>
        {gestao && (
          <Link
            to="/alunos/novo"
            className="flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2.5 rounded-lg hover:bg-blue-600 transition-colors whitespace-nowrap"
          >
            <Plus size={20} />
            Novo Aluno
          </Link>
        )}
      </div>

      {turmaFiltro !== null && (
        <div className="flex items-center gap-3 text-sm text-slate-600">
          <span>Mostrando apenas os alunos de uma turma.</span>
          <button
            type="button"
            onClick={() => setParams({})}
            className="text-blue-600 hover:underline"
          >
            Ver todos
          </button>
        </div>
      )}

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

      {/* Celular: cartões (tabela não cabe em 360-400px) */}
      <ul className="md:hidden space-y-3">
        {filteredAlunos.map((aluno) => (
          <li key={aluno.id} className="bg-white rounded-lg shadow-sm p-4 flex items-center gap-3">
            {aluno.foto ? (
              <img src={aluno.foto} alt="" className="h-11 w-11 rounded-full object-cover shrink-0" />
            ) : (
              <div className="h-11 w-11 rounded-full bg-slate-200 flex items-center justify-center shrink-0" aria-hidden="true">
                <span className="text-slate-600 font-semibold">{aluno.nome_completo[0]}</span>
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="font-medium text-slate-900 truncate">{aluno.nome_completo}</p>
              <p className="text-sm text-slate-500 truncate">{aluno.nome_responsavel || 'Responsável não informado'}</p>
              {aluno.telefone_contato && (
                <a href={`tel:${aluno.telefone_contato}`} className="inline-flex items-center min-h-11 text-sm text-blue-600">
                  {aluno.telefone_contato}
                </a>
              )}
            </div>
            {gestao && (
              <Link
                to={`/alunos/${aluno.id}`}
                className="h-11 w-11 flex items-center justify-center rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-100 shrink-0"
                aria-label={`Editar ${aluno.nome_completo}`}
              >
                <Edit size={20} />
              </Link>
            )}
          </li>
        ))}
      </ul>

      {/* Tabela (tablet e desktop) */}
      <div className="hidden md:block bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Nome
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Responsável
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Telefone
              </th>
              {gestao && (
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Ações
                </th>
              )}
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
                  {aluno.nome_responsavel || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  {aluno.telefone_contato}
                </td>
                {gestao && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      to={`/alunos/${aluno.id}`}
                      className="inline-flex p-2 rounded-lg text-blue-600 hover:text-blue-900 hover:bg-blue-50"
                      aria-label={`Editar ${aluno.nome_completo}`}
                    >
                      <Edit size={18} className="inline" />
                    </Link>
                  </td>
                )}
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

