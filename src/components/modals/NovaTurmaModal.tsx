import React, { useState, useEffect } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { createTurma } from '../../api/turmaService';
import { getProfessores } from '../../api/professorService';
import type { Turma, Professor } from '../../types';
import { PERIODOS_TURMA } from '../../constants/turmaConstants';

interface NovaTurmaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (turma: Turma) => void;
}

export const NovaTurmaModal: React.FC<NovaTurmaModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [formData, setFormData] = useState({
    nome: '',
    serie: 1,
    turma_letra: 'A',
    ano: new Date().getFullYear(),
    periodo: 'M', // Valor correto
    professor_responsavel: 0,
  });

  useEffect(() => {
    if (isOpen) {
      const fetchProfessores = async () => {
        try {
          const data = await getProfessores();
          setProfessores(data);
          if (data.length > 0 && formData.professor_responsavel === 0) {
            setFormData(prev => ({ ...prev, professor_responsavel: data[0].id }));
          }
        } catch (error) {
          console.error('Erro ao carregar professores:', error);
        }
      };
      fetchProfessores();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const novaTurma = await createTurma(formData);
      onSuccess(novaTurma);
      onClose();
      // Reseta o formulário
      setFormData({
        nome: '',
        serie: 1,
        turma_letra: 'A',
        ano: new Date().getFullYear(),
        periodo: 'M',
        professor_responsavel: professores[0]?.id || 0,
      });
    } catch (error) {
      console.error('Erro ao criar turma:', error);
      alert('Erro ao criar turma. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'serie' || name === 'ano' || name === 'professor_responsavel' 
        ? Number(value) 
        : value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-slate-800">Nova Turma</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Nome da Turma *
            </label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              placeholder="Ex: 1º Ano A"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Série *
              </label>
              <input
                type="number"
                name="serie"
                value={formData.serie}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                min="1"
                max="9"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Turma *
              </label>
              <input
                type="text"
                name="turma_letra"
                value={formData.turma_letra}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                maxLength={1}
                placeholder="A"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Período *
            </label>
            <select
              name="periodo"
              value={formData.periodo}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              {PERIODOS_TURMA.map(periodo => (
                <option key={periodo.value} value={periodo.value}>
                  {periodo.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Professor Responsável *
            </label>
            <select
              name="professor_responsavel"
              value={formData.professor_responsavel}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Selecione...</option>
              {professores.map(professor => (
                <option key={professor.id} value={professor.id}>
                  {professor.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Criando...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Criar
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};