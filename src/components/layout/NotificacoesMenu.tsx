import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCheck } from 'lucide-react';
import type { Notificacao } from '../../types';
import { getNotificacoes, marcarComoLida } from '../../api/notificacaoService';

const ATUALIZAR_A_CADA_MS = 60_000;

const quando = (iso: string) =>
  new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

export const NotificacoesMenu: React.FC = () => {
  const navigate = useNavigate();
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [aberto, setAberto] = useState(false);
  const [falha, setFalha] = useState(false);
  const painelRef = useRef<HTMLDivElement>(null);

  const carregar = useCallback(async () => {
    try {
      setNotificacoes(await getNotificacoes());
      setFalha(false);
    } catch (err) {
      console.error('Falha ao carregar notificações:', err);
      setFalha(true);
    }
  }, []);

  useEffect(() => {
    carregar();
    const intervalo = window.setInterval(carregar, ATUALIZAR_A_CADA_MS);
    return () => window.clearInterval(intervalo);
  }, [carregar]);

  // Fecha ao clicar fora ou apertar Esc.
  useEffect(() => {
    if (!aberto) return;
    const aoClicar = (e: MouseEvent) => {
      if (painelRef.current && !painelRef.current.contains(e.target as Node)) setAberto(false);
    };
    const aoTeclar = (e: KeyboardEvent) => e.key === 'Escape' && setAberto(false);
    document.addEventListener('mousedown', aoClicar);
    document.addEventListener('keydown', aoTeclar);
    return () => {
      document.removeEventListener('mousedown', aoClicar);
      document.removeEventListener('keydown', aoTeclar);
    };
  }, [aberto]);

  const naoLidas = notificacoes.filter((n) => !n.lida);

  const marcarLida = async (notificacao: Notificacao) => {
    if (notificacao.lida) return;
    const atualizada = await marcarComoLida(notificacao.id);
    setNotificacoes((lista) => lista.map((n) => (n.id === atualizada.id ? atualizada : n)));
  };

  const abrir = async (notificacao: Notificacao) => {
    try {
      await marcarLida(notificacao);
    } catch (err) {
      console.error(err);
    }
    if (notificacao.link?.startsWith('/')) {
      setAberto(false);
      navigate(notificacao.link);
    }
  };

  const marcarTodas = async () => {
    try {
      await Promise.all(naoLidas.map((n) => marcarComoLida(n.id)));
    } finally {
      carregar();
    }
  };

  return (
    <div className="relative" ref={painelRef}>
      <button
        type="button"
        onClick={() => {
          setAberto((v) => !v);
          if (!aberto) carregar();
        }}
        className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors"
        aria-label={naoLidas.length > 0 ? `Notificações: ${naoLidas.length} não lidas` : 'Notificações'}
        aria-expanded={aberto}
        aria-haspopup="true"
      >
        <Bell size={20} className="text-slate-600" />
        {naoLidas.length > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[1.1rem] h-[1.1rem] px-1 rounded-full bg-red-500 text-white text-[10px] font-semibold flex items-center justify-center">
            {naoLidas.length > 9 ? '9+' : naoLidas.length}
          </span>
        )}
      </button>

      {aberto && (
        <div className="fixed inset-x-3 top-16 sm:absolute sm:inset-x-auto sm:top-auto sm:right-0 sm:mt-2 sm:w-80 bg-white rounded-lg shadow-lg border border-slate-200 z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-800">Notificações</h2>
            {naoLidas.length > 0 && (
              <button
                type="button"
                onClick={marcarTodas}
                className="flex items-center gap-1 text-xs text-blue-600 hover:underline"
              >
                <CheckCheck size={14} /> Marcar todas como lidas
              </button>
            )}
          </div>

          {falha ? (
            <p className="px-4 py-6 text-sm text-slate-500">Não foi possível carregar as notificações.</p>
          ) : notificacoes.length === 0 ? (
            <p className="px-4 py-6 text-sm text-slate-500">Você não tem notificações.</p>
          ) : (
            <ul className="max-h-96 overflow-y-auto divide-y divide-slate-100">
              {notificacoes.slice(0, 20).map((n) => (
                <li key={n.id}>
                  <button
                    type="button"
                    onClick={() => abrir(n)}
                    className={`w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors ${n.lida ? '' : 'bg-blue-50/60'}`}
                  >
                    <div className="flex items-start gap-2">
                      {!n.lida && <span className="mt-1.5 h-2 w-2 rounded-full bg-blue-500 shrink-0" aria-label="Não lida" />}
                      <div className="min-w-0">
                        <p className={`text-sm ${n.lida ? 'text-slate-700' : 'text-slate-900 font-medium'}`}>{n.titulo}</p>
                        <p className="text-xs text-slate-500 line-clamp-2">{n.mensagem}</p>
                        <p className="text-[11px] text-slate-400 mt-1">{quando(n.criada_em)}</p>
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};
