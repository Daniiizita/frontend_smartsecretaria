import apiClient from './axios';
import type { Matricula, MatriculaPayload, StatusMatricula } from '../types';

export interface FiltrosMatricula {
  aluno?: number;
  turma?: number;
  ano?: number;
  status?: StatusMatricula;
}

// A API devolve apenas o que o perfil logado pode ver; os filtros só restringem.
export const listarMatriculas = async (filtros: FiltrosMatricula = {}): Promise<Matricula[]> =>
  (await apiClient.get<Matricula[]>('/matricula/', { params: filtros })).data;

export const getMatricula = async (id: number): Promise<Matricula> =>
  (await apiClient.get<Matricula>(`/matricula/${id}/`)).data;

export const createMatricula = async (dados: MatriculaPayload): Promise<Matricula> =>
  (await apiClient.post<Matricula>('/matricula/', dados)).data;

export const updateMatricula = async (id: number, dados: Partial<MatriculaPayload>): Promise<Matricula> =>
  (await apiClient.patch<Matricula>(`/matricula/${id}/`, dados)).data;

export const deleteMatricula = async (id: number): Promise<void> => {
  await apiClient.delete(`/matricula/${id}/`);
};
