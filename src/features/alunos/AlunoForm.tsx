import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { getAlunoById, createAluno, updateAluno } from '../../api/alunoService';
import { getTurmas } from '../../api/turmaService';
import type { Aluno, Turma } from '../../types';
import { ArrowLeft, Save, Loader2, AlertCircle } from 'lucide-react';
import { maskCPF, unmaskCPF, maskRG, unmaskRG } from '../../utils/maskUtils';
import { validateAlunoForm } from '../../utils/validations';
import { useForm } from '../../hooks/useForm';
import { FormInput } from '../../components/common/Form/FormInput';
import { FormSelect } from '../../components/common/Form/FormSelect';
import { FormSection } from '../../components/common/Form/FormSection';
import { FormPhone } from '../../components/common/Form/FormPhone';

export const AlunoForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  
  // Estados para máscaras de CPF e RG
  const [displayCPF, setDisplayCPF] = useState('');
  const [displayRG, setDisplayRG] = useState('');

  // Recupera dados salvos do estado de navegação
  const savedFormData = location.state?.formData;
  const turmaRecemCriada = location.state?.novaTurmaId;

  const { values, setValues, errors, setErrors, loading, handleChange, handleSubmit } = useForm<Partial<Aluno>>({
    initialValues: savedFormData || {
      nome_completo: '',
      data_nascimento: '',
      cpf: '',
      rg: '',
      orgao_expedidor: '',
      endereco: '',
      telefone_contato: '',
      email: '',
      nome_pai: '',
      nome_mae: '',
      nome_responsavel: '',
      turma: 0,
    },
    onSubmit: async (data) => {
      if (isEditing && id) {
        await updateAluno(Number(id), data);
      } else {
        await createAluno(data);
      }
      navigate('/alunos');
    },
    validate: validateAlunoForm,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const turmasData = await getTurmas();
        setTurmas(turmasData);

        // Se voltou de criar turma, seleciona automaticamente
        if (turmaRecemCriada) {
          handleChange('turma', turmaRecemCriada);
        }

        if (isEditing && id && !savedFormData) {
          const alunoData = await getAlunoById(Number(id));
          setValues(alunoData);
          
          if (alunoData.cpf) setDisplayCPF(maskCPF(alunoData.cpf));
          if (alunoData.rg) setDisplayRG(maskRG(alunoData.rg));
        } else if (savedFormData) {
          // Restaura as máscaras dos dados salvos
          if (savedFormData.cpf) setDisplayCPF(maskCPF(savedFormData.cpf));
          if (savedFormData.rg) setDisplayRG(maskRG(savedFormData.rg));
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setErrors({ general: 'Erro ao carregar dados. Tente novamente.' });
      } finally {
        setInitialLoading(false);
      }
    };

    fetchData();
  }, [id, isEditing, turmaRecemCriada]);

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = maskCPF(e.target.value);
    setDisplayCPF(maskedValue);
    handleChange('cpf', unmaskCPF(maskedValue));
  };

  const handleRGChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = maskRG(e.target.value);
    setDisplayRG(maskedValue);
    handleChange('rg', unmaskRG(maskedValue));
  };

  const handleNovaTurmaClick = () => {
    // Salva o estado atual do formulário antes de navegar
    navigate('/turmas/nova', {
      state: {
        returnTo: isEditing ? `/alunos/${id}` : '/alunos/novo',
        formData: values,
        context: 'aluno'
      }
    });
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-blue-500" size={48} />
      </div>
    );
  }

  const turmaOptions = turmas.map(t => ({ value: t.id, label: t.nome }));

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6 pb-4 border-b border-slate-200">
        <button
          onClick={() => navigate('/alunos')}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Voltar"
        >
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-2xl font-bold text-slate-800">
          {isEditing ? 'Editar Aluno' : 'Novo Aluno'}
        </h2>
      </div>

      {/* Mensagem de sucesso ao criar turma */}
      {turmaRecemCriada && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
          <AlertCircle size={20} />
          <span>Turma criada com sucesso e selecionada!</span>
        </div>
      )}

      {/* Erro Geral */}
      {errors.general && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
          <AlertCircle size={20} />
          <span>{errors.general}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Dados Pessoais */}
        <FormSection title="Dados Pessoais">
          <div className="md:col-span-2">
            <FormInput
              label="Nome Completo"
              required
              value={values.nome_completo}
              onChange={(e) => handleChange('nome_completo', e.target.value)}
              error={errors.nome_completo}
              maxLength={100}
              autoComplete="name"
            />
          </div>

          <FormInput
            label="Data de Nascimento"
            type="date"
            required
            value={values.data_nascimento}
            onChange={(e) => handleChange('data_nascimento', e.target.value)}
            error={errors.data_nascimento}
            max={new Date().toISOString().split('T')[0]}
            autoComplete="bday"
          />

          <FormInput
            label="CPF"
            value={displayCPF}
            onChange={handleCPFChange}
            error={errors.cpf}
            placeholder="000.000.000-00"
            maxLength={14}
            autoComplete="off"
          />

          <FormInput
            label="RG"
            value={displayRG}
            onChange={handleRGChange}
            error={errors.rg}
            placeholder="0.000.000"
            maxLength={9}
            autoComplete="off"
          />

          <FormInput
            label="Órgão Expedidor"
            required
            value={values.orgao_expedidor}
            onChange={(e) => handleChange('orgao_expedidor', e.target.value)}
            maxLength={20}
            autoComplete="off"
          />

          <FormSelect
            label="Turma"
            required
            value={values.turma}
            onChange={(e) => handleChange('turma', Number(e.target.value))}
            options={turmaOptions}
            error={errors.turma}
            onAddNew={handleNovaTurmaClick}
            addNewLabel="Nova Turma"
          />
        </FormSection>

        {/* Endereço e Contato */}
        <FormSection title="Endereço e Contato">
          <div className="md:col-span-2">
            <FormInput
              label="Endereço"
              required
              value={values.endereco}
              onChange={(e) => handleChange('endereco', e.target.value)}
              error={errors.endereco}
              maxLength={200}
              autoComplete="street-address"
            />
          </div>

          <FormPhone
            label="Telefone"
            required
            value={values.telefone_contato}
            onChange={(value) => handleChange('telefone_contato', value)}
            error={errors.telefone_contato}
          />

          <FormInput
            label="Email"
            type="email"
            value={values.email || ''}
            onChange={(e) => handleChange('email', e.target.value)}
            error={errors.email}
            maxLength={254}
            autoComplete="email"
          />
        </FormSection>

        {/* Informações Familiares */}
        <FormSection title="Informações Familiares">
          <FormInput
            label="Nome do Pai"
            value={values.nome_pai || ''}
            onChange={(e) => handleChange('nome_pai', e.target.value)}
            maxLength={100}
            autoComplete="off"
          />

          <FormInput
            label="Nome da Mãe"
            value={values.nome_mae || ''}
            onChange={(e) => handleChange('nome_mae', e.target.value)}
            maxLength={100}
            autoComplete="off"
          />

          <div className="md:col-span-2">
            <FormInput
              label="Nome do Responsável"
              value={values.nome_responsavel || ''}
              onChange={(e) => handleChange('nome_responsavel', e.target.value)}
              maxLength={100}
              autoComplete="off"
            />
          </div>
        </FormSection>

        {/* Botões */}
        <div className="flex gap-4 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={() => navigate('/alunos')}
            className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
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
                {isEditing ? 'Atualizar' : 'Cadastrar'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};