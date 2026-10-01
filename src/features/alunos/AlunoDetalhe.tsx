import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { ArrowLeft, ClipboardList, Edit, FileText, Home, Loader2, School, User } from 'lucide-react';
import type { Aluno, Documento, Matricula, Turma } from '../../types';
import { getAlunoById } from '../../api/alunoService';
import { getTurmaById } from '../../api/turmaService';
import { getDocumentos, getMatriculas } from '../../api/escolaService';
import { useUsuario } from '../../auth/useUsuario';
import { isGestor } from '../../auth/papeis';
import { Campo, Campos, Secao } from '../../components/common/Detalhe';
import { formatDateToBR } from '../../utils/dateUtils';
import { maskCPF } from '../../utils/maskUtils';
import { STATUS_MATRICULA, TIPO_DOCUMENTO } from '../inicio/formatos';

interface Dados {
  aluno: Aluno;
  turma: Turma | null;
  matriculas: Matricula[];
  documentos: Documento[];
}

const idade = (nascimento: string) => {
  const [a, m, d] = nascimento.split('-').map(Number);
  const hoje = new Date();
  let anos = hoje.getFullYear() - a;
  if (hoje.getMonth() + 1 < m || (hoje.getMonth() + 1 === m && hoje.getDate() < d)) anos -= 1;
  return anos;
};

export const AlunoDetalhe: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { usuario } = useUsuario();
  const gestao = isGestor(usuario);
  const [dados, setDados] = useState<Dados | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    const alunoId = Number(id);
    const carregar = async () => {
      try {
        const aluno = await getAlunoById(alunoId);
        // Matrículas e documentos: a API devolve vazio para quem não pode vê-los (ex.: professor).
        const [turma, matriculas, documentos] = await Promise.all([
          getTurmaById(aluno.turma).catch(() => null),
          getMatriculas(alunoId).catch(() => []),
          getDocumentos(alunoId).catch(() => []),
        ]);
        setDados({ aluno, turma, matriculas, documentos });
      } catch (err) {
        console.error(err);
        setErro(
          isAxiosError(err) && err.response?.status === 404
            ? 'Aluno não encontrado ou fora do seu acesso.'
            : 'Não foi possível carregar o aluno.'
        );
      }
    };
    carregar();
  }, [id]);

  const voltar = usuario?.tipo === 'responsavel'
    ? { to: '/dashboard', rotulo: 'Início' }
    : { to: '/alunos', rotulo: usuario?.tipo === 'professor' ? 'Meus alunos' : 'Alunos' };

  if (erro) {
    return (
      <div className="space-y-4">
        <Link to={voltar.to} className="inline-flex items-center gap-2 min-h-11 text-blue-600 hover:underline">
          <ArrowLeft size={18} /> {voltar.rotulo}
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

  const { aluno, turma, matriculas, documentos } = dados;
  const matriculaAtual = matriculas[0];

  return (
    <div className="space-y-6">
      <Link to={voltar.to} className="inline-flex items-center gap-2 min-h-11 text-blue-600 hover:underline">
        <ArrowLeft size={18} /> {voltar.rotulo}
      </Link>

      {/* Cabeçalho */}
      <section className="bg-white rounded-lg shadow-md p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-4 min-w-0 flex-1">
          {aluno.foto ? (
            <img src={aluno.foto} alt="" className="h-16 w-16 rounded-full object-cover shrink-0" />
          ) : (
            <div className="h-16 w-16 rounded-full bg-blue-100 text-blue-700 text-2xl font-semibold flex items-center justify-center shrink-0" aria-hidden="true">
              {aluno.nome_completo[0]}
            </div>
          )}
          <div className="min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 break-words">{aluno.nome_completo}</h2>
            <div className="flex flex-wrap items-center gap-2 mt-1 text-sm">
              {turma && (
                <Link to={`/turmas/${turma.id}`} className="text-blue-600 hover:underline">
                  {turma.nome}
                </Link>
              )}
              {aluno.data_nascimento && <span className="text-slate-500">{idade(aluno.data_nascimento)} anos</span>}
              {matriculaAtual && (
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_MATRICULA[matriculaAtual.status].cor}`}>
                  {STATUS_MATRICULA[matriculaAtual.status].label} · {matriculaAtual.ano_letivo}
                </span>
              )}
            </div>
          </div>
        </div>
        {gestao && (
          <Link
            to={`/alunos/${aluno.id}/editar`}
            className="flex items-center justify-center gap-2 min-h-11 px-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 text-sm shrink-0"
          >
            <Edit size={16} /> Editar
          </Link>
        )}
      </section>

      <Secao titulo="Dados pessoais" icone={User}>
        <Campos>
          <Campo rotulo="Data de nascimento">
            {aluno.data_nascimento && `${formatDateToBR(aluno.data_nascimento)} (${idade(aluno.data_nascimento)} anos)`}
          </Campo>
          <Campo rotulo="Turma">{turma?.nome}</Campo>
          <Campo rotulo="CPF">{aluno.cpf && maskCPF(aluno.cpf)}</Campo>
          <Campo rotulo="RG">{aluno.rg && `${aluno.rg}${aluno.orgao_expedidor ? ` (${aluno.orgao_expedidor})` : ''}`}</Campo>
          <Campo rotulo="Email">{aluno.email}</Campo>
        </Campos>
      </Secao>

      <Secao titulo="Família e contato" icone={Home}>
        <Campos>
          <Campo rotulo="Responsável">{aluno.nome_responsavel}</Campo>
          <Campo rotulo="Telefone">
            {aluno.telefone_contato && (
              <a href={`tel:${aluno.telefone_contato}`} className="inline-flex items-center min-h-11 text-blue-600 hover:underline">
                {aluno.telefone_contato}
              </a>
            )}
          </Campo>
          <Campo rotulo="Mãe">{aluno.nome_mae}</Campo>
          <Campo rotulo="Pai">{aluno.nome_pai}</Campo>
          <Campo rotulo="Endereço" largo>{aluno.endereco}</Campo>
        </Campos>
      </Secao>

      {matriculas.length > 0 && (
        <Secao titulo="Matrículas" icone={ClipboardList}>
          <ul className="divide-y divide-slate-100">
            {matriculas.map((m) => (
              <li key={m.id} className="py-2 flex flex-wrap items-center justify-between gap-2">
                <span className="text-slate-800">Ano letivo {m.ano_letivo}</span>
                <span className="text-sm text-slate-500">desde {formatDateToBR(m.data_matricula)}</span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_MATRICULA[m.status].cor}`}>
                  {STATUS_MATRICULA[m.status].label}
                </span>
              </li>
            ))}
          </ul>
        </Secao>
      )}

      {documentos.length > 0 && (
        <Secao titulo="Documentos" icone={FileText}>
          <ul className="divide-y divide-slate-100">
            {documentos.map((d) => (
              <li key={d.id} className="py-2 flex justify-between gap-4">
                <span className="text-slate-800">{TIPO_DOCUMENTO[d.tipo] ?? d.tipo}</span>
                <span className="text-sm text-slate-500 whitespace-nowrap">{formatDateToBR(d.data_emissao)}</span>
              </li>
            ))}
          </ul>
        </Secao>
      )}

      {!gestao && usuario?.tipo === 'professor' && (
        <p className="flex items-center gap-2 text-xs text-slate-500">
          <School size={14} /> Você vê apenas os dados necessários ao trabalho pedagógico.
        </p>
      )}
    </div>
  );
};
