import { createContext } from 'react';
import type { MeuPerfil } from '../types';

export interface UsuarioContextValue {
  usuario: MeuPerfil | null;
  carregando: boolean;
  recarregar: () => Promise<void>;
  limpar: () => void;
}

export const UsuarioContext = createContext<UsuarioContextValue | null>(null);
