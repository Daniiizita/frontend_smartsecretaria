import apiClient from './axios';
import type { Aluno } from '../types';
import { semCamposSomenteLeitura } from './payload';

// turma (opcional): só os alunos dessa turma.
export const getAlunos = async (turma?: number): Promise<Aluno[]> => {
  const response = await apiClient.get<Aluno[]>('/aluno/', { params: turma ? { turma } : undefined });
  return response.data;
};

export const getAlunoById = async (id: number): Promise<Aluno> => {
  const response = await apiClient.get<Aluno>(`/aluno/${id}/`);
  return response.data;
};

export const createAluno = async (aluno: Partial<Aluno>): Promise<Aluno> => {
  const response = await apiClient.post<Aluno>('/aluno/', semCamposSomenteLeitura(aluno));
  return response.data;
};

export const updateAluno = async (id: number, aluno: Partial<Aluno>): Promise<Aluno> => {
  const response = await apiClient.patch<Aluno>(`/aluno/${id}/`, semCamposSomenteLeitura(aluno));
  return response.data;
};

export const deleteAluno = async (id: number): Promise<void> => {
  await apiClient.delete(`/aluno/${id}/`);
};

