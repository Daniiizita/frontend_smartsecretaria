import apiClient from './axios';
import type { Aluno } from '../types';

export const getAlunos = async (): Promise<Aluno[]> => {
  const response = await apiClient.get<Aluno[]>('/aluno/');
  return response.data;
};

export const getAlunoById = async (id: number): Promise<Aluno> => {
  const response = await apiClient.get<Aluno>(`/aluno/${id}/`);
  return response.data;
};

export const createAluno = async (aluno: Partial<Aluno>): Promise<Aluno> => {
  const response = await apiClient.post<Aluno>('/aluno/', aluno);
  return response.data;
};

export const updateAluno = async (id: number, aluno: Partial<Aluno>): Promise<Aluno> => {
  const response = await apiClient.patch<Aluno>(`/aluno/${id}/`, aluno);
  return response.data;
};

export const deleteAluno = async (id: number): Promise<void> => {
  await apiClient.delete(`/aluno/${id}/`);
};

