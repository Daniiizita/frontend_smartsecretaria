import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Loader2, Save } from 'lucide-react';
import type { TipoUsuario, UsuarioPayload } from '../../types';
import { createUsuario, getUsuarioById, updateUsuario } from '../../api/usuarioService';
import { TIPO_LABELS, tiposGerenciaveis } from '../../auth/papeis';
import { useUsuario } from '../../auth/useUsuario';
import { useForm } from '../../hooks/useForm';
import { FormInput } from '../../components/common/Form/FormInput';
import { FormSection } from '../../components/common/Form/FormSection';
import { FormSelect } from '../../components/common/Form/FormSelect';
import { DESCRICAO_DOS_PERFIS } from './perfis';

interface UsuarioFormValues {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  tipo: TipoUsuario | '';
  is_active: boolean;
  password: string;
  confirmar_senha: string;
}

const VALORES_INICIAIS: UsuarioFormValues = {
  username: '',
  first_name: '',
  last_name: '',
  email: '',
  tipo: '',
  is_active: true,
  password: '',
  confirmar_senha: '',
};

const validar = (criando: boolean) => (values: UsuarioFormValues) => {
  const erros: Record<string, string> = {};
  if (!values.username.trim()) erros.username = 'Informe o login.';
  if (!values.tipo) erros.tipo = 'Escolha o perfil de acesso.';
  if (criando && !values.password) erros.password = 'Defina uma senha inicial.';
  if (values.password && values.password.length < 8) {
    erros.password = 'A senha precisa ter pelo menos 8 caracteres.';
  }
  if (values.password !== values.confirmar_senha) {
    erros.confirmar_senha = 'As senhas não conferem.';
  }
  return erros;
};

export const UsuarioForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const { usuario: logado } = useUsuario();

  const [initialLoading, setInitialLoading] = useState(isEditing);
  const [contaProtegida, setContaProtegida] = useState(false);
  const [falhaAoCarregar, setFalhaAoCarregar] = useState(false);
  const isPropriaConta = isEditing && Number(id) === logado?.id;

  const { values, setValues, errors, setErrors, loading, handleChange, handleSubmit } =
    useForm<UsuarioFormValues>({
      initialValues: VALORES_INICIAIS,
      validate: validar(!isEditing),
      onSubmit: async (data) => {
        const payload: UsuarioPayload = {
          username: data.username.trim(),
          first_name: data.first_name.trim(),
          last_name: data.last_name.trim(),
          email: data.email.trim(),
        };
        if (!isPropriaConta) {
          payload.tipo = data.tipo as TipoUsuario;
          payload.is_active = data.is_active;
        }
        if (data.password) payload.password = data.password;

        if (isEditing && id) {
          await updateUsuario(Number(id), payload);
        } else {
          await createUsuario(payload);
        }
        navigate('/usuarios');
      },
    });

  useEffect(() => {
    if (!isEditing || !id) return;
    const carregar = async () => {
      try {
        const usuario = await getUsuarioById(Number(id));
        setValues({
          username: usuario.username,
          first_name: usuario.first_name,
          last_name: usuario.last_name,
          email: usuario.email,
          tipo: usuario.tipo,
          is_active: usuario.is_active,
          password: '',
          confirmar_senha: '',
        });
        setContaProtegida(usuario.is_superuser && !logado?.is_superuser);
      } catch (err) {
        console.error('Erro ao carregar usuário:', err);
        setFalhaAoCarregar(true);
        setErrors({ general: 'Usuário não encontrado ou fora do seu nível de acesso.' });
      } finally {
        setInitialLoading(false);
      }
    };
    carregar();
  }, [id, isEditing, logado?.is_superuser, setValues, setErrors]);

  // Perfil atual continua na lista mesmo que o usuário logado não possa atribuí-lo.
  const tipos = tiposGerenciaveis(logado);
  const opcoesDePerfil = [...tipos, ...(values.tipo && !tipos.includes(values.tipo) ? [values.tipo] : [])]
    .map((tipo) => ({ value: tipo, label: TIPO_LABELS[tipo] }));

  const erroGeral = errors.general || errors.detail;
  const bloqueado = contaProtegida || falhaAoCarregar;

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-blue-500" size={48} />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      <div className="flex items-center gap-4 mb-6 pb-4 border-b border-slate-200">
        <button
          type="button"
          onClick={() => navigate('/usuarios')}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Voltar"
        >
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
          {isEditing ? 'Editar usuário' : 'Novo usuário'}
        </h2>
      </div>

      {erroGeral && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700" role="alert">
          <AlertCircle size={20} />
          <span>{erroGeral}</span>
        </div>
      )}

      {contaProtegida && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800">
          Esta é uma conta de superusuário e só pode ser alterada por outro superusuário.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <fieldset disabled={bloqueado || loading} className="space-y-8">
          <FormSection title="Dados da conta">
            <FormInput
              label="Login"
              required
              value={values.username}
              onChange={(e) => handleChange('username', e.target.value)}
              error={errors.username}
              maxLength={150}
              autoComplete="off"
              hint="Nome de usuário para entrar no sistema (ex.: maria.silva)."
            />
            <FormInput
              label="Email"
              type="email"
              value={values.email}
              onChange={(e) => handleChange('email', e.target.value)}
              error={errors.email}
              maxLength={254}
              autoComplete="off"
              hint="Também pode ser usado para entrar. Não pode se repetir entre contas."
            />
            <FormInput
              label="Nome"
              value={values.first_name}
              onChange={(e) => handleChange('first_name', e.target.value)}
              error={errors.first_name}
              maxLength={150}
              autoComplete="off"
            />
            <FormInput
              label="Sobrenome"
              value={values.last_name}
              onChange={(e) => handleChange('last_name', e.target.value)}
              error={errors.last_name}
              maxLength={150}
              autoComplete="off"
            />
          </FormSection>

          <FormSection title="Perfil de acesso">
            <div className="md:col-span-2 space-y-2">
              <FormSelect
                label="Nível de permissão"
                required
                value={values.tipo}
                onChange={(e) => handleChange('tipo', e.target.value as TipoUsuario | '')}
                error={errors.tipo}
                options={opcoesDePerfil}
                disabled={isPropriaConta}
              />
              {values.tipo && (
                <p className="text-sm text-slate-600 bg-slate-50 border border-slate-200 rounded-lg p-3">
                  {DESCRICAO_DOS_PERFIS[values.tipo]}
                </p>
              )}
              {isPropriaConta && (
                <p className="text-xs text-slate-500">
                  Você não pode alterar o próprio perfil nem desativar a própria conta.
                </p>
              )}
            </div>

            <label className="md:col-span-2 flex items-center gap-3 min-h-11 text-sm text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={values.is_active}
                onChange={(e) => handleChange('is_active', e.target.checked)}
                disabled={isPropriaConta}
                className="h-5 w-5 shrink-0 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              Conta ativa (contas inativas não conseguem entrar no sistema)
            </label>
          </FormSection>

          <FormSection title={isEditing ? 'Redefinir senha (opcional)' : 'Senha inicial'}>
            <FormInput
              label={isEditing ? 'Nova senha' : 'Senha'}
              type="password"
              required={!isEditing}
              value={values.password}
              onChange={(e) => handleChange('password', e.target.value)}
              error={errors.password}
              autoComplete="new-password"
              hint={
                isEditing
                  ? 'Deixe em branco para manter a senha atual.'
                  : 'Mínimo de 8 caracteres. Oriente a pessoa a trocá-la no primeiro acesso.'
              }
            />
            <FormInput
              label="Confirmar senha"
              type="password"
              required={!isEditing}
              value={values.confirmar_senha}
              onChange={(e) => handleChange('confirmar_senha', e.target.value)}
              error={errors.confirmar_senha}
              autoComplete="new-password"
            />
          </FormSection>
        </fieldset>

        <div className="flex gap-4 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={() => navigate('/usuarios')}
            className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading || bloqueado}
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
                {isEditing ? 'Salvar alterações' : 'Criar usuário'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
