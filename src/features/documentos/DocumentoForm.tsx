import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Loader2, Save, Wand2 } from 'lucide-react';
import type { Aluno, DocumentoPayload, TipoDocumento } from '../../types';
import { createDocumento, gerarTextoModelo, getDocumento, updateDocumento } from '../../api/documentoService';
import { getAlunos } from '../../api/alunoService';
import { FormInput } from '../../components/common/Form/FormInput';
import { FormSelect } from '../../components/common/Form/FormSelect';
import { FormSection } from '../../components/common/Form/FormSection';
import { useForm } from '../../hooks/useForm';
import { TIPOS_DOCUMENTO, ehTipo } from './tipos';

const hoje = () => new Date().toLocaleDateString('sv-SE'); // AAAA-MM-DD no fuso local

const validar = (v: DocumentoPayload) => {
  const erros: Record<string, string> = {};
  if (!v.aluno) erros.aluno = 'Escolha o aluno.';
  if (!v.data_emissao) erros.data_emissao = 'Informe a data de emissão.';
  if (!v.conteudo.trim()) erros.conteudo = 'Escreva o conteúdo ou gere o texto-modelo.';
  return erros;
};

export const DocumentoForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [params] = useSearchParams();
  const isEditing = !!id;

  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [busca, setBusca] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [falhaAoCarregar, setFalhaAoCarregar] = useState(false);
  const [gerando, setGerando] = useState(false);

  const tipoInicial = params.get('tipo');
  const { values, setValues, errors, setErrors, loading, handleChange, handleSubmit } = useForm<DocumentoPayload>({
    initialValues: {
      aluno: Number(params.get('aluno')) || 0, // ?aluno=<id>&tipo=declaracao: vindo da ficha ou da matrícula
      tipo: ehTipo(tipoInicial) ? tipoInicial : 'declaracao',
      data_emissao: hoje(),
      conteudo: '',
    },
    validate: validar,
    onSubmit: async (dados) => {
      const salvo = isEditing && id ? await updateDocumento(Number(id), dados) : await createDocumento(dados);
      navigate(`/documentos/${salvo.id}`);
    },
  });

  useEffect(() => {
    const carregar = async () => {
      try {
        const [lista, documento] = await Promise.all([
          getAlunos(),
          isEditing && id ? getDocumento(Number(id)) : Promise.resolve(null),
        ]);
        setAlunos(lista);
        if (documento) {
          setValues({ aluno: documento.aluno, tipo: documento.tipo, data_emissao: documento.data_emissao, conteudo: documento.conteudo });
        }
      } catch (err) {
        console.error(err);
        setFalhaAoCarregar(true);
        setErrors({ general: 'Não foi possível carregar os dados do documento.' });
      } finally {
        setCarregando(false);
      }
    };
    carregar();
  }, [id, isEditing, setValues, setErrors]);

  const gerarModelo = async () => {
    if (!values.aluno) {
      setErrors({ aluno: 'Escolha o aluno antes de gerar o texto.' });
      return;
    }
    if (values.conteudo.trim() && !window.confirm('Substituir o texto atual pelo texto-modelo?')) return;
    setGerando(true);
    try {
      handleChange('conteudo', await gerarTextoModelo(values.aluno, values.tipo, values.data_emissao));
    } catch (err) {
      console.error(err);
      setErrors({ general: 'Não foi possível gerar o texto-modelo.' });
    } finally {
      setGerando(false);
    }
  };

  const voltar = () => navigate(isEditing ? `/documentos/${id}` : '/documentos');

  if (carregando) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-blue-500" size={48} />
      </div>
    );
  }

  const termo = busca.trim().toLowerCase();
  const alunosVisiveis = alunos.filter((a) => a.id === values.aluno || !termo || a.nome_completo.toLowerCase().includes(termo));
  const erroGeral = errors.general || errors.detail;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      <div className="flex items-center gap-3 sm:gap-4 mb-6 pb-4 border-b border-slate-200">
        <button type="button" onClick={voltar} className="p-2 hover:bg-slate-100 rounded-lg transition-colors" aria-label="Voltar">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800">{isEditing ? 'Editar documento' : 'Emitir documento'}</h2>
      </div>

      {erroGeral && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700" role="alert">
          <AlertCircle size={20} className="shrink-0" />
          <span>{erroGeral}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <fieldset disabled={falhaAoCarregar || loading} className="space-y-6">
          <FormSection title="Documento">
            {!isEditing && (
              <div className="md:col-span-2">
                <FormInput label="Buscar aluno" value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Digite parte do nome" autoComplete="off" />
              </div>
            )}
            <div className="md:col-span-2">
              <FormSelect
                label="Aluno"
                required
                value={values.aluno || ''}
                onChange={(e) => handleChange('aluno', Number(e.target.value))}
                options={alunosVisiveis.map((a) => ({ value: a.id, label: a.nome_completo }))}
                error={errors.aluno}
                disabled={isEditing}
              />
            </div>
            <FormSelect
              label="Tipo"
              required
              value={values.tipo}
              onChange={(e) => handleChange('tipo', e.target.value as TipoDocumento)}
              options={TIPOS_DOCUMENTO}
              error={errors.tipo}
            />
            <FormInput
              label="Data de emissão"
              type="date"
              required
              value={values.data_emissao}
              onChange={(e) => handleChange('data_emissao', e.target.value)}
              error={errors.data_emissao}
            />
          </FormSection>

          <section className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <label htmlFor="conteudo" className="text-lg font-semibold text-slate-700">Conteúdo</label>
              <button
                type="button"
                onClick={gerarModelo}
                disabled={gerando}
                className="flex items-center justify-center gap-2 min-h-11 px-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 text-sm disabled:opacity-50"
              >
                {gerando ? <Loader2 size={16} className="animate-spin" /> : <Wand2 size={16} />}
                Gerar texto-modelo
              </button>
            </div>
            <textarea
              id="conteudo"
              value={values.conteudo}
              onChange={(e) => handleChange('conteudo', e.target.value)}
              rows={10}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 leading-relaxed ${
                errors.conteudo ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-blue-500'
              }`}
              placeholder="Escreva o texto ou use “Gerar texto-modelo” para preenchê-lo com os dados do aluno."
            />
            {errors.conteudo && <p className="text-red-500 text-xs">{errors.conteudo}</p>}
            <p className="text-xs text-slate-500">
              O texto-modelo é genérico, de demonstração. Revise antes de emitir; numa escola real, a redação deve seguir as normas da Secretaria de Educação.
            </p>
          </section>
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
            {loading ? 'Salvando...' : isEditing ? 'Salvar alterações' : 'Emitir documento'}
          </button>
        </div>
      </form>
    </div>
  );
};
