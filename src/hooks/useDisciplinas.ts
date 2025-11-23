import { useState, useEffect, useCallback } from 'react';
import type { Disciplina } from '../types';
import { getDisciplinas } from '../api/disciplinaService';

export const useDisciplinas = () => {
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [disciplinasMap, setDisciplinasMap] = useState<Map<number, string>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDisciplinas = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getDisciplinas();
      setDisciplinas(data);
      
      // Cria um Map para facilitar busca rápida de nome por ID
      const map = new Map(data.map(d => [d.id, d.nome]));
      setDisciplinasMap(map);
      
      setError(null);
    } catch (err) {
      setError('Falha ao buscar disciplinas.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDisciplinas();
  }, [fetchDisciplinas]);

  // Função auxiliar para pegar nomes das disciplinas a partir de IDs
  const getDisciplinaNomes = useCallback((ids: number[]): string[] => {
    return ids.map(id => disciplinasMap.get(id)).filter(Boolean) as string[];
  }, [disciplinasMap]);

  return { 
    disciplinas, 
    disciplinasMap,
    loading, 
    error,
    refetch: fetchDisciplinas,
    getDisciplinaNomes
  };
};