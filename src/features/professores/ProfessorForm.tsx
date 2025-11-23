import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProfessorById, createProfessor, updateProfessor } from '../../api/professorService';
import type { Professor } from '../../types';
import { ArrowLeft, Save, Loader2, AlertCircle } from 'lucide-react';
import { maskCPF, unmaskCPF } from '../../utils/maskUtils';
import { validateProfessorForm } from '../../utils/validations';
import { useForm } from '../../hooks/useForm';
import { FormInput } from '../../components/common/Form/FormInput';
import { FormSection } from '../../components/common/Form/FormSection';
import { FormPhone } from '../../components/common/Form/FormPhone';

export const ProfessorForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  const [initialLoading, setInitialLoading] = useState(true);
  const [displayCPF, setDisplayCPF] = useState('');

  const { values, setValues, errors, setErrors, loading, handleChange, handleSubmit } = useForm<Partial<Professor>>({
    initialValues: {
      nome: '',
      cpf: '',
      email: '',
      telefone_contato: '',
      data_admissao: '',
      disciplinas: [],
    },
    onSubmit: async (data) => {
      if (isEditing && id) {
        await updateProfessor(Number(id), data);
      } else {
        await createProfessor(data);
      }
      navigate('/professores');
    },
    validate: validateProfessorForm,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isEditing && id) {
          const professorData = await getProfessorById(Number(id));
          setValues(professorData);
          
          if (professorData.cpf) {
            setDisplayCPF(maskCPF(professorData.cpf));
          }
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setErrors({ general: 'Erro ao carregar dados. Tente novamente.' });
      } finally {
        setInitialLoading(false);
      }
    };

    fetchData();
  }, [id, isEditing]);

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = maskCPF(e.target.value);
    setDisplayCPF(maskedValue);
    handleChange('cpf', unmaskCPF(maskedValue));
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-blue-500" size={48} />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6 pb-4 border-b border-slate-200">
        <button
          onClick={() => navigate('/professores')}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Voltar"
        >
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-2xl font-bold text-slate-800">
          {isEditing ? 'Editar Professor' : 'Novo Professor'}
        </h2>
      </div>

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
              value={values.nome}
              onChange={(e) => handleChange('nome', e.target.value)}
              error={errors.nome}
              maxLength={100}
              autoComplete="name"
            />
          </div>

          <FormInput
            label="CPF"
            required
            value={displayCPF}
            onChange={handleCPFChange}
            error={errors.cpf}
            placeholder="000.000.000-00"
            maxLength={14}
            autoComplete="off"
          />

          <FormInput
            label="Data de Admissão"
            type="date"
            required
            value={values.data_admissao}
            onChange={(e) => handleChange('data_admissao', e.target.value)}
            error={errors.data_admissao}
            max={new Date().toISOString().split('T')[0]}
            autoComplete="off"
          />
        </FormSection>

        {/* Contato */}
        <FormSection title="Informações de Contato">
          <FormInput
            label="Email"
            type="email"
            required
            value={values.email}
            onChange={(e) => handleChange('email', e.target.value)}
            error={errors.email}
            maxLength={254}
            autoComplete="email"
          />

          <FormPhone
            label="Telefone"
            required
            value={values.telefone_contato}
            onChange={(value) => handleChange('telefone_contato', value)}
            error={errors.telefone_contato}
          />
        </FormSection>

        {/* Botões */}
        <div className="flex gap-4 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={() => navigate('/professores')}
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