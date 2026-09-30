import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Usuario } from '../../types';
import { getUsuarios } from '../../api/usuarioService';
import { nomeDeExibicao } from '../../auth/papeis';

interface Props {
  value: number[];
  onChange: (ids: number[]) => void;
  error?: string;
}

/** Contas do tipo responsável que podem acompanhar o aluno. */
export const ResponsaveisSelect: React.FC<Props> = ({ value, onChange, error }) => {
  const [contas, setContas] = useState<Usuario[] | null>(null);
  const [busca, setBusca] = useState('');

  useEffect(() => {
    getUsuarios()
      .then((usuarios) => setContas(usuarios.filter((u) => u.tipo === 'responsavel')))
      .catch((err) => {
        console.error(err);
        setContas([]);
      });
  }, []);

  const alternar = (id: number) =>
    onChange(value.includes(id) ? value.filter((v) => v !== id) : [...value, id]);

  const termo = busca.trim().toLowerCase();
  const visiveis = (contas ?? []).filter(
    (u) =>
      value.includes(u.id) ||
      !termo ||
      nomeDeExibicao(u).toLowerCase().includes(termo) ||
      u.username.toLowerCase().includes(termo) ||
      u.email.toLowerCase().includes(termo)
  );

  return (
    <fieldset className="md:col-span-2 space-y-2">
      <legend className="block text-sm font-medium text-slate-700 mb-1">
        Contas de acesso dos responsáveis
      </legend>
      <p className="text-xs text-slate-500">
        Quem estiver marcado poderá acompanhar este aluno pelo sistema (dados, matrícula, documentos e
        professores). Não encontrou a conta?{' '}
        <Link to="/usuarios/novo" className="text-blue-600 hover:underline">Crie em Usuários</Link>.
      </p>

      {contas === null ? (
        <p className="text-sm text-slate-500">Carregando contas...</p>
      ) : contas.length === 0 ? (
        <p className="text-sm text-slate-500">Nenhuma conta do tipo responsável cadastrada.</p>
      ) : (
        <>
          <input
            type="text"
            placeholder="Filtrar responsáveis..."
            aria-label="Filtrar responsáveis"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full md:max-w-sm px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <ul className="max-h-48 overflow-y-auto border border-slate-200 rounded-lg divide-y divide-slate-100">
            {visiveis.map((u) => (
              <li key={u.id}>
                <label className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value.includes(u.id)}
                    onChange={() => alternar(u.id)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-slate-800">{nomeDeExibicao(u)}</span>
                  <span className="text-slate-500">@{u.username}</span>
                </label>
              </li>
            ))}
          </ul>
        </>
      )}
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </fieldset>
  );
};
