import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { ArrowLeft, BookOpen, Edit, Home, KeyRound, Loader2, School, Star, User } from 'lucide-react';
import type { Atribuicao, Disciplina, Professor, Turma } from '../../types';
import { getProfessorById } from '../../api/professorService';
import { getTurmas } from '../../api/turmaService';
import { getAtribuicoes, getDisciplinas } from '../../api/escolaService';
import { Campo, Campos, Secao } from '../../components/common/Detalhe';
import { formatDateToBR } from '../../utils/dateUtils';
import { maskCPF } from '../../utils/maskUtils';

interface Dados {
  professor: Professor;
  disciplinas: Disciplina[];
  turmas: Turma[];
  atribuicoes: Atribuicao[];
}

export const ProfessorDetalhe: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [dados, setDados] = useState<Dados | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getProfessorById(Number(id)), getDisciplinas(), getTurmas(), getAtribuicoes()])
      .then(([professor, disciplinas, turmas, atribuicoes]) => setDados({ professor, disciplinas, turmas, atribuicoes }))
      .catch((err) => {
        console.error(err);
        setErro(
          isAxiosError(err) && err.response?.status === 404
            ? 'Professor não encontrado.'
            : 'Não foi possível carregar o professor.'
        );
      });
  }, [id]);

  if (erro) {
    return (
      <div className="space-y-4">
        <Link to="/professores" className="inline-flex items-center gap-2 min-h-11 text-blue-600 hover:underline">
          <ArrowLeft size={18} /> Professores
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

  const { professor } = dados;
  const nomeDisciplina = new Map(dados.disciplinas.map((d) => [d.id, d.nome]));
  // Turmas em que é regente ou leciona, com as disciplinas de cada uma.
  const turmas = dados.turmas
    .map((turma) => ({
      turma,
      regente: turma.professor_responsavel === professor.id,
      disciplinas: dados.atribuicoes
        .filter((a) => a.turma === turma.id && a.professor === professor.id)
        .map((a) => nomeDisciplina.get(a.disciplina) ?? ''),
    }))
    .filter((t) => t.regente || t.disciplinas.length > 0);

  return (
    <div className="space-y-6">
      <Link to="/professores" className="inline-flex items-center gap-2 min-h-11 text-blue-600 hover:underline">
        <ArrowLeft size={18} /> Professores
      </Link>

      <section className="bg-white rounded-lg shadow-md p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-4 min-w-0 flex-1">
          {professor.foto ? (
            <img src={professor.foto} alt="" className="h-16 w-16 rounded-full object-cover shrink-0" />
          ) : (
            <div className="h-16 w-16 rounded-full bg-blue-100 text-blue-700 text-xl font-semibold flex items-center justify-center shrink-0" aria-hidden="true">
              {professor.nome.split(' ').map((n) => n[0]).slice(0, 2).join('')}
            </div>
          )}
          <div className="min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 break-words">{professor.nome}</h2>
            <div className="flex flex-wrap gap-2 mt-2">
              {professor.disciplinas.map((d) => (
                <span key={d} className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                  {nomeDisciplina.get(d)}
                </span>
              ))}
            </div>
          </div>
        </div>
        <Link
          to={`/professores/${professor.id}/editar`}
          className="flex items-center justify-center gap-2 min-h-11 px-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 text-sm shrink-0"
        >
          <Edit size={16} /> Editar
        </Link>
      </section>

      <Secao titulo="Turmas" icone={School}>
        {turmas.length === 0 ? (
          <p className="text-sm text-slate-500">Sem turmas atribuídas.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {turmas.map(({ turma, regente, disciplinas }) => (
              <li key={turma.id}>
                <Link
                  to={`/turmas/${turma.id}`}
                  className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 py-3 min-h-11 hover:bg-slate-50 rounded-lg px-2 -mx-2"
                >
                  <span className="font-medium text-blue-700">{turma.nome}</span>
                  <span className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
                    {regente && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                        <Star size={12} /> Regente
                      </span>
                    )}
                    {disciplinas.length > 0 && (
                      <span className="inline-flex items-center gap-1">
                        <BookOpen size={14} /> {disciplinas.join(', ')}
                      </span>
                    )}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Secao>

      <Secao titulo="Dados pessoais" icone={User}>
        <Campos>
          <Campo rotulo="CPF">{professor.cpf && maskCPF(professor.cpf)}</Campo>
          <Campo rotulo="RG">
            {professor.rg && `${professor.rg}${professor.orgao_expedidor ? ` (${professor.orgao_expedidor})` : ''}`}
          </Campo>
          <Campo rotulo="Data de nascimento">{professor.data_nascimento && formatDateToBR(professor.data_nascimento)}</Campo>
          <Campo rotulo="Naturalidade">{professor.naturalidade}</Campo>
          <Campo rotulo="Data de admissão">{professor.data_admissao && formatDateToBR(professor.data_admissao)}</Campo>
        </Campos>
      </Secao>

      <Secao titulo="Contato" icone={Home}>
        <Campos>
          <Campo rotulo="Email">
            {professor.email && (
              <a href={`mailto:${professor.email}`} className="inline-flex items-center min-h-11 text-blue-600 hover:underline break-all">{professor.email}</a>
            )}
          </Campo>
          <Campo rotulo="Telefone">
            {professor.telefone_contato && (
              <a href={`tel:${professor.telefone_contato}`} className="inline-flex items-center min-h-11 text-blue-600 hover:underline">
                {professor.telefone_contato}
              </a>
            )}
          </Campo>
          <Campo rotulo="Endereço" largo>{professor.endereco}</Campo>
        </Campos>
      </Secao>

      <Secao titulo="Acesso ao sistema" icone={KeyRound}>
        <p className="text-sm text-slate-700">
          {professor.usuario
            ? 'Este professor tem uma conta de acesso vinculada.'
            : 'Sem conta de acesso. Vincule uma conta em "Editar" para que ele veja suas turmas.'}
        </p>
      </Secao>
    </div>
  );
};
