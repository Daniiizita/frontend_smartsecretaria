import apiClient from './axios';
import type { Notificacao } from '../types';

// A API devolve apenas as notificações do usuário logado.
export const getNotificacoes = async (): Promise<Notificacao[]> =>
  (await apiClient.get<Notificacao[]>('/notificacoes/')).data;

export const marcarComoLida = async (id: number): Promise<Notificacao> =>
  (await apiClient.patch<Notificacao>(`/notificacoes/${id}/`, { lida: true })).data;
