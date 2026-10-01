import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Loader2, Save } from 'lucide-react';
import { createTurma, getTurmaById, updateTurma } from '../../api/turmaService';
import { getProfessores } from '../../api/professorService';
import type { Professor, TurmaPayload } from '../../types';
import { FormInput } from '../../components/common/Form/FormInput';
import { FormSelect } from '../../components/common/Form/FormSelect';
import { FormSection } from '../../components/common/Form/FormSection';
import { useForm } from '../../hooks/useForm';
import { useTurmaChoices } from '../../hooks/useTurmaChoices';
import { validateTurmaForm } from '../../utils/validations';

const VALORES_INICIAIS: TurmaPayload = {
  serie: 0,
  turma_letra: 'A',
  periodo: 'Manhã',
  ano: new Date().getFullYear(),
  horario_aulas: '',
  professor_responsavel: 0,
};

export const TurmaForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  // Criação a partir do cadastro de aluno: volta para ele com a turma nova selecionada.
  const returnTo: string | undefined = location.state?.returnTo;
  const formDataAluno = location.state?.formData;
  const vindoDoAluno = location.state?.context === 'aluno' && !!returnTo;

  const [professores, setProfessores] = useState<Professor[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [falhaAoCarregar, setFalhaAoCarregar] = useState(false);
  const { choices, loading: loadingChoices, error: choicesError } = useTurmaChoices();

  const { values, setValues, errors, setErrors, loading, handleChange, handleSubmit } = useForm<TurmaPayload>({
    initialValues: VALORES_INICIAIS,
    validate: validateTurmaForm,
    onSubmit: async (dados) => {
      const payload = { ...dados, horario_aulas: dados.horario_aulas?.trim() || null };
      if (isEditing && id) {
        await updateTurma(Number(id), payload);
        navigate(`/turmas/${id}`);
        return;
      }
      const nova = await createTurma(payload);
      if (vindoDoAluno && returnTo) {
        navigate(returnTo, { state: { formData: formDataAluno, novaTurmaId: nova.id } });
      } else {
        navigate(`/turmas/${nova.id}`);
      }
    },
  });

  useEffect(() => {
    const carregar = async () => {
      try {
        const [lista, turma] = await Promise.all([
          getProfessores(),
          isEditing && id ? getTurmaById(Number(id)) : Promise.resolve(null),
        ]);
        setProfessores(lista);
        if (turma) {
          setValues({
            serie: turma.serie,
            turma_letra: turma.turma_letra,
            periodo: turma.periodo,
            ano: turma.ano,
            horario_aulas: turma.horario_aulas ?? '',
            professor_responsavel: turma.professor_responsavel,
          });
        }
      } catch (err) {
        console.error('Erro ao carregar dados da turma:', err);
        setFalhaAoCarregar(true);
        setErrors({ general: 'Não foi possível carregar os dados da turma.' });
      } finally {
        setCarregando(false);
      }
    };
    carregar();
  }, [id, isEditing, setValues, setErrors]);

  const voltar = () => {
    if (vindoDoAluno && returnTo) navigate(returnTo, { state: { formData: formDataAluno } });
    else navigate(isEditing ? `/turmas/${id}` : '/turmas');
  };

  if (carregando || loadingChoices) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-blue-500" size={48} />
      </div>
    );
  }
  if (choicesError) {
    return <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{choicesError}</div>;
  }

  // Prévia do nome que o sistema vai gerar (o nome final é calculado pelo backend).
  const serieLabel = choices?.serie.find((s) => s.value === values.serie)?.label;
  const previa = serieLabel
    ? `${serieLabel.split(' - ')[0]} ${values.turma_letra} - ${serieLabel.split(' - ')[1] ?? ''} - ${values.periodo} - ${values.ano}`
    : '';
  const erroGeral = errors.general || errors.detail;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      <div className="flex items-center gap-3 sm:gap-4 mb-6 pb-4 border-b border-slate-200">
        <button
          type="button"
          onClick={voltar}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Voltar"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800">{isEditing ? 'Editar turma' : 'Nova turma'}</h2>
          {vindoDoAluno && (
            <p className="text-sm text-slate-500 mt-1">Depois de criar, você volta ao cadastro do aluno.</p>
          )}
        </div>
      </div>

      {erroGeral && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700" role="alert">
          <AlertCircle size={20} className="shrink-0" />
          <span>{erroGeral}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <fieldset disabled={falhaAoCarregar || loading} className="space-y-6">
          <FormSection title="Identificação">
            <div className="md:col-span-2">
              <FormSelect
                label="Série"
                required
                value={values.serie || ''}
                onChange={(e) => handleChange('serie', Number(e.target.value))}
                options={choices?.serie ?? []}
                error={errors.serie}
              />
            </div>
            <FormSelect
              label="Turma (letra)"
              required
              value={values.turma_letra}
              onChange={(e) => handleChange('turma_letra', e.target.value)}
              options={choices?.turma_letra ?? []}
              error={errors.turma_letra}
            />
            <FormSelect
              label="Período"
              required
              value={values.periodo}
              onChange={(e) => handleChange('periodo', e.target.value)}
              options={choices?.periodo ?? []}
              error={errors.periodo}
            />
            <FormInput
              label="Ano letivo"
              type="number"
              inputMode="numeric"
              required
              value={values.ano}
              onChange={(e) => handleChange('ano', Number(e.target.value))}
              error={errors.ano}
              min={2000}
              max={2100}
            />
            <FormInput
              label="Horário das aulas"
              value={values.horario_aulas ?? ''}
              onChange={(e) => handleChange('horario_aulas', e.target.value)}
              error={errors.horario_aulas}
              maxLength={100}
              placeholder="Ex.: 7h às 11h30"
              hint="Opcional."
            />
            {previa && (
              <div className="md:col-span-2">
                <p className="text-sm font-medium text-slate-700 mb-1">Nome da turma</p>
                <p className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700">{previa}</p>
              </div>
            )}
          </FormSection>

          <FormSection title="Regência">
            <div className="md:col-span-2">
              <FormSelect
                label="Professor regente"
                required
                value={values.professor_responsavel || ''}
                onChange={(e) => handleChange('professor_responsavel', Number(e.target.value))}
                options={professores.map((p) => ({ value: p.id, label: p.nome }))}
                error={errors.professor_responsavel}
              />
              <p className="text-xs text-slate-500 mt-1">
                O regente acompanha a turma. Os professores de cada disciplina são definidos na página da turma.
              </p>
            </div>
          </FormSection>
        </fieldset>

        <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={voltar}
            className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading || falhaAoCarregar}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            {loading ? 'Salvando...' : isEditing ? 'Salvar alterações' : vindoDoAluno ? 'Criar e voltar ao aluno' : 'Criar turma'}
          </button>
        </div>
      </form>
    </div>
  );
};
