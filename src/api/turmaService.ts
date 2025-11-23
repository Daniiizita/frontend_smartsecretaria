import apiClient from './axios';
import type { Turma } from '../types';

export const getTurmas = async (): Promise<Turma[]> => {
  const response = await apiClient.get<Turma[]>('/turma/');
  return response.data;
};

export const getTurmaById = async (id: number): Promise<Turma> => {
  const response = await apiClient.get<Turma>(`/turma/${id}/`);
  return response.data;
};

export const createTurma = async (turma: Partial<Turma>): Promise<Turma> => {
  const response = await apiClient.post<Turma>('/turma/', turma);
  return response.data;
};

export const updateTurma = async (id: number, turma: Partial<Turma>): Promise<Turma> => {
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