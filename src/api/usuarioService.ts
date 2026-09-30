import apiClient from './axios';
import type { Usuario, UsuarioPayload } from '../types';

export const getMe = async (): Promise<Usuario> => {
  const response = await apiClient.get<Usuario>('/usuarios/me/');
  return response.data;
};

export const trocarMinhaSenha = async (senhaAtual: string, novaSenha: string): Promise<void> => {
  await apiClient.post('/usuarios/me/senha/', {
    senha_atual: senhaAtual,
    nova_senha: novaSenha,
  });
};

export const getUsuarios = async (): Promise<Usuario[]> => {
  const response = await apiClient.get<Usuario[]>('/usuarios/');
  return response.data;
};

export const getUsuarioById = async (id: number): Promise<Usuario> => {
  const response = await apiClient.get<Usuario>(`/usuarios/${id}/`);
  return response.data;
};

export const createUsuario = async (usuario: UsuarioPayload): Promise<Usuario> => {
  const response = await apiClient.post<Usuario>('/usuarios/', usuario);
  return response.data;
};

export const updateUsuario = async (id: number, usuario: UsuarioPayload): Promise<Usuario> => {
  const response = await apiClient.patch<Usuario>(`/usuarios/${id}/`, usuario);
  return response.data;
};
