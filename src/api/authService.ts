import apiClient from './axios';
import type { TokenObtainPair, UserCredentials } from '../types';
import { config } from '../config/env';

export const login = async (credentials: UserCredentials): Promise<TokenObtainPair> => {
  const response = await apiClient.post<TokenObtainPair>('/token/', credentials);
  return response.data;
};

/**
 * Encerra a sessão: invalida o refresh token no backend (melhor esforço)
 * e limpa os dados locais mesmo se a API estiver fora do ar.
 */
export const logout = async (): Promise<void> => {
  const refresh = localStorage.getItem(config.storage.refreshToken);
  try {
    if (refresh) {
      await apiClient.post('/token/blacklist/', { refresh });
    }
  } catch (err) {
    if (config.isDevelopment) console.warn('Não foi possível invalidar o token no logout:', err);
  } finally {
    localStorage.removeItem(config.storage.accessToken);
    localStorage.removeItem(config.storage.refreshToken);
    localStorage.removeItem(config.storage.isAuthenticated);
  }
};
