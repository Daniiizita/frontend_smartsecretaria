import apiClient from './axios';
import type { TokenObtainPair, UserCredentials } from '../types';
import { config } from '../config/env';

export const login = async (credentials: UserCredentials): Promise<TokenObtainPair> => {
  if (config.isDevelopment) {
    console.log('Tentando login com:', { username: credentials.username });
  }
  
  const response = await apiClient.post<TokenObtainPair>('/token/', credentials);
  
  if (config.isDevelopment) {
    console.log('Login bem-sucedido, tokens recebidos');
  }
  
  return response.data;
};

export const logout = () => {
  localStorage.removeItem(config.storage.accessToken);
  localStorage.removeItem(config.storage.refreshToken);
  localStorage.removeItem(config.storage.isAuthenticated);
  
  if (config.isDevelopment) {
    console.log('Logout realizado');
  }
};

// No futuro, podemos adicionar funções de refresh token aqui.
