import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import type { Matricula } from '../../types';
import { listarMatriculas } from '../../api/matriculaService';
import { AcoesDoItem } from '../../components/common/AcoesDoItem';
import { formatDateToBR } from '../../utils/dateUtils';
import { ORDEM_STATUS, STATUS, ehStatus } from './status';

const selectClasses =
  'w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500';

export const MatriculaList: React.FC = () => {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [matriculas, setMatriculas] = useState<Matricula[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    listarMatriculas()
      .then(setMatriculas)
      .catch((err) => {
        console.error(err);
        setErro('Falha ao buscar matrículas.');
      })
      .finally(() => setCarregando(false));
  }, []);

  // Status no endereço (?status=pendente): links de notificação e do dashboard já chegam filtrados.
  const statusParam = params.get('status');
  const status = ehStatus(statusParam) ? statusParam : null;
  const definirStatus = (novo: string | null) => {
    const proximos = new URLSearchParams(params);
    if (novo) proximos.set('status', novo);
    else proximos.delete('status');
    setParams(proximos, { replace: true });
  };

  const anos = useMemo(() => [...new Set(matriculas.map((m) => m.ano_letivo))].sort((a, b) => b - a), [matriculas]);
  const [ano, setAno] = useState('');
  const anoFiltro = ano === '' && anos.length ? String(anos[0]) : ano;
  const [turma, setTurma] = useState('');
  const [busca, setBusca] = useState('');

  const doAno = matriculas.filter((m) => anoFiltro === 'todos' || String(m.ano_letivo) === anoFiltro);
  const turmas = [...new Map(doAno.map((m) => [m.turma, m.turma_nome])).entries()].sort((a, b) => a[1].localeCompare(b[1]));
  const termo = busca.trim().toLowerCase();
  const filtradas = doAno.filter(
    (m) =>
      (!status || m.status === status) &&
      (!turma || String(m.turma) === turma) &&
      (!termo || m.aluno_nome.toLowerCase().includes(termo))
  );
  const contagem = (s: string) => doAno.filter((m) => m.status === s).length;

  if (carregando) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }
  if (erro) return <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{erro}</div>;

  const chip = (ativo: boolean) =>
    `min-h-11 px-3 rounded-full text-sm border transition-colors ${
      ativo ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
    }`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Matrículas</h2>
          <p className="text-sm text-slate-500">Vínculo de cada aluno com uma turma em um ano letivo.</p>
        </div>
        <Link
          to="/matriculas/nova"
          className="flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2.5 rounded-lg hover:bg-blue-600 transition-colors whitespace-nowrap"
        >
          <Plus size={20} />
          Nova matrícula
        </Link>
      </div>

      {/* Atalhos por status (contagem do ano escolhido) */}
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por situação">
        <button type="button" className={chip(!status)} onClick={() => definirStatus(null)} aria-pressed={!status}>
          Todas ({doAno.length})
        </button>
        {ORDEM_STATUS.map((s) => (
          <button key={s} type="button" className={chip(status === s)} onClick={() => definirStatus(s)} aria-pressed={status === s}>
            {contagem(s)} {contagem(s) === 1 ? STATUS[s].label.toLowerCase() : STATUS[s].plural}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Buscar aluno..."
            aria-label="Buscar aluno"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select aria-label="Ano letivo" value={anoFiltro} onChange={(e) => { setAno(e.target.value); setTurma(''); }} className={selectClasses}>
          <option value="todos">Todos os anos</option>
          {anos.map((a) => (
            <option key={a} value={String(a)}>Ano letivo {a}</option>
          ))}
        </select>
        <select aria-label="Turma" value={turma} onChange={(e) => setTurma(e.target.value)} className={selectClasses}>
          <option value="">Todas as turmas</option>
          {turmas.map(([id, nome]) => (
            <option key={id} value={String(id)}>{nome}</option>
          ))}
        </select>
      </div>

      {filtradas.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <p className="text-slate-500">
            {matriculas.length === 0 ? 'Nenhuma matrícula cadastrada ainda.' : 'Nenhuma matrícula encontrada com esses filtros.'}
          </p>
        </div>
      ) : (
        <>
          {/* Celular: cartões */}
          <ul className="md:hidden space-y-3">
            {filtradas.map((m) => (
              <li key={m.id} className="relative bg-white rounded-lg shadow-sm p-4 flex items-center gap-3 hover:shadow-md hover:ring-1 hover:ring-blue-200 transition">
                <div className="min-w-0 flex-1">
                  <Link to={`/matriculas/${m.id}`} className="block font-medium text-slate-900 truncate after:absolute after:inset-0 after:rounded-lg">
                    {m.aluno_nome}
                  </Link>
                  <p className="text-sm text-slate-500 truncate">{m.turma_nome}</p>
                  <span className={`inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full ${STATUS[m.status].cor}`}>
                    {STATUS[m.status].label}
                  </span>
                </div>
                <AcoesDoItem nome={`a matrícula de ${m.aluno_nome}`} verUrl={`/matriculas/${m.id}`} editarUrl={`/matriculas/${m.id}/editar`} />
              </li>
            ))}
          </ul>

          {/* Tablet e desktop: tabela */}
          <div className="hidden md:block bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  {['Aluno', 'Turma', 'Ano', 'Desde', 'Situação'].map((t) => (
                    <th key={t} className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{t}</th>
                  ))}
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtradas.map((m) => (
                  <tr key={m.id} onClick={() => navigate(`/matriculas/${m.id}`)} className="hover:bg-blue-50/50 cursor-pointer">
                    <td className="px-6 py-3 whitespace-nowrap">
                      <Link to={`/matriculas/${m.id}`} onClick={(e) => e.stopPropagation()} className="font-medium text-slate-900 hover:text-blue-700 hover:underline">
                        {m.aluno_nome}
                      </Link>
                    </td>
                    <td className="px-6 py-3 text-sm text-slate-600">{m.turma_nome}</td>
                    <td className="px-6 py-3 text-sm text-slate-600">{m.ano_letivo}</td>
                    <td className="px-6 py-3 text-sm text-slate-600 whitespace-nowrap">{formatDateToBR(m.data_matricula)}</td>
                    <td className="px-6 py-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS[m.status].cor}`}>{STATUS[m.status].label}</span>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex justify-end">
                        <AcoesDoItem nome={`a matrícula de ${m.aluno_nome}`} verUrl={`/matriculas/${m.id}`} editarUrl={`/matriculas/${m.id}/editar`} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};
