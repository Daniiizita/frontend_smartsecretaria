import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { ArrowLeft, ArrowRightLeft, CheckCircle2, ClipboardList, Edit, FileText, Loader2, RotateCcw, Trash2, XCircle } from 'lucide-react';
import type { Matricula, StatusMatricula } from '../../types';
import { deleteMatricula, getMatricula, updateMatricula } from '../../api/matriculaService';
import { Campo, Campos, Secao } from '../../components/common/Detalhe';
import { formatDateToBR } from '../../utils/dateUtils';
import { STATUS } from './status';

interface Acao {
  para: StatusMatricula;
  rotulo: string;
  pergunta: string;
  icone: React.ElementType;
  classe: string;
}

const ACOES: Record<StatusMatricula, Acao[]> = {
  pendente: [
    { para: 'ativo', rotulo: 'Confirmar matrícula', pergunta: 'Confirmar esta matrícula? O aluno passa a constar na turma.', icone: CheckCircle2, classe: 'bg-green-600 text-white hover:bg-green-700' },
    { para: 'cancelado', rotulo: 'Cancelar', pergunta: 'Cancelar esta matrícula?', icone: XCircle, classe: 'bg-red-50 text-red-600 hover:bg-red-100' },
  ],
  ativo: [
    { para: 'transferido', rotulo: 'Transferir', pergunta: 'Registrar a transferência deste aluno?', icone: ArrowRightLeft, classe: 'bg-slate-100 text-slate-700 hover:bg-slate-200' },
    { para: 'cancelado', rotulo: 'Cancelar', pergunta: 'Cancelar esta matrícula?', icone: XCircle, classe: 'bg-red-50 text-red-600 hover:bg-red-100' },
  ],
  cancelado: [
    { para: 'ativo', rotulo: 'Reativar', pergunta: 'Reativar esta matrícula?', icone: RotateCcw, classe: 'bg-blue-50 text-blue-700 hover:bg-blue-100' },
  ],
  transferido: [
    { para: 'ativo', rotulo: 'Reativar', pergunta: 'Reativar esta matrícula?', icone: RotateCcw, classe: 'bg-blue-50 text-blue-700 hover:bg-blue-100' },
  ],
};

const mensagemDaApi = (err: unknown, padrao: string) => {
  if (isAxiosError(err) && err.response?.data && typeof err.response.data === 'object') {
    const primeira = Object.values(err.response.data as Record<string, unknown>)[0];
    return String(Array.isArray(primeira) ? primeira[0] : primeira ?? padrao);
  }
  return padrao;
};

export const MatriculaDetalhe: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [matricula, setMatricula] = useState<Matricula | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [erroAcao, setErroAcao] = useState<string | null>(null);
  const [processando, setProcessando] = useState(false);

  useEffect(() => {
    getMatricula(Number(id))
      .then(setMatricula)
      .catch((err) => {
        console.error(err);
        setErro(isAxiosError(err) && err.response?.status === 404 ? 'Matrícula não encontrada.' : 'Não foi possível carregar a matrícula.');
      });
  }, [id]);

  const executar = async (acao: Acao) => {
    if (!matricula || !window.confirm(acao.pergunta)) return;
    setProcessando(true);
    setErroAcao(null);
    try {
      setMatricula(await updateMatricula(matricula.id, { status: acao.para }));
    } catch (err) {
      setErroAcao(mensagemDaApi(err, 'Não foi possível alterar a situação.'));
    } finally {
      setProcessando(false);
    }
  };

  const excluir = async () => {
    if (!matricula || !window.confirm('Excluir esta matrícula? Prefira "Cancelar" para manter o histórico.')) return;
    setProcessando(true);
    try {
      await deleteMatricula(matricula.id);
      navigate('/matriculas');
    } catch (err) {
      setErroAcao(mensagemDaApi(err, 'Não foi possível excluir a matrícula.'));
      setProcessando(false);
    }
  };

  const voltar = (
    <Link to="/matriculas" className="inline-flex items-center gap-2 min-h-11 text-blue-600 hover:underline">
      <ArrowLeft size={18} /> Matrículas
    </Link>
  );

  if (erro) {
    return (
      <div className="space-y-4">
        {voltar}
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{erro}</div>
      </div>
    );
  }
  if (!matricula) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-blue-500" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {voltar}

      <section className="bg-white rounded-lg shadow-md p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm text-slate-500">Matrícula {matricula.ano_letivo}</p>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 break-words">
              <Link to={`/alunos/${matricula.aluno}`} className="inline-flex items-center min-h-11 hover:text-blue-700 hover:underline">{matricula.aluno_nome}</Link>
            </h2>
            <span className={`inline-block mt-2 text-sm font-medium px-3 py-1 rounded-full ${STATUS[matricula.status].cor}`}>
              {STATUS[matricula.status].label}
            </span>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            <Link
              to={`/documentos/novo?aluno=${matricula.aluno}&tipo=declaracao`}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 min-h-11 px-4 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 text-sm"
            >
              <FileText size={16} /> Emitir declaração
            </Link>
            <Link
              to={`/matriculas/${matricula.id}/editar`}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 min-h-11 px-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 text-sm"
            >
              <Edit size={16} /> Editar
            </Link>
            <button
              type="button"
              onClick={excluir}
              disabled={processando}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 min-h-11 px-4 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-sm disabled:opacity-50"
            >
              <Trash2 size={16} /> Excluir
            </button>
          </div>
        </div>

        {/* Ações rápidas conforme a situação atual */}
        <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-slate-100">
          {ACOES[matricula.status].map((acao) => {
            const Icone = acao.icone;
            return (
              <button
                key={acao.para + acao.rotulo}
                type="button"
                onClick={() => executar(acao)}
                disabled={processando}
                className={`flex items-center justify-center gap-2 min-h-11 px-4 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${acao.classe}`}
              >
                {processando ? <Loader2 size={16} className="animate-spin" /> : <Icone size={16} />}
                {acao.rotulo}
              </button>
            );
          })}
        </div>
        {erroAcao && (
          <p className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800" role="alert">{erroAcao}</p>
        )}
      </section>

      <Secao titulo="Dados da matrícula" icone={ClipboardList}>
        <Campos>
          <Campo rotulo="Aluno">
            <Link to={`/alunos/${matricula.aluno}`} className="inline-flex items-center min-h-11 text-blue-600 hover:underline">{matricula.aluno_nome}</Link>
          </Campo>
          <Campo rotulo="Turma">
            <Link to={`/turmas/${matricula.turma}`} className="inline-flex items-center min-h-11 text-blue-600 hover:underline">{matricula.turma_nome}</Link>
          </Campo>
          <Campo rotulo="Ano letivo">{matricula.ano_letivo}</Campo>
          <Campo rotulo="Data da matrícula">{formatDateToBR(matricula.data_matricula)}</Campo>
        </Campos>
      </Secao>
    </div>
  );
};
