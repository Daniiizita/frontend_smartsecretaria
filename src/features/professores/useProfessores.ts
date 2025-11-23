import { useState, useEffect, useCallback } from 'react';
import type { Professor } from '../../types';
import { getProfessores } from '../../api/professorService';

export const useProfessores = () => {
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfessores = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getProfessores();
      setProfessores(data);
      setError(null);
    } catch (err) {
      setError('Falha ao buscar professores.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfessores();
  }, [fetchProfessores]);

  return { 
    professores, 
    loading, 
    error,
    refetch: fetchProfessores 
  };
};