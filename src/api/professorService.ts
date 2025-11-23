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

export const createProfessor = async (professor: Partial<Professor>, foto?: File): Promise<Professor> => {
  if (foto) {
    const formData = new FormData();
    
    // Adiciona todos os campos
    Object.entries(professor).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'disciplinas' && Array.isArray(value)) {
          value.forEach(id => formData.append('disciplinas', id.toString()));
        } else {
          formData.append(key, value.toString());
        }
      }
    });
    
    // Adiciona a foto
    formData.append('foto', foto);
    
    const response = await apiClient.post<Professor>('/professor/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } else {
    const response = await apiClient.post<Professor>('/professor/', professor);
    return response.data;
  }
};

export const updateProfessor = async (
  id: number, 
  professor: Partial<Professor>,
  foto?: File
): Promise<Professor> => {
  if (foto) {
    const formData = new FormData();
    
    // Adiciona todos os campos
    Object.entries(professor).forEach(([key, value]) => {
      if (value !== undefined && value !== null && key !== 'id' && key !== 'foto') {
        if (key === 'disciplinas' && Array.isArray(value)) {
          value.forEach(id => formData.append('disciplinas', id.toString()));
        } else {
          formData.append(key, value.toString());
        }
      }
    });
    
    // Adiciona a foto
    formData.append('foto', foto);
    
    const response = await apiClient.patch<Professor>(`/professor/${id}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } else {
    // Remove campos read-only
    const { id: _, foto: __, ...dataToSend } = professor;
    
    const response = await apiClient.patch<Professor>(`/professor/${id}/`, dataToSend);
    return response.data;
  }
};

export const deleteProfessor = async (id: number): Promise<void> => {
  await apiClient.delete(`/professor/${id}/`);
};