import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { getMe } from '../api/usuarioService';
import { config } from '../config/env';
import type { MeuPerfil } from '../types';
import { UsuarioContext } from './UsuarioContext';

export const UsuarioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<MeuPerfil | null>(null);
  const [carregando, setCarregando] = useState(true);

  const recarregar = useCallback(async () => {
    if (!localStorage.getItem(config.storage.accessToken)) {
      setUsuario(null);
      setCarregando(false);
      return;
    }
    setCarregando(true);
    try {
      setUsuario(await getMe());
    } catch (err) {
      // Token inválido/expirado: o interceptor do axios já trata o redirecionamento.
      console.error('Falha ao carregar o usuário logado:', err);
      setUsuario(null);
    } finally {
      setCarregando(false);
    }
  }, []);

  const limpar = useCallback(() => setUsuario(null), []);

  useEffect(() => {
    recarregar();
  }, [recarregar]);

  const value = useMemo(
    () => ({ usuario, carregando, recarregar, limpar }),
    [usuario, carregando, recarregar, limpar]
  );

  return <UsuarioContext.Provider value={value}>{children}</UsuarioContext.Provider>;
};
