import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Edit, Plus, Search, Star, Users } from 'lucide-react';
import { useUsuario } from '../../auth/useUsuario';
import { isGestor } from '../../auth/papeis';
import { useTurmas } from './useTurmas';
import { tituloCurto, valoresUnicos } from './formatos';

const selectClasses =
  'w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500';

export const TurmaList: React.FC = () => {
  const { turmas, loading, error } = useTurmas();
  const { usuario } = useUsuario();
  const gestao = isGestor(usuario);

  const anos = useMemo(() => valoresUnicos(turmas.map((t) => t.ano)).sort((a, b) => b - a), [turmas]);
  const niveis = useMemo(
    () => valoresUnicos(turmas.map((t) => `${t.nivel_ensino_sigla}|${t.nivel_label}`)).map((v) => v.split('|')),
    [turmas]
  );
  const periodos = useMemo(() => valoresUnicos(turmas.map((t) => t.periodo)), [turmas]);

  const [busca, setBusca] = useState('');
  const [ano, setAno] = useState<string>('');
  const [nivel, setNivel] = useState('');
  const [periodo, setPeriodo] = useState('');
  // Começa no ano letivo mais recente (até a pessoa escolher outro).
  const anoFiltro = ano === '' && anos.length ? String(anos[0]) : ano;

  const filtradas = turmas.filter((t) => {
    const termo = busca.trim().toLowerCase();
    return (
      (!termo || t.nome.toLowerCase().includes(termo) || t.professor_responsavel_nome.toLowerCase().includes(termo)) &&
      (anoFiltro === 'todos' || String(t.ano) === anoFiltro) &&
      (!nivel || t.nivel_ensino_sigla === nivel) &&
      (!periodo || t.periodo === periodo)
    );
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }
  if (error) {
    return <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800">{gestao ? 'Turmas' : 'Minhas turmas'}</h2>
          <p className="text-sm text-slate-500">
            {gestao ? 'Turmas da escola, regentes e alunos.' : 'Turmas em que você é regente ou leciona.'}
          </p>
        </div>
        {gestao && (
          <Link
            to="/turmas/nova"
            className="flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2.5 rounded-lg hover:bg-blue-600 transition-colors whitespace-nowrap"
          >
            <Plus size={20} />
            Nova turma
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="relative sm:col-span-2 lg:col-span-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Buscar turma ou regente..."
            aria-label="Buscar turma"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select aria-label="Ano letivo" value={anoFiltro} onChange={(e) => setAno(e.target.value)} className={selectClasses}>
          <option value="todos">Todos os anos</option>
          {anos.map((a) => (
            <option key={a} value={String(a)}>Ano letivo {a}</option>
          ))}
        </select>
        <select aria-label="Nível de ensino" value={nivel} onChange={(e) => setNivel(e.target.value)} className={selectClasses}>
          <option value="">Todos os níveis</option>
          {niveis.map(([sigla, label]) => (
            <option key={sigla} value={sigla}>{label}</option>
          ))}
        </select>
        <select aria-label="Período" value={periodo} onChange={(e) => setPeriodo(e.target.value)} className={selectClasses}>
          <option value="">Todos os períodos</option>
          {periodos.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      {filtradas.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <p className="text-slate-500">
            {turmas.length === 0
              ? gestao ? 'Nenhuma turma cadastrada ainda.' : 'Você ainda não foi atribuído a nenhuma turma.'
              : 'Nenhuma turma encontrada com esses filtros.'}
          </p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtradas.map((turma) => {
            const regente = usuario?.professor === turma.professor_responsavel;
            return (
              <li key={turma.id} className="bg-white rounded-lg shadow-md p-4 sm:p-5 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-slate-900 text-lg">{tituloCurto(turma)}</h3>
                    <p className="text-sm text-slate-500">{turma.nivel_label}</p>
                  </div>
                  {regente && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium bg-blue-100 text-blue-700 px-2 py-1 rounded-full whitespace-nowrap">
                      <Star size={12} /> Regente
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2 py-1 rounded-full">
                    <Clock size={12} /> {turma.periodo}
                  </span>
                  <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded-full">{turma.ano}</span>
                  <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2 py-1 rounded-full">
                    <Users size={12} /> {turma.total_alunos} {turma.total_alunos === 1 ? 'aluno' : 'alunos'}
                  </span>
                </div>

                <p className="text-sm text-slate-600">
                  <span className="text-slate-500">Regente:</span> {turma.professor_responsavel_nome}
                </p>

                <div className="mt-auto flex gap-2 pt-2">
                  <Link
                    to={`/turmas/${turma.id}`}
                    className="flex-1 flex items-center justify-center min-h-11 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                  >
                    Abrir turma
                  </Link>
                  {gestao && (
                    <Link
                      to={`/turmas/${turma.id}/editar`}
                      className="flex items-center justify-center min-h-11 min-w-11 px-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                      aria-label={`Editar ${tituloCurto(turma)}`}
                    >
                      <Edit size={18} />
                    </Link>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
