import { useState, useEffect } from 'react';
import type { Aluno } from '../../types';
import { getAlunos } from '../../api/alunoService';

export const useAlunos = () => {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlunos = async () => {
      try {
        const data = await getAlunos();
        setAlunos(data);
      } catch (err) {
        setError('Falha ao buscar alunos.');
      } finally {
        setLoading(false);
      }
    };

    fetchAlunos();
  }, []);

  return { alunos, loading, error };
};

