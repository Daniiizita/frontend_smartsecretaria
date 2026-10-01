import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { ArrowLeft, Clock, Edit, Loader2, Star, Trash2, UserPlus, Users } from 'lucide-react';
import type { Aluno, Atribuicao, Disciplina, Professor, Turma } from '../../types';
import { deleteTurma, getAtribuicoesDaTurma, getTurmaById } from '../../api/turmaService';
import { getAlunos } from '../../api/alunoService';
import { getProfessores } from '../../api/professorService';
import { getDisciplinas } from '../../api/escolaService';
import { useUsuario } from '../../auth/useUsuario';
import { isGestor } from '../../auth/papeis';
import { DisciplinasDaTurma } from './DisciplinasDaTurma';
import { tituloCurto } from './formatos';
import { AcoesDoItem } from '../../components/common/AcoesDoItem';

interface Dados {
  turma: Turma;
  alunos: Aluno[];
  atribuicoes: Atribuicao[];
  disciplinas: Disciplina[];
  professores: Professor[];
}

export const TurmaDetalhe: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { usuario } = useUsuario();
  const gestao = isGestor(usuario);
  const [dados, setDados] = useState<Dados | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [excluindo, setExcluindo] = useState(false);
  const [erroExclusao, setErroExclusao] = useState<string | null>(null);

  useEffect(() => {
    const turmaId = Number(id);
    Promise.all([
      getTurmaById(turmaId),
      getAlunos(turmaId),
      getAtribuicoesDaTurma(turmaId),
      getDisciplinas(),
      getProfessores(),
    ])
      .then(([turma, alunos, atribuicoes, disciplinas, professores]) =>
        setDados({ turma, alunos, atribuicoes, disciplinas, professores })
      )
      .catch((err) => {
        console.error(err);
        setErro(
          isAxiosError(err) && err.response?.status === 404
            ? 'Turma não encontrada ou fora do seu acesso.'
            : 'Não foi possível carregar a turma.'
        );
      });
  }, [id]);

  const excluir = async () => {
    if (!dados || !window.confirm(`Excluir a turma ${dados.turma.nome}? Esta ação não pode ser desfeita.`)) return;
    setExcluindo(true);
    setErroExclusao(null);
    try {
      await deleteTurma(dados.turma.id);
      navigate('/turmas');
    } catch (err) {
      // 409: há alunos ou matrículas na turma (exclusão protegida no backend).
      const detalhe = isAxiosError(err) ? (err.response?.data as { detail?: string } | undefined)?.detail : undefined;
      setErroExclusao(detalhe ?? 'Não foi possível excluir a turma.');
    } finally {
      setExcluindo(false);
    }
  };

  if (erro) {
    return (
      <div className="space-y-4">
        <Link to="/turmas" className="inline-flex items-center gap-2 text-blue-600 hover:underline">
          <ArrowLeft size={18} /> Voltar às turmas
        </Link>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{erro}</div>
      </div>
    );
  }
  if (!dados) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-blue-500" size={48} />
      </div>
    );
  }

  const { turma, alunos } = dados;
  const souRegente = usuario?.professor === turma.professor_responsavel;

  return (
    <div className="space-y-6">
      <Link to="/turmas" className="inline-flex items-center gap-2 min-h-11 text-blue-600 hover:underline">
        <ArrowLeft size={18} /> Turmas
      </Link>

      {/* Identificação */}
      <section className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800">{tituloCurto(turma)}</h2>
            <p className="text-slate-500">{turma.nivel_label}</p>
            <div className="flex flex-wrap gap-2 mt-3 text-xs">
              <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2 py-1 rounded-full">
                <Clock size={12} /> {turma.periodo}
              </span>
              <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded-full">Ano letivo {turma.ano}</span>
              {turma.horario_aulas && (
                <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded-full">{turma.horario_aulas}</span>
              )}
            </div>
            <p className="mt-3 text-sm text-slate-700">
              <span className="text-slate-500">Regente:</span> {turma.professor_responsavel_nome}
              {souRegente && (
                <span className="ml-2 inline-flex items-center gap-1 text-xs font-medium bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                  <Star size={12} /> Você
                </span>
              )}
            </p>
          </div>

          {gestao && (
            <div className="flex gap-2 shrink-0">
              <Link
                to={`/turmas/${turma.id}/editar`}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 min-h-11 px-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 text-sm"
              >
                <Edit size={16} /> Editar
              </Link>
              <button
                type="button"
                onClick={excluir}
                disabled={excluindo}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 min-h-11 px-4 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-sm disabled:opacity-50"
              >
                {excluindo ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />} Excluir
              </button>
            </div>
          )}
        </div>
        {erroExclusao && (
          <p className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800" role="alert">
            {erroExclusao}
          </p>
        )}
      </section>

      <DisciplinasDaTurma
        turma={turma}
        disciplinas={dados.disciplinas}
        professores={dados.professores}
        atribuicoes={dados.atribuicoes}
        podeEditar={gestao}
        onAtualizar={(atribuicoes) => setDados((d) => (d ? { ...d, atribuicoes } : d))}
      />

      {/* Alunos */}
      <section className="bg-white rounded-lg shadow-md p-4 sm:p-6" aria-labelledby="alunos-turma">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <h3 id="alunos-turma" className="flex items-center gap-2 text-lg font-semibold text-slate-800">
            <Users size={20} className="text-blue-500" /> Alunos ({alunos.length})
          </h3>
          {gestao && (
            <Link
              to="/alunos/novo"
              state={{ novaTurmaId: turma.id }}
              className="flex items-center justify-center gap-2 min-h-11 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
            >
              <UserPlus size={16} /> Adicionar aluno
            </Link>
          )}
        </div>
        {alunos.length === 0 ? (
          <p className="text-sm text-slate-500">Nenhum aluno nesta turma.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {alunos.map((aluno) => (
              <li key={aluno.id} className="relative py-2 flex items-center gap-3 min-h-11 hover:bg-slate-50 rounded-lg px-2 -mx-2">
                <div className="h-9 w-9 rounded-full bg-slate-200 flex items-center justify-center shrink-0 text-sm font-semibold text-slate-600" aria-hidden="true">
                  {aluno.nome_completo[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <Link to={`/alunos/${aluno.id}`} className="block text-slate-800 truncate after:absolute after:inset-0 after:rounded-lg">
                    {aluno.nome_completo}
                  </Link>
                  {aluno.nome_responsavel && (
                    <p className="text-xs text-slate-500 truncate">Responsável: {aluno.nome_responsavel}</p>
                  )}
                </div>
                <AcoesDoItem
                  nome={aluno.nome_completo}
                  verUrl={`/alunos/${aluno.id}`}
                  editarUrl={gestao ? `/alunos/${aluno.id}/editar` : undefined}
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};
