import { useCallback, useEffect, useState } from 'react';
import type { Usuario } from '../../types';
import { getUsuarios } from '../../api/usuarioService';

export const useUsuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsuarios = useCallback(async () => {
    setLoading(true);
    try {
      setUsuarios(await getUsuarios());
      setError(null);
    } catch (err) {
      setError('Falha ao buscar usuários.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsuarios();
  }, [fetchUsuarios]);

  return { usuarios, loading, error, refetch: fetchUsuarios };
};
