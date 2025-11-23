import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createTurma } from '../../api/turmaService';
import { getProfessores } from '../../api/professorService';
import type { Turma, Professor } from '../../types';
import { ArrowLeft, Save, Loader2, AlertCircle } from 'lucide-react';
import { FormInput } from '../../components/common/Form/FormInput';
import { FormSelect } from '../../components/common/Form/FormSelect';
import { FormSection } from '../../components/common/Form/FormSection';
import { useForm } from '../../hooks/useForm';
import { useTurmaChoices } from '../../hooks/useTurmaChoices';

export const TurmaForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);

  const { choices, loading: loadingChoices, error: choicesError } = useTurmaChoices();

  const returnTo = location.state?.returnTo;
  const formData = location.state?.formData;
  const context = location.state?.context;

  const { values, errors, loading, handleChange, handleSubmit, setValues } = useForm<Partial<Turma>>({
    initialValues: {
      nome: '',
      serie: 1,
      nivel: 'EI',
      turma_letra: 'A',
      ano: new Date().getFullYear(),
      periodo: 'Manhã',
      professor_responsavel: 0,
    },
    onSubmit: async (data) => {
      const novaTurma = await createTurma(data);
      
      if (returnTo && context === 'aluno') {
        navigate(returnTo, {
          state: {
            formData: formData,
            novaTurmaId: novaTurma.id
          }
        });
      } else {
        navigate('/turmas');
      }
    },
  });

  // Função para gerar o nome da turma automaticamente
  const generateTurmaName = () => {
    const serieLabel = choices?.serie.find(s => s.value === values.serie)?.label || '';
    const periodoLabel = values.periodo || '';
    const turmaLetra = values.turma_letra || '';
    
    if (serieLabel && periodoLabel && turmaLetra) {
      // Extrai apenas a parte relevante da série (ex: "1º Ano" de "1º Ano - Ensino Fundamental I")
      const serieShort = serieLabel.split(' - ')[0];
      return `${serieShort} ${turmaLetra} - ${periodoLabel}`;
    }
    return '';
  };

  // Atualiza o nome da turma sempre que os campos relevantes mudarem
  useEffect(() => {
    if (choices && values.serie && values.turma_letra && values.periodo) {
      const novoNome = generateTurmaName();
      if (novoNome !== values.nome) {
        setValues(prev => ({ ...prev, nome: novoNome }));
      }
    }
  }, [values.serie, values.turma_letra, values.periodo, choices]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const professoresData = await getProfessores();
        setProfessores(professoresData);
      } catch (error) {
        console.error('Erro ao carregar professores:', error);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCancel = () => {
    if (returnTo && context === 'aluno') {
      navigate(returnTo, { state: { formData } });
    } else {
      navigate('/turmas');
    }
  };

  if (initialLoading || loadingChoices) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-blue-500" size={48} />
      </div>
    );
  }

  if (choicesError) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {choicesError}
        </div>
      </div>
    );
  }

  const professorOptions = professores.map(p => ({ 
    value: p.id, 
    label: p.nome 
  }));

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6 pb-4 border-b border-slate-200">
        <button
          onClick={handleCancel}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Voltar"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Nova Turma</h2>
          {context === 'aluno' && (
            <p className="text-sm text-slate-500 mt-1">
              Após criar, você retornará ao cadastro de aluno
            </p>
          )}
        </div>
      </div>

      {/* Erro Geral */}
      {errors.general && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
          <AlertCircle size={20} />
          <span>{errors.general}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <FormSection title="Informações da Turma">
          {/* Nome gerado automaticamente - apenas exibição */}
          {values.nome && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Nome da Turma (gerado automaticamente)
              </label>
              <div className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-700 font-medium">
                {values.nome}
              </div>
            </div>
          )}

          <FormSelect
            label="Série/Período"
            required
            value={values.serie}
            onChange={(e) => handleChange('serie', Number(e.target.value))}
            options={choices?.serie || []}
            error={errors.serie}
          />

          <FormSelect
            label="Nível de Ensino"
            required
            value={values.nivel}
            onChange={(e) => handleChange('nivel', e.target.value)}
            options={choices?.nivel || []}
            error={errors.nivel}
          />

          <FormSelect
            label="Turma"
            required
            value={values.turma_letra}
            onChange={(e) => handleChange('turma_letra', e.target.value)}
            options={choices?.turma_letra || []}
            error={errors.turma_letra}
          />

          <FormInput
            label="Ano Letivo"
            type="number"
            required
            value={values.ano}
            onChange={(e) => handleChange('ano', Number(e.target.value))}
            error={errors.ano}
            min={2000}
            max={2100}
          />

          <FormSelect
            label="Período"
            required
            value={values.periodo}
            onChange={(e) => handleChange('periodo', e.target.value)}
            options={choices?.periodo || []}
            error={errors.periodo}
          />

          <FormSelect
            label="Professor Responsável"
            required
            value={values.professor_responsavel}
            onChange={(e) => handleChange('professor_responsavel', Number(e.target.value))}
            options={professorOptions}
            error={errors.professor_responsavel}
          />
        </FormSection>

        {/* Botões */}
        <div className="flex gap-4 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading || !values.nome}
            className="flex items-center gap-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Salvando...
              </>
            ) : (
              <>
                <Save size={20} />
                {context === 'aluno' ? 'Criar e Prosseguir' : 'Criar Turma'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};