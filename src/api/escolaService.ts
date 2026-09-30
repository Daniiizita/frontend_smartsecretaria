import apiClient from './axios';
import type { Atribuicao, Disciplina, Documento, Evento, Matricula } from '../types';

// Consultas somente leitura. A API já devolve apenas o que o perfil logado pode ver.

export const getDisciplinas = async (): Promise<Disciplina[]> =>
  (await apiClient.get<Disciplina[]>('/disciplina/')).data;

export const getAtribuicoes = async (): Promise<Atribuicao[]> =>
  (await apiClient.get<Atribuicao[]>('/turma/atribuicoes/')).data;

export const getEventos = async (): Promise<Evento[]> =>
  (await apiClient.get<Evento[]>('/calendario/')).data;

export const getMatriculas = async (): Promise<Matricula[]> =>
  (await apiClient.get<Matricula[]>('/matricula/')).data;

export const getDocumentos = async (): Promise<Documento[]> =>
  (await apiClient.get<Documento[]>('/documentos/')).data;

export const proximosEventos = (eventos: Evento[], quantidade = 3): Evento[] => {
  const agora = Date.now();
  return eventos
    .filter((e) => new Date(e.data_inicio).getTime() >= agora)
    .sort((a, b) => new Date(a.data_inicio).getTime() - new Date(b.data_inicio).getTime())
    .slice(0, quantidade);
};
