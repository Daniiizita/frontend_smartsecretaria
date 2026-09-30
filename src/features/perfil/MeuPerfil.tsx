import React, { useState } from 'react';
import { CheckCircle2, KeyRound, Loader2 } from 'lucide-react';
import { trocarMinhaSenha } from '../../api/usuarioService';
import { TIPO_LABELS, nomeDeExibicao } from '../../auth/papeis';
import { useUsuario } from '../../auth/useUsuario';
import { FormInput } from '../../components/common/Form/FormInput';
import { FormSection } from '../../components/common/Form/FormSection';
import { useForm } from '../../hooks/useForm';

interface SenhaValues {
  senha_atual: string;
  nova_senha: string;
  confirmar: string;
}

const SENHA_VAZIA: SenhaValues = { senha_atual: '', nova_senha: '', confirmar: '' };

const validar = (v: SenhaValues) => {
  const erros: Record<string, string> = {};
  if (!v.senha_atual) erros.senha_atual = 'Informe sua senha atual.';
  if (v.nova_senha.length < 8) erros.nova_senha = 'A nova senha precisa ter pelo menos 8 caracteres.';
  if (v.nova_senha && v.nova_senha === v.senha_atual) {
    erros.nova_senha = 'A nova senha precisa ser diferente da atual.';
  }
  if (v.nova_senha !== v.confirmar) erros.confirmar = 'As senhas não conferem.';
  return erros;
};

const Dado: React.FC<{ rotulo: string; valor: string }> = ({ rotulo, valor }) => (
  <div>
    <dt className="text-sm text-slate-500">{rotulo}</dt>
    <dd className="text-slate-900">{valor || '—'}</dd>
  </div>
);

export const MeuPerfil: React.FC = () => {
  const { usuario } = useUsuario();
  const [sucesso, setSucesso] = useState(false);

  const { values, setValues, errors, loading, handleChange, handleSubmit } = useForm<SenhaValues>({
    initialValues: SENHA_VAZIA,
    validate: validar,
    onSubmit: async (v) => {
      setSucesso(false);
      await trocarMinhaSenha(v.senha_atual, v.nova_senha);
      setValues(SENHA_VAZIA);
      setSucesso(true);
    },
  });

  if (!usuario) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Meu perfil</h1>

      <section className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-slate-700 mb-4">Dados da conta</h2>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Dado rotulo="Nome" valor={nomeDeExibicao(usuario)} />
          <Dado rotulo="Perfil de acesso" valor={TIPO_LABELS[usuario.tipo]} />
          <Dado rotulo="Login" valor={usuario.username} />
          <Dado rotulo="Email" valor={usuario.email} />
        </dl>
        <p className="text-sm text-slate-500 mt-4">
          Para corrigir seus dados ou seu perfil de acesso, fale com a secretaria da escola.
        </p>
      </section>

      <section className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        {sucesso && (
          <div
            className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700"
            role="status"
          >
            <CheckCircle2 size={20} />
            <span>Senha alterada. Use a nova senha no próximo acesso.</span>
          </div>
        )}
        {(errors.general || errors.detail) && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700" role="alert">
            {errors.general || errors.detail}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <FormSection title="Trocar senha">
            <div className="md:col-span-2 md:max-w-md">
              <FormInput
                label="Senha atual"
                type="password"
                required
                value={values.senha_atual}
                onChange={(e) => handleChange('senha_atual', e.target.value)}
                error={errors.senha_atual}
                autoComplete="current-password"
              />
            </div>
            <FormInput
              label="Nova senha"
              type="password"
              required
              value={values.nova_senha}
              onChange={(e) => handleChange('nova_senha', e.target.value)}
              error={errors.nova_senha}
              autoComplete="new-password"
              hint="Mínimo de 8 caracteres; evite senhas comuns ou só com números."
            />
            <FormInput
              label="Confirmar nova senha"
              type="password"
              required
              value={values.confirmar}
              onChange={(e) => handleChange('confirmar', e.target.value)}
              error={errors.confirmar}
              autoComplete="new-password"
            />
          </FormSection>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <KeyRound size={20} />}
            {loading ? 'Salvando...' : 'Trocar senha'}
          </button>
        </form>
      </section>
    </div>
  );
};
