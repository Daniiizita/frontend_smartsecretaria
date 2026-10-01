import React, { useState } from 'react';
import { BookOpen, Check, Loader2, Wand2 } from 'lucide-react';
import type { Atribuicao, Disciplina, Professor, Turma } from '../../types';
import {
  atribuirTudoAoRegente, createAtribuicao, deleteAtribuicao, updateAtribuicao,
} from '../../api/turmaService';

interface Props {
  turma: Turma;
  disciplinas: Disciplina[];
  professores: Professor[];
  atribuicoes: Atribuicao[];
  onAtualizar: (atribuicoes: Atribuicao[]) => void;
  podeEditar: boolean;
}

/** Quem leciona cada disciplina na turma. A gestão altera direto na lista (salva ao escolher). */
export const DisciplinasDaTurma: React.FC<Props> = ({
  turma, disciplinas, professores, atribuicoes, onAtualizar, podeEditar,
}) => {
  const [salvando, setSalvando] = useState<number | 'todas' | null>(null);
  const [salvo, setSalvo] = useState<number | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const porDisciplina = new Map(atribuicoes.map((a) => [a.disciplina, a]));

  const alterar = async (disciplinaId: number, valor: string) => {
    const atual = porDisciplina.get(disciplinaId);
    const professorId = valor ? Number(valor) : null;
    setSalvando(disciplinaId);
    setErro(null);
    try {
      let lista = atribuicoes;
      if (!professorId && atual) {
        await deleteAtribuicao(atual.id);
        lista = atribuicoes.filter((a) => a.id !== atual.id);
      } else if (professorId && atual) {
        const nova = await updateAtribuicao(atual.id, professorId);
        lista = atribuicoes.map((a) => (a.id === nova.id ? nova : a));
      } else if (professorId) {
        const nova = await createAtribuicao({ turma: turma.id, disciplina: disciplinaId, professor: professorId });
        lista = [...atribuicoes, nova];
      }
      onAtualizar(lista);
      setSalvo(disciplinaId);
      window.setTimeout(() => setSalvo((s) => (s === disciplinaId ? null : s)), 1500);
    } catch (err) {
      console.error(err);
      setErro('Não foi possível salvar a alteração. Tente novamente.');
    } finally {
      setSalvando(null);
    }
  };

  const professorUnico = async () => {
    if (!window.confirm(`O regente (${turma.professor_responsavel_nome}) passará a lecionar todas as disciplinas desta turma. Continuar?`)) return;
    setSalvando('todas');
    setErro(null);
    try {
      onAtualizar(await atribuirTudoAoRegente(turma.id));
    } catch (err) {
      console.error(err);
      setErro('Não foi possível atribuir as disciplinas ao regente.');
    } finally {
      setSalvando(null);
    }
  };

  // Na consulta, só as disciplinas com professor; na edição, todas.
  const linhas = podeEditar ? disciplinas : disciplinas.filter((d) => porDisciplina.has(d.id));

  return (
    <section className="bg-white rounded-lg shadow-md p-4 sm:p-6" aria-labelledby="disciplinas-turma">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h3 id="disciplinas-turma" className="flex items-center gap-2 text-lg font-semibold text-slate-800">
          <BookOpen size={20} className="text-blue-500" /> Disciplinas e professores
        </h3>
        {podeEditar && disciplinas.length > 0 && (
          <button
            type="button"
            onClick={professorUnico}
            disabled={salvando !== null}
            className="flex items-center justify-center gap-2 min-h-11 px-3 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 disabled:opacity-50"
          >
            {salvando === 'todas' ? <Loader2 size={16} className="animate-spin" /> : <Wand2 size={16} />}
            Professor único (regente leciona todas)
          </button>
        )}
      </div>

      {erro && <p className="mb-3 text-sm text-red-600" role="alert">{erro}</p>}

      {linhas.length === 0 ? (
        <p className="text-sm text-slate-500">
          {podeEditar ? 'Nenhuma disciplina cadastrada na escola.' : 'Nenhuma disciplina atribuída ainda; a turma fica com o regente.'}
        </p>
      ) : (
        <ul className="divide-y divide-slate-100">
          {linhas.map((disciplina) => {
            const atribuicao = porDisciplina.get(disciplina.id);
            return (
              <li key={disciplina.id} className="py-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <span className="sm:w-48 shrink-0 font-medium text-slate-800">{disciplina.nome}</span>
                {podeEditar ? (
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <select
                      aria-label={`Professor de ${disciplina.nome}`}
                      value={atribuicao?.professor ?? ''}
                      onChange={(e) => alterar(disciplina.id, e.target.value)}
                      disabled={salvando !== null}
                      className="flex-1 min-w-0 w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
                    >
                      <option value="">— sem professor —</option>
                      {professores.map((p) => (
                        <option key={p.id} value={p.id}>{p.nome}</option>
                      ))}
                    </select>
                    <span className="w-5 shrink-0" aria-live="polite">
                      {salvando === disciplina.id && <Loader2 size={18} className="animate-spin text-blue-500" />}
                      {salvo === disciplina.id && <Check size={18} className="text-green-600" aria-label="Salvo" />}
                    </span>
                  </div>
                ) : (
                  <span className="text-slate-600">{atribuicao?.professor_nome}</span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};
