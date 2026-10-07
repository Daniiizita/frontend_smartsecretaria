import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FilePlus2, Search } from 'lucide-react';
import type { Documento, TipoDocumento } from '../../types';
import { listarDocumentos } from '../../api/documentoService';
import { AcoesDoItem } from '../../components/common/AcoesDoItem';
import { formatDateToBR } from '../../utils/dateUtils';
import { TIPOS_DOCUMENTO } from './tipos';

const selectClasses =
  'w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500';

export const DocumentoList: React.FC = () => {
  const navigate = useNavigate();
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [busca, setBusca] = useState('');
  const [tipo, setTipo] = useState<TipoDocumento | ''>('');
  const [ano, setAno] = useState('');

  useEffect(() => {
    listarDocumentos()
      .then(setDocumentos)
      .catch((err) => {
        console.error(err);
        setErro('Falha ao buscar documentos.');
      })
      .finally(() => setCarregando(false));
  }, []);

  const anos = useMemo(
    () => [...new Set(documentos.map((d) => d.data_emissao.slice(0, 4)))].sort((a, b) => b.localeCompare(a)),
    [documentos]
  );
  const termo = busca.trim().toLowerCase();
  const filtrados = documentos.filter(
    (d) =>
      (!tipo || d.tipo === tipo) &&
      (!ano || d.data_emissao.startsWith(ano)) &&
      (!termo || d.aluno_nome.toLowerCase().includes(termo))
  );

  if (carregando) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }
  if (erro) return <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{erro}</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Documentos</h2>
          <p className="text-sm text-slate-500">Declarações, atestados e demais documentos emitidos pela secretaria.</p>
        </div>
        <Link
          to="/documentos/novo"
          className="flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2.5 rounded-lg hover:bg-blue-600 transition-colors whitespace-nowrap"
        >
          <FilePlus2 size={20} />
          Emitir documento
        </Link>
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
        <select aria-label="Tipo de documento" value={tipo} onChange={(e) => setTipo(e.target.value as TipoDocumento | '')} className={selectClasses}>
          <option value="">Todos os tipos</option>
          {TIPOS_DOCUMENTO.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
        <select aria-label="Ano de emissão" value={ano} onChange={(e) => setAno(e.target.value)} className={selectClasses}>
          <option value="">Todos os anos</option>
          {anos.map((a) => (
            <option key={a} value={a}>Emitidos em {a}</option>
          ))}
        </select>
      </div>

      {filtrados.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <p className="text-slate-500">
            {documentos.length === 0 ? 'Nenhum documento emitido ainda.' : 'Nenhum documento encontrado com esses filtros.'}
          </p>
        </div>
      ) : (
        <>
          {/* Celular: cartões */}
          <ul className="md:hidden space-y-3">
            {filtrados.map((d) => (
              <li key={d.id} className="relative bg-white rounded-lg shadow-sm p-4 flex items-center gap-3 hover:shadow-md hover:ring-1 hover:ring-blue-200 transition">
                <div className="min-w-0 flex-1">
                  <Link to={`/documentos/${d.id}`} className="block font-medium text-slate-900 truncate after:absolute after:inset-0 after:rounded-lg">
                    {d.tipo_label}
                  </Link>
                  <p className="text-sm text-slate-600 truncate">{d.aluno_nome}</p>
                  <p className="text-xs text-slate-500">Emitido em {formatDateToBR(d.data_emissao)}</p>
                </div>
                <AcoesDoItem nome={`${d.tipo_label} de ${d.aluno_nome}`} verUrl={`/documentos/${d.id}`} editarUrl={`/documentos/${d.id}/editar`} />
              </li>
            ))}
          </ul>

          {/* Tablet e desktop: tabela */}
          <div className="hidden md:block bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  {['Documento', 'Aluno', 'Emissão'].map((t) => (
                    <th key={t} className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{t}</th>
                  ))}
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtrados.map((d) => (
                  <tr key={d.id} onClick={() => navigate(`/documentos/${d.id}`)} className="hover:bg-blue-50/50 cursor-pointer">
                    <td className="px-6 py-3">
                      <Link to={`/documentos/${d.id}`} onClick={(e) => e.stopPropagation()} className="font-medium text-slate-900 hover:text-blue-700 hover:underline">
                        {d.tipo_label}
                      </Link>
                    </td>
                    <td className="px-6 py-3 text-sm text-slate-600">{d.aluno_nome}</td>
                    <td className="px-6 py-3 text-sm text-slate-600 whitespace-nowrap">{formatDateToBR(d.data_emissao)}</td>
                    <td className="px-6 py-3">
                      <div className="flex justify-end">
                        <AcoesDoItem nome={`${d.tipo_label} de ${d.aluno_nome}`} verUrl={`/documentos/${d.id}`} editarUrl={`/documentos/${d.id}/editar`} />
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
