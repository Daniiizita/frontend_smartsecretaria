import apiClient from './axios';
import type { Professor } from '../types';

export const getProfessores = async (): Promise<Professor[]> => {
  const response = await apiClient.get<Professor[]>('/professor/');
  return response.data;
};

export const getProfessorById = async (id: number): Promise<Professor> => {
  const response = await apiClient.get<Professor>(`/professor/${id}/`);
  return response.data;
};

export const createProfessor = async (professor: Partial<Professor>): Promise<Professor> => {
  const response = await apiClient.post<Professor>('/professor/', professor);
  return response.data;
};

export const updateProfessor = async (id: number, professor: Partial<Professor>): Promise<Professor> => {
  const response = await apiClient.patch<Professor>(`/professor/${id}/`, professor);
  return response.data;
};

export const deleteProfessor = async (id: number): Promise<void> => {
  await apiClient.delete(`/professor/${id}/`);
};