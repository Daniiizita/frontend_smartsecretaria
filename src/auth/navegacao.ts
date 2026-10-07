import type { LucideIcon } from 'lucide-react';
import { ClipboardList, FileText, LayoutDashboard, School, User, UserCircle, UserCog, Users } from 'lucide-react';
import type { Usuario } from '../types';
import { isGestor } from './papeis';

export interface ItemDeMenu {
  path: string;
  label: string;
  icon: LucideIcon;
}

const INICIO: ItemDeMenu = { path: '/dashboard', label: 'Início', icon: LayoutDashboard };
const MEU_PERFIL: ItemDeMenu = { path: '/perfil', label: 'Meu perfil', icon: UserCircle };

/**
 * Menu de cada perfil: só aparece o que a pessoa pode usar.
 * (Módulos sem tela pronta, como o calendário, ficam fora até existirem.)
 */
export const itensDeMenu = (usuario: Usuario | null): ItemDeMenu[] => {
  if (!usuario) return [];
  if (isGestor(usuario)) {
    return [
      INICIO,
      { path: '/usuarios', label: 'Usuários', icon: UserCog },
      { path: '/alunos', label: 'Alunos', icon: Users },
      { path: '/professores', label: 'Professores', icon: User },
      { path: '/turmas', label: 'Turmas', icon: School },
      { path: '/matriculas', label: 'Matrículas', icon: ClipboardList },
      { path: '/documentos', label: 'Documentos', icon: FileText },
      MEU_PERFIL,
    ];
  }
  if (usuario.tipo === 'professor') {
    return [
      INICIO,
      { path: '/turmas', label: 'Minhas turmas', icon: School },
      { path: '/alunos', label: 'Meus alunos', icon: Users },
      MEU_PERFIL,
    ];
  }
  if (usuario.tipo === 'responsavel') {
    return [INICIO, MEU_PERFIL];
  }
  return [MEU_PERFIL];
};
