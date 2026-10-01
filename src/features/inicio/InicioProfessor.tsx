import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Star, Users } from 'lucide-react';
import type { Aluno, Atribuicao, Disciplina, Evento, MeuPerfil, Turma } from '../../types';
import { getAlunos } from '../../api/alunoService';
import { getTurmas } from '../../api/turmaService';
import { getAtribuicoes, getDisciplinas, getEventos, proximosEventos } from '../../api/escolaService';
import { nomeDeExibicao } from '../../auth/papeis';
import { Aviso, Carregando, ProximosEventos } from './componentes';

interface Dados {
  turmas: Turma[];
  alunos: Aluno[];
  atribuicoes: Atribuicao[];
  disciplinas: Disciplina[];
  eventos: Evento[];
}

export const InicioProfessor: React.FC<{ usuario: MeuPerfil }> = ({ usuario }) => {
  const [dados, setDados] = useState<Dados | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const professorId = usuario.professor;

  useEffect(() => {
    if (professorId === null) return;
    Promise.all([getTurmas(), getAlunos(), getAtribuicoes(), getDisciplinas(), getEventos()])
      .then(([turmas, alunos, atribuicoes, disciplinas, eventos]) =>
        setDados({ turmas, alunos, atribuicoes, disciplinas, eventos })
      )
      .catch((err) => {
        console.error(err);
        setErro('Não foi possível carregar suas turmas. Tente novamente em instantes.');
      });
  }, [professorId]);

  if (professorId === null) {
    return (
      <Aviso titulo="Sua conta ainda não está ligada a um cadastro de professor">
        <p>
          Peça à secretaria para vincular sua conta ao seu cadastro. Depois disso, suas turmas e seus
          alunos aparecerão aqui.
        </p>
      </Aviso>
    );
  }
  if (erro) return <Aviso titulo="Algo deu errado">{erro}</Aviso>;
  if (!dados) return <Carregando />;

  const nomeDisciplina = new Map(dados.disciplinas.map((d) => [d.id, d.nome]));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Olá, {nomeDeExibicao(usuario)}</h1>
        <p className="text-slate-500">Suas turmas neste ano letivo.</p>
      </div>

      <section aria-labelledby="minhas-turmas">
        <h2 id="minhas-turmas" className="text-lg font-semibold text-slate-800 mb-4">
          Minhas turmas
        </h2>
        {dados.turmas.length === 0 ? (
          <p className="text-slate-500">Você ainda não foi atribuído a nenhuma turma.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {dados.turmas.map((turma) => {
              const minhas = dados.atribuicoes
                .filter((a) => a.turma === turma.id && a.professor === professorId)
                .map((a) => nomeDisciplina.get(a.disciplina) ?? '—');
              const regente = turma.professor_responsavel === professorId;
              const totalAlunos = dados.alunos.filter((a) => a.turma === turma.id).length;
              return (
                <article key={turma.id} className="relative bg-white rounded-lg shadow-md hover:shadow-lg hover:ring-1 hover:ring-blue-200 transition p-4 sm:p-6 flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-slate-900">
                      <Link to={`/turmas/${turma.id}`} className="after:absolute after:inset-0 after:rounded-lg">{turma.nome}</Link>
                    </h3>
                    {regente && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium bg-blue-100 text-blue-700 px-2 py-1 rounded-full whitespace-nowrap">
                        <Star size={12} /> Regente
                      </span>
                    )}
                  </div>

                  <div className="flex items-start gap-2 text-sm text-slate-600">
                    <BookOpen size={16} className="mt-0.5 text-slate-400 shrink-0" />
                    <span>{minhas.length > 0 ? minhas.join(', ') : 'Regência da turma'}</span>
                  </div>

                  <Link
                    to={`/alunos?turma=${turma.id}`}
                    className="relative z-10 mt-auto flex items-center justify-center gap-2 min-h-11 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                  >
                    <Users size={16} />
                    Ver {totalAlunos} {totalAlunos === 1 ? 'aluno' : 'alunos'}
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <ProximosEventos eventos={proximosEventos(dados.eventos)} />
    </div>
  );
};
