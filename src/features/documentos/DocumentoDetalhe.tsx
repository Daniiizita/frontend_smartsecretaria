import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { ArrowLeft, Edit, Loader2, Printer, Trash2 } from 'lucide-react';
import type { Documento } from '../../types';
import { deleteDocumento, getDocumento } from '../../api/documentoService';
import { useUsuario } from '../../auth/useUsuario';
import { isGestor } from '../../auth/papeis';
import { formatDateToBR } from '../../utils/dateUtils';

/** Folha do documento: na tela com ações; na impressão (ou PDF), só a folha. */
export const DocumentoDetalhe: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { usuario } = useUsuario();
  const gestao = isGestor(usuario);
  const [documento, setDocumento] = useState<Documento | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [excluindo, setExcluindo] = useState(false);

  useEffect(() => {
    getDocumento(Number(id))
      .then(setDocumento)
      .catch((err) => {
        console.error(err);
        setErro(isAxiosError(err) && err.response?.status === 404 ? 'Documento não encontrado ou fora do seu acesso.' : 'Não foi possível carregar o documento.');
      });
  }, [id]);

  // Gestão volta à lista; responsável, à ficha do filho.
  const voltar = gestao
    ? { to: '/documentos', rotulo: 'Documentos' }
    : { to: documento ? `/alunos/${documento.aluno}` : '/dashboard', rotulo: documento ? documento.aluno_nome : 'Início' };

  const excluir = async () => {
    if (!documento || !window.confirm('Excluir este documento? Esta ação não pode ser desfeita.')) return;
    setExcluindo(true);
    try {
      await deleteDocumento(documento.id);
      navigate('/documentos');
    } catch (err) {
      console.error(err);
      setErro('Não foi possível excluir o documento.');
      setExcluindo(false);
    }
  };

  const linkVoltar = (
    <Link to={voltar.to} className="inline-flex items-center gap-2 min-h-11 text-blue-600 hover:underline">
      <ArrowLeft size={18} /> {voltar.rotulo}
    </Link>
  );

  if (erro && !documento) {
    return (
      <div className="space-y-4">
        {linkVoltar}
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{erro}</div>
      </div>
    );
  }
  if (!documento) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-blue-500" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Barra de ações (não sai na impressão) */}
      <div className="print:hidden flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {linkVoltar}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 min-h-11 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
          >
            <Printer size={16} /> Imprimir / salvar PDF
          </button>
          {gestao && (
            <>
              <Link
                to={`/documentos/${documento.id}/editar`}
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
                <Trash2 size={16} /> Excluir
              </button>
            </>
          )}
        </div>
      </div>
      {erro && <p className="print:hidden text-sm text-red-600" role="alert">{erro}</p>}

      {/* Folha */}
      <article className="bg-white shadow-md print:shadow-none rounded-lg print:rounded-none mx-auto max-w-[210mm] px-6 py-8 sm:px-14 sm:py-14 print:px-0 print:py-0 text-slate-900">
        <header className="text-center border-b border-slate-300 pb-4 mb-8">
          <p className="text-lg sm:text-xl font-semibold">{documento.escola_nome}</p>
          <p className="text-sm text-slate-600">Secretaria escolar · {documento.escola_cidade}</p>
        </header>

        <h1 className="text-center text-lg sm:text-xl font-bold uppercase tracking-wide mb-8">{documento.tipo_label}</h1>

        <div className="whitespace-pre-line leading-relaxed text-justify text-base">{documento.conteudo}</div>

        <footer className="mt-20 flex flex-col items-center">
          <div className="w-64 max-w-full border-t border-slate-500 pt-2 text-center text-sm">Secretaria escolar</div>
          <p className="mt-10 text-xs text-slate-500 text-center">
            Emitido em {formatDateToBR(documento.data_emissao)} · Documento de demonstração com dados fictícios.
          </p>
        </footer>
      </article>
    </div>
  );
};
