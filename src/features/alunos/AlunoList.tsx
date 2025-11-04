import React from 'react';
import { useAlunos } from './useAlunos';

export const AlunoList: React.FC = () => {
  const { alunos, loading, error } = useAlunos();

  if (loading) {
    return <p className="text-center text-slate-500">Carregando alunos...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-4">Lista de Alunos</h2>
      <ul className="divide-y divide-slate-200">
        {alunos.map((aluno) => (
          <li key={aluno.id} className="py-3">
            <p className="font-semibold text-slate-700">{aluno.nome_completo}</p>
            <p className="text-sm text-slate-500">{aluno.email || 'Email não cadastrado'}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

