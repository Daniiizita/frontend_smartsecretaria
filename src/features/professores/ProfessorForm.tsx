import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProfessorById, createProfessor, updateProfessor } from '../../api/professorService';
import { useDisciplinas } from '../../hooks/useDisciplinas';
import type { Professor } from '../../types';
import { ArrowLeft, Save, Loader2, AlertCircle } from 'lucide-react';
import { maskCPF, unmaskCPF, maskRG, unmaskRG } from '../../utils/maskUtils';
import { validateProfessorForm } from '../../utils/validations';
import { useForm } from '../../hooks/useForm';
import { FormInput } from '../../components/common/Form/FormInput';
import { FormSection } from '../../components/common/Form/FormSection';
import { FormPhone } from '../../components/common/Form/FormPhone';
import { FormImageUpload } from '../../components/common/Form/FormImageUpload';

export const ProfessorForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  const [initialLoading, setInitialLoading] = useState(true);
  const [displayCPF, setDisplayCPF] = useState('');
  const [displayRG, setDisplayRG] = useState('');
  const [fotoFile, setFotoFile] = useState<File | null>(null);

  const { disciplinas, loading: loadingDisciplinas } = useDisciplinas();

  const { values, setValues, errors, setErrors, loading, handleChange, handleSubmit } = useForm<Partial<Professor>>({
    initialValues: {
      nome: '',
      cpf: '',
      rg: '',
      orgao_expedidor: '',
      data_nascimento: '',
      endereco: '',
      telefone_contato: '',
      email: '',
      data_admissao: '',
      naturalidade: '',
      disciplinas: [],
    },
    onSubmit: async (data) => {
      console.log('📤 Dados originais:', data);
      console.log('📷 Foto para enviar:', fotoFile);
      
      // Remove campos que não devem ser enviados no JSON
      const { id: _, foto, ...dataToSend } = data;
      
      console.log('📤 Dados sendo enviados:', dataToSend);
      
      try {
        if (isEditing && id) {
          await updateProfessor(Number(id), dataToSend, fotoFile || undefined);
        } else {
          await createProfessor(dataToSend, fotoFile || undefined);
        }
        navigate('/professores');
      } catch (error: any) {
        console.error('❌ Erro ao salvar:', error);
        console.error('❌ Response data:', error.response?.data);
        
        // Mostra os erros específicos do backend
        if (error.response?.data) {
          const backendErrors = error.response.data;
          const formattedErrors: Record<string, string> = {};
          
          Object.keys(backendErrors).forEach(key => {
            formattedErrors[key] = Array.isArray(backendErrors[key]) 
              ? backendErrors[key].join(', ')
              : backendErrors[key];
          });
          
          setErrors(formattedErrors);
        } else {
          setErrors({ general: 'Erro ao salvar professor. Tente novamente.' });
        }
      }
    },
    validate: validateProfessorForm,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isEditing && id) {
          const professorData = await getProfessorById(Number(id));
          console.log('📥 Dados do professor carregados:', professorData);
          setValues(professorData);
          
          if (professorData.cpf) {
            setDisplayCPF(maskCPF(professorData.cpf));
          }
          if (professorData.rg) {
            setDisplayRG(maskRG(professorData.rg));
          }
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setErrors({ general: 'Erro ao carregar dados do professor. Tente novamente.' });
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

  const handleRGChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = maskRG(e.target.value);
    setDisplayRG(maskedValue);
    handleChange('rg', unmaskRG(maskedValue));
  };

  const handleDisciplinaToggle = (disciplinaId: number) => {
    const currentDisciplinas = values.disciplinas || [];
    const newDisciplinas = currentDisciplinas.includes(disciplinaId)
      ? currentDisciplinas.filter(id => id !== disciplinaId)
      : [...currentDisciplinas, disciplinaId];
    
    handleChange('disciplinas', newDisciplinas);
  };

  const handleFotoChange = (file: File | null) => {
    setFotoFile(file);
  };

  if (initialLoading || loadingDisciplinas) {
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

      {/* Mostrar erros específicos do backend */}
      {Object.keys(errors).length > 0 && !errors.general && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="font-semibold text-red-700 mb-2">Erros de validação:</p>
          <ul className="list-disc list-inside text-red-600 text-sm">
            {Object.entries(errors).map(([field, message]) => (
              <li key={field}>{field}: {message}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Foto do Professor */}
        <FormSection title="Foto do Professor">
          <div className="md:col-span-2">
            <FormImageUpload
              label="Foto do Professor"
              currentImage={values.foto}
              onImageChange={handleFotoChange}
              error={errors.foto}
            />
          </div>
        </FormSection>

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
            label="RG"
            required
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
            error={errors.orgao_expedidor}
            maxLength={20}
            autoComplete="off"
            placeholder="SSP, DETRAN, etc."
          />

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
            label="Naturalidade"
            required
            value={values.naturalidade}
            onChange={(e) => handleChange('naturalidade', e.target.value)}
            error={errors.naturalidade}
            maxLength={100}
            autoComplete="off"
            placeholder="Cidade - UF"
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
            required
            value={values.email}
            onChange={(e) => handleChange('email', e.target.value)}
            error={errors.email}
            maxLength={254}
            autoComplete="email"
          />
        </FormSection>

        {/* Informações Profissionais */}
        <FormSection title="Informações Profissionais">
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

        {/* Disciplinas */}
        <div>
          <h3 className="text-lg font-semibold text-slate-700 mb-4">Disciplinas</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {disciplinas.map((disciplina) => (
              <label
                key={disciplina.id}
                className={`
                  flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors
                  ${(values.disciplinas || []).includes(disciplina.id)
                    ? 'bg-blue-50 border-blue-500'
                    : 'bg-white border-slate-300 hover:bg-slate-50'
                  }
                `}
              >
                <input
                  type="checkbox"
                  checked={(values.disciplinas || []).includes(disciplina.id)}
                  onChange={() => handleDisciplinaToggle(disciplina.id)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">{disciplina.nome}</span>
              </label>
            ))}
          </div>
          {disciplinas.length === 0 && (
            <p className="text-slate-500 text-sm">Nenhuma disciplina cadastrada.</p>
          )}
        </div>

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