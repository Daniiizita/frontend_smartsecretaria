import apiClient from './axios';
import type { DashboardData } from '../types';

export const getDashboardData = async (): Promise<DashboardData> => {
  const response = await apiClient.get<DashboardData>('/dashboard/');
  console.log('Dados do dashboard recebidos:', response.data);
  return response.data;
};
