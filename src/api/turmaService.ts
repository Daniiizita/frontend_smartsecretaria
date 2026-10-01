import apiClient from './axios';
import type { Atribuicao, Turma, TurmaPayload } from '../types';

export const getTurmas = async (): Promise<Turma[]> => {
  const response = await apiClient.get<Turma[]>('/turma/');
  return response.data;
};

export const getTurmaById = async (id: number): Promise<Turma> => {
  const response = await apiClient.get<Turma>(`/turma/${id}/`);
  return response.data;
};

export const createTurma = async (turma: TurmaPayload): Promise<Turma> => {
  const response = await apiClient.post<Turma>('/turma/', turma);
  return response.data;
};

export const updateTurma = async (id: number, turma: Partial<TurmaPayload>): Promise<Turma> => {
  const response = await apiClient.patch<Turma>(`/turma/${id}/`, turma);
  return response.data;
};

export const deleteTurma = async (id: number): Promise<void> => {
  await apiClient.delete(`/turma/${id}/`);
};

// Interface para as opções de turma
export interface TurmaChoices {
  serie: Array<{ value: number; label: string }>;
  nivel: Array<{ value: string; label: string }>;
  turma_letra: Array<{ value: string; label: string }>;
  periodo: Array<{ value: string; label: string }>;
}

// Função para buscar as opções
export const getTurmaChoices = async (): Promise<TurmaChoices> => {
  const response = await apiClient.get<TurmaChoices>('/turma/choices/');
  return response.data;
};

// Disciplinas da turma: qual professor leciona cada uma.
export const getAtribuicoesDaTurma = async (turmaId: number): Promise<Atribuicao[]> =>
  (await apiClient.get<Atribuicao[]>('/turma/atribuicoes/', { params: { turma: turmaId } })).data;

export const createAtribuicao = async (dados: Pick<Atribuicao, 'turma' | 'disciplina' | 'professor'>): Promise<Atribuicao> =>
  (await apiClient.post<Atribuicao>('/turma/atribuicoes/', dados)).data;

export const updateAtribuicao = async (id: number, professor: number): Promise<Atribuicao> =>
  (await apiClient.patch<Atribuicao>(`/turma/atribuicoes/${id}/`, { professor })).data;

export const deleteAtribuicao = async (id: number): Promise<void> => {
  await apiClient.delete(`/turma/atribuicoes/${id}/`);
};

// Professor único: o regente passa a lecionar todas as disciplinas.
export const atribuirTudoAoRegente = async (turmaId: number): Promise<Atribuicao[]> =>
  (await apiClient.post<Atribuicao[]>(`/turma/${turmaId}/professor-unico/`)).data;