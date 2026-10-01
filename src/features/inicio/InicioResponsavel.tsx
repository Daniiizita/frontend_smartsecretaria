import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, GraduationCap } from 'lucide-react';
import type {
  Aluno, Atribuicao, Disciplina, Documento, Evento, Matricula, MeuPerfil, Professor, Turma,
} from '../../types';
import { getAlunos } from '../../api/alunoService';
import { getProfessores } from '../../api/professorService';
import { getTurmas } from '../../api/turmaService';
import {
  getAtribuicoes, getDisciplinas, getDocumentos, getEventos, getMatriculas, proximosEventos,
} from '../../api/escolaService';
import { nomeDeExibicao } from '../../auth/papeis';
import { Avatar, Aviso, Carregando, ProximosEventos } from './componentes';
import { STATUS_MATRICULA, TIPO_DOCUMENTO, formatarData } from './formatos';

interface Dados {
  alunos: Aluno[];
  turmas: Turma[];
  professores: Professor[];
  atribuicoes: Atribuicao[];
  disciplinas: Disciplina[];
  matriculas: Matricula[];
  documentos: Documento[];
  eventos: Evento[];
}

export const InicioResponsavel: React.FC<{ usuario: MeuPerfil }> = ({ usuario }) => {
  const [dados, setDados] = useState<Dados | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const temDependentes = usuario.dependentes.length > 0;

  useEffect(() => {
    if (!temDependentes) return;
    Promise.all([
      getAlunos(), getTurmas(), getProfessores(), getAtribuicoes(),
      getDisciplinas(), getMatriculas(), getDocumentos(), getEventos(),
    ])
      .then(([alunos, turmas, professores, atribuicoes, disciplinas, matriculas, documentos, eventos]) =>
        setDados({ alunos, turmas, professores, atribuicoes, disciplinas, matriculas, documentos, eventos })
      )
      .catch((err) => {
        console.error(err);
        setErro('Não foi possível carregar os dados. Tente novamente em instantes.');
      });
  }, [temDependentes]);

  if (!temDependentes) {
    return (
      <Aviso titulo="Nenhum aluno vinculado à sua conta">
        <p>Procure a secretaria da escola para vincular sua conta ao cadastro do(s) seu(s) filho(s).</p>
      </Aviso>
    );
  }
  if (erro) return <Aviso titulo="Algo deu errado">{erro}</Aviso>;
  if (!dados) return <Carregando />;

  const turmaPorId = new Map(dados.turmas.map((t) => [t.id, t]));
  const professorPorId = new Map(dados.professores.map((p) => [p.id, p]));
  const nomeDisciplina = new Map(dados.disciplinas.map((d) => [d.id, d.nome]));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Olá, {nomeDeExibicao(usuario)}</h1>
        <p className="text-slate-500">Acompanhe a vida escolar de quem está sob sua responsabilidade.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {dados.alunos.map((aluno) => {
          const turma = turmaPorId.get(aluno.turma);
          const matricula = dados.matriculas
            .filter((m) => m.aluno === aluno.id)
            .sort((a, b) => b.ano_letivo - a.ano_letivo)[0];
          const documentos = dados.documentos.filter((d) => d.aluno === aluno.id);
          const regente = turma ? professorPorId.get(turma.professor_responsavel) : undefined;
          // Professores das disciplinas, sem repetir o regente (professor único já aparece acima).
          const porDisciplina = dados.atribuicoes
            .filter((a) => a.turma === aluno.turma)
            .flatMap((a) => {
              const professor = professorPorId.get(a.professor);
              return professor && professor.id !== regente?.id
                ? [{ disciplina: nomeDisciplina.get(a.disciplina) ?? '—', professor }]
                : [];
            })
            .sort((a, b) => a.disciplina.localeCompare(b.disciplina));

          return (
            <article key={aluno.id} className="relative bg-white rounded-lg shadow-md hover:shadow-lg hover:ring-1 hover:ring-blue-200 transition p-4 sm:p-6 space-y-5">
              <header className="flex items-center gap-4">
                <Avatar nome={aluno.nome_completo} foto={aluno.foto} />
                <div className="min-w-0">
                  <h2 className="font-semibold text-slate-900 text-lg">
                    <Link to={`/alunos/${aluno.id}`} className="after:absolute after:inset-0 after:rounded-lg">
                      {aluno.nome_completo}
                    </Link>
                  </h2>
                  <p className="text-sm text-slate-500">{turma?.nome ?? 'Turma não informada'}</p>
                  {matricula && (
                    <span className={`inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_MATRICULA[matricula.status].cor}`}>
                      {STATUS_MATRICULA[matricula.status].label} · {matricula.ano_letivo}
                    </span>
                  )}
                </div>
              </header>

              <section>
                <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <GraduationCap size={16} className="text-slate-400" /> Professores
                </h3>
                <ul className="space-y-2">
                  {regente && (
                    <li className="flex items-center gap-3">
                      <Avatar nome={regente.nome} foto={regente.foto} tamanho="sm" />
                      <span className="text-sm text-slate-800">{regente.nome}</span>
                      <span className="text-xs text-slate-500">Regente</span>
                    </li>
                  )}
                  {porDisciplina.map(({ disciplina, professor }) => (
                    <li key={disciplina} className="flex items-center gap-3">
                      <Avatar nome={professor.nome} foto={professor.foto} tamanho="sm" />
                      <span className="text-sm text-slate-800">{professor.nome}</span>
                      <span className="text-xs text-slate-500">{disciplina}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <FileText size={16} className="text-slate-400" /> Documentos
                </h3>
                {documentos.length === 0 ? (
                  <p className="text-sm text-slate-500">Nenhum documento disponível.</p>
                ) : (
                  <ul className="space-y-1">
                    {documentos.map((doc) => (
                      <li key={doc.id} className="flex justify-between gap-4 text-sm">
                        <span className="text-slate-800">{TIPO_DOCUMENTO[doc.tipo] ?? doc.tipo}</span>
                        <span className="text-slate-500 whitespace-nowrap">{formatarData(doc.data_emissao)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </article>
          );
        })}
      </div>

      <ProximosEventos eventos={proximosEventos(dados.eventos)} />
    </div>
  );
};
