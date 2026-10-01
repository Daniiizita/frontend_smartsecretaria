import { useCallback, useEffect, useState } from 'react';
import type { Turma } from '../../types';
import { getTurmas } from '../../api/turmaService';

export const useTurmas = () => {
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    setLoading(true);
    try {
      setTurmas(await getTurmas());
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Falha ao buscar turmas.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  return { turmas, loading, error, refetch: carregar };
};
