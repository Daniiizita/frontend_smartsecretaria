import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Plus, Power, Search, ShieldCheck } from 'lucide-react';
import type { TipoUsuario, Usuario } from '../../types';
import { updateUsuario } from '../../api/usuarioService';
import { TIPO_LABELS, nomeDeExibicao, tiposGerenciaveis } from '../../auth/papeis';
import { useUsuario } from '../../auth/useUsuario';
import { CORES_DOS_PERFIS } from './perfis';
import { useUsuarios } from './useUsuarios';

type FiltroStatus = 'todos' | 'ativos' | 'inativos';

export const UsuarioList: React.FC = () => {
  const { usuarios, loading, error, refetch } = useUsuarios();
  const { usuario: logado } = useUsuario();
  const [busca, setBusca] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<TipoUsuario | ''>('');
  const [filtroStatus, setFiltroStatus] = useState<FiltroStatus>('todos');
  const [erroAcao, setErroAcao] = useState<string | null>(null);
  const [alterandoId, setAlterandoId] = useState<number | null>(null);

  const tiposDisponiveis = tiposGerenciaveis(logado);

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return usuarios.filter((u) => {
      const correspondeBusca =
        !termo ||
        nomeDeExibicao(u).toLowerCase().includes(termo) ||
        u.username.toLowerCase().includes(termo) ||
        u.email.toLowerCase().includes(termo);
      const correspondeTipo = !filtroTipo || u.tipo === filtroTipo;
      const correspondeStatus =
        filtroStatus === 'todos' || (filtroStatus === 'ativos' ? u.is_active : !u.is_active);
      return correspondeBusca && correspondeTipo && correspondeStatus;
    });
  }, [usuarios, busca, filtroTipo, filtroStatus]);

  const podeAlterar = (u: Usuario) =>
    u.id !== logado?.id && (!u.is_superuser || !!logado?.is_superuser);

  const alternarAtivo = async (u: Usuario) => {
    const acao = u.is_active ? 'desativar' : 'reativar';
    if (!window.confirm(`Deseja ${acao} a conta "${u.username}"?`)) return;
    setAlterandoId(u.id);
    setErroAcao(null);
    try {
      await updateUsuario(u.id, { is_active: !u.is_active });
      await refetch();
    } catch (err) {
      console.error(err);
      setErroAcao(`Não foi possível ${acao} a conta "${u.username}".`);
    } finally {
      setAlterandoId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Usuários e permissões</h2>
          <p className="text-sm text-slate-500">
            Contas de acesso ao sistema e o nível de permissão de cada uma.
          </p>
        </div>
        <Link
          to="/usuarios/novo"
          className="flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus size={20} />
          Novo usuário
        </Link>
      </div>

      {erroAcao && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg" role="alert">
          {erroAcao}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por nome, login ou email..."
            aria-label="Buscar usuário"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          aria-label="Filtrar por perfil"
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value as TipoUsuario | '')}
          className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos os perfis</option>
          {tiposDisponiveis.map((tipo) => (
            <option key={tipo} value={tipo}>
              {TIPO_LABELS[tipo]}
            </option>
          ))}
        </select>
        <select
          aria-label="Filtrar por status"
          value={filtroStatus}
          onChange={(e) => setFiltroStatus(e.target.value as FiltroStatus)}
          className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="todos">Todos os status</option>
          <option value="ativos">Ativos</option>
          <option value="inativos">Inativos</option>
        </select>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              {['Usuário', 'Email', 'Perfil', 'Status', 'Ações'].map((titulo) => (
                <th
                  key={titulo}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                >
                  {titulo}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtrados.map((u) => (
              <tr key={u.id} className={u.is_active ? '' : 'bg-slate-50 text-slate-400'}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <p className="font-medium text-slate-900">{nomeDeExibicao(u)}</p>
                  <p className="text-sm text-slate-500">@{u.username}</p>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                  {u.email || '—'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${CORES_DOS_PERFIS[u.tipo]}`}>
                    {u.is_superuser && <ShieldCheck size={12} aria-label="Superusuário" />}
                    {TIPO_LABELS[u.tipo]}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      u.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {u.is_active ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {podeAlterar(u) ? (
                    <div className="flex gap-2">
                      <Link
                        to={`/usuarios/${u.id}`}
                        className="flex items-center gap-1 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                      >
                        <Edit size={14} />
                        Editar
                      </Link>
                      <button
                        type="button"
                        onClick={() => alternarAtivo(u)}
                        disabled={alterandoId === u.id}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors text-sm disabled:opacity-50 ${
                          u.is_active
                            ? 'bg-red-50 text-red-600 hover:bg-red-100'
                            : 'bg-green-50 text-green-700 hover:bg-green-100'
                        }`}
                      >
                        <Power size={14} />
                        {u.is_active ? 'Desativar' : 'Reativar'}
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400">
                      {u.id === logado?.id ? 'Sua conta' : 'Protegido'}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtrados.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500">Nenhum usuário encontrado.</p>
          </div>
        )}
      </div>
    </div>
  );
};
