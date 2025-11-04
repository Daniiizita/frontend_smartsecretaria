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

export const createAluno = async (aluno: Omit<Aluno, 'id'>): Promise<Aluno> => {
  const response = await apiClient.post<Aluno>('/aluno/', aluno);
  return response.data;
};

// Adicione aqui as funções para update e delete...

