import { useState, useEffect } from 'react';
import { getTurmaChoices, type TurmaChoices } from '../api/turmaService';

export const useTurmaChoices = () => {
  const [choices, setChoices] = useState<TurmaChoices | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChoices = async () => {
      try {
        const data = await getTurmaChoices();
        setChoices(data);
      } catch (err) {
        console.error('Erro ao buscar choices:', err);
        setError('Falha ao carregar opções de turma.');
      } finally {
        setLoading(false);
      }
    };

    fetchChoices();
  }, []);

  return { choices, loading, error };
};