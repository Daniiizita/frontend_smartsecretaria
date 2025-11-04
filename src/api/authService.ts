import apiClient from './axios';
import type { TokenObtainPair, UserCredentials } from '../types';

export const login = async (credentials: UserCredentials): Promise<TokenObtainPair> => {
  console.log('Enviando credenciais para /api/token/:', credentials);
  const response = await apiClient.post<TokenObtainPair>('/token/', credentials);
  console.log('Tokens recebidos da API:', response.data);
  return response.data;
};

// No futuro, podemos adicionar funções de logout e refresh token aqui.
