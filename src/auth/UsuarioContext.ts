import { createContext } from 'react';
import type { Usuario } from '../types';

export interface UsuarioContextValue {
  usuario: Usuario | null;
  carregando: boolean;
  recarregar: () => Promise<void>;
  limpar: () => void;
}

export const UsuarioContext = createContext<UsuarioContextValue | null>(null);
