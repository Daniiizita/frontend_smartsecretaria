import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Loader2, Save } from 'lucide-react';
import type { Aluno, MatriculaPayload, StatusMatricula, Turma } from '../../types';
import { createMatricula, getMatricula, updateMatricula } from '../../api/matriculaService';
import { getAlunos } from '../../api/alunoService';
import { getTurmas } from '../../api/turmaService';
import { FormInput } from '../../components/common/Form/FormInput';
import { FormSelect } from '../../components/common/Form/FormSelect';
import { FormSection } from '../../components/common/Form/FormSection';
import { useForm } from '../../hooks/useForm';
import { ORDEM_STATUS, STATUS } from './status';

const hoje = () => new Date().toLocaleDateString('sv-SE'); // AAAA-MM-DD no fuso local

const validar = (v: MatriculaPayload) => {
  const erros: Record<string, string> = {};
  if (!v.aluno) erros.aluno = 'Escolha o aluno.';
  if (!v.ano_letivo || v.ano_letivo < 2000 || v.ano_letivo > 2100) erros.ano_letivo = 'Ano letivo inválido.';
  if (!v.turma) erros.turma = 'Escolha a turma.';
  if (!v.data_matricula) erros.data_matricula = 'Informe a data da matrícula.';
  return erros;
};

export const MatriculaForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [params] = useSearchParams();
  const isEditing = !!id;

  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [busca, setBusca] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [falhaAoCarregar, setFalhaAoCarregar] = useState(false);

  const { values, setValues, errors, setErrors, loading, handleChange, handleSubmit } = useForm<MatriculaPayload>({
    initialValues: {
      aluno: Number(params.get('aluno')) || 0, // ?aluno=<id>: vindo da ficha do aluno
      turma: 0,
      ano_letivo: new Date().getFullYear(),
      data_matricula: hoje(),
      status: 'ativo',
    },
    validate: validar,
    onSubmit: async (dados) => {
      const salva = isEditing && id ? await updateMatricula(Number(id), dados) : await createMatricula(dados);
      navigate(`/matriculas/${salva.id}`);
    },
  });

  useEffect(() => {
    const carregar = async () => {
      try {
        const [listaAlunos, listaTurmas, matricula] = await Promise.all([
          getAlunos(),
          getTurmas(),
          isEditing && id ? getMatricula(Number(id)) : Promise.resolve(null),
        ]);
        setAlunos(listaAlunos);
        setTurmas(listaTurmas);
        if (matricula) {
          setValues({
            aluno: matricula.aluno,
            turma: matricula.turma,
            ano_letivo: matricula.ano_letivo,
            data_matricula: matricula.data_matricula,
            status: matricula.status,
          });
        }
      } catch (err) {
        console.error(err);
        setFalhaAoCarregar(true);
        setErrors({ general: 'Não foi possível carregar os dados da matrícula.' });
      } finally {
        setCarregando(false);
      }
    };
    carregar();
  }, [id, isEditing, setValues, setErrors]);

  // Sugere a turma atual do aluno quando ela é do ano letivo escolhido.
  const escolherAluno = (alunoId: number) => {
    handleChange('aluno', alunoId);
    const atual = alunos.find((a) => a.id === alunoId)?.turma;
    const turmaAtual = turmas.find((t) => t.id === atual);
    if (!values.turma && turmaAtual && turmaAtual.ano === values.ano_letivo) handleChange('turma', turmaAtual.id);
  };

  const voltar = () => navigate(isEditing ? `/matriculas/${id}` : '/matriculas');

  if (carregando) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-blue-500" size={48} />
      </div>
    );
  }

  const termo = busca.trim().toLowerCase();
  const alunosVisiveis = alunos.filter((a) => a.id === values.aluno || !termo || a.nome_completo.toLowerCase().includes(termo));
  const turmasDoAno = turmas.filter((t) => t.ano === values.ano_letivo);
  const erroGeral = errors.general || errors.detail || errors.non_field_errors;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      <div className="flex items-center gap-3 sm:gap-4 mb-6 pb-4 border-b border-slate-200">
        <button type="button" onClick={voltar} className="p-2 hover:bg-slate-100 rounded-lg transition-colors" aria-label="Voltar">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800">{isEditing ? 'Editar matrícula' : 'Nova matrícula'}</h2>
      </div>

      {erroGeral && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700" role="alert">
          <AlertCircle size={20} className="shrink-0" />
          <span>{erroGeral}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <fieldset disabled={falhaAoCarregar || loading} className="space-y-6">
          <FormSection title="Aluno">
            {!isEditing && (
              <div className="md:col-span-2">
                <FormInput
                  label="Buscar aluno"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder="Digite parte do nome"
                  autoComplete="off"
                />
              </div>
            )}
            <div className="md:col-span-2">
              <FormSelect
                label="Aluno"
                required
                value={values.aluno || ''}
                onChange={(e) => escolherAluno(Number(e.target.value))}
                options={alunosVisiveis.map((a) => ({ value: a.id, label: a.nome_completo }))}
                error={errors.aluno}
                disabled={isEditing}
              />
            </div>
          </FormSection>

          <FormSection title="Turma e período">
            <FormInput
              label="Ano letivo"
              type="number"
              inputMode="numeric"
              required
              value={values.ano_letivo}
              onChange={(e) => {
                handleChange('ano_letivo', Number(e.target.value));
                handleChange('turma', 0);
              }}
              error={errors.ano_letivo}
              min={2000}
              max={2100}
            />
            <FormInput
              label="Data da matrícula"
              type="date"
              required
              value={values.data_matricula}
              onChange={(e) => handleChange('data_matricula', e.target.value)}
              error={errors.data_matricula}
            />
            <div className="md:col-span-2">
              <FormSelect
                label="Turma"
                required
                value={values.turma || ''}
                onChange={(e) => handleChange('turma', Number(e.target.value))}
                options={turmasDoAno.map((t) => ({ value: t.id, label: t.nome }))}
                error={errors.turma}
              />
              {turmasDoAno.length === 0 && (
                <p className="text-xs text-amber-700 mt-1">Nenhuma turma cadastrada para {values.ano_letivo}.</p>
              )}
            </div>
            <FormSelect
              label="Situação"
              required
              value={values.status}
              onChange={(e) => handleChange('status', e.target.value as StatusMatricula)}
              options={ORDEM_STATUS.map((s) => ({ value: s, label: STATUS[s].label }))}
              error={errors.status}
            />
          </FormSection>
        </fieldset>

        <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-slate-200">
          <button type="button" onClick={voltar} disabled={loading} className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading || falhaAoCarregar}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            {loading ? 'Salvando...' : isEditing ? 'Salvar alterações' : 'Matricular'}
          </button>
        </div>
      </form>
    </div>
  );
};
