import { useState, useEffect } from 'react';
import type { Professor } from '../../types';
import { getProfessores } from '../../api/professorService';

export const useProfessores = () => {
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfessores = async () => {
      try {
        const data = await getProfessores();
        setProfessores(data);
      } catch (err) {
        setError('Falha ao buscar professores.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfessores();
  }, []);

  return { professores, loading, error };
};