import type { TipoUsuario, Usuario } from '../types';

/*
 * Espelho das regras do backend (core/permissions.py) apenas para a interface:
 * esconder menus e opções que o usuário não pode usar. Quem garante o acesso
 * é sempre a API.
 */

export const TIPO_LABELS: Record<TipoUsuario, string> = {
  admin: 'Administrador',
  secretario: 'Secretaria',
  professor: 'Professor',
  aluno: 'Aluno',
  responsavel: 'Responsável',
};

const TODOS_OS_TIPOS: TipoUsuario[] = ['admin', 'secretario', 'professor', 'responsavel', 'aluno'];
const TIPOS_DA_SECRETARIA: TipoUsuario[] = ['professor', 'responsavel', 'aluno'];

export const isAdmin = (usuario: Usuario | null): boolean =>
  !!usuario && (usuario.is_superuser || usuario.tipo === 'admin');

export const isGestor = (usuario: Usuario | null): boolean =>
  isAdmin(usuario) || usuario?.tipo === 'secretario';

export const tiposGerenciaveis = (usuario: Usuario | null): TipoUsuario[] => {
  if (isAdmin(usuario)) return TODOS_OS_TIPOS;
  if (isGestor(usuario)) return TIPOS_DA_SECRETARIA;
  return [];
};

export const nomeDeExibicao = (usuario: Usuario): string =>
  [usuario.first_name, usuario.last_name].filter(Boolean).join(' ') || usuario.username;
