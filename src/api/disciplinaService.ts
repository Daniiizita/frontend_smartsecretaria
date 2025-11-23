import apiClient from './axios';
import type { Disciplina } from '../types';

export const getDisciplinas = async (): Promise<Disciplina[]> => {
  const response = await apiClient.get<Disciplina[]>('/disciplina/');
  return response.data;
};

export const getDisciplinaById = async (id: number): Promise<Disciplina> => {
  const response = await apiClient.get<Disciplina>(`/disciplina/${id}/`);
  return response.data;
};

export const createDisciplina = async (disciplina: Partial<Disciplina>): Promise<Disciplina> => {
  const response = await apiClient.post<Disciplina>('/disciplina/', disciplina);
  return response.data;
};

export const updateDisciplina = async (id: number, disciplina: Partial<Disciplina>): Promise<Disciplina> => {
  const response = await apiClient.patch<Disciplina>(`/disciplina/${id}/`, disciplina);
  return response.data;
};

export const deleteDisciplina = async (id: number): Promise<void> => {
  await apiClient.delete(`/disciplina/${id}/`);
};