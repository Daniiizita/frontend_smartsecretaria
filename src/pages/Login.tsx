import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios, { isAxiosError } from 'axios';
import { GraduationCap, Loader2, School, Users } from 'lucide-react';
import { login } from '../api/authService';
import { config } from '../config/env';
import { useUsuario } from '../auth/useUsuario';

// Contas públicas da demonstração (a senha vem de VITE_DEMO_PASSWORD).
const CONTAS_DEMO = [
  { username: 'secretaria_demo', rotulo: 'Secretaria', descricao: 'Administra a escola e as contas de acesso', icon: School },
  { username: 'professor_demo', rotulo: 'Professor', descricao: 'Vê suas turmas e os dados pedagógicos dos alunos', icon: GraduationCap },
  { username: 'responsavel_demo', rotulo: 'Responsável', descricao: 'Acompanha os filhos: turma, matrícula e documentos', icon: Users },
];

const AVISO_SERVIDOR_LENTO_MS = 3000;

const mensagemDeErro = (err: unknown) => {
  if (isAxiosError(err)) {
    if (err.response?.status === 401) return 'Usuário/email ou senha inválidos. Por favor, tente novamente.';
    if (err.response?.status === 429) return 'Muitas tentativas de login. Aguarde um minuto e tente novamente.';
    if (!err.response) return 'Não foi possível falar com o servidor. Verifique sua conexão e tente novamente.';
  }
  return 'Não foi possível entrar agora. Tente novamente em instantes.';
};

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { recarregar } = useUsuario();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [servidorLento, setServidorLento] = useState(false);
  const temporizador = useRef<number | undefined>(undefined);

  const demoDisponivel = config.demo.ativo && !!config.demo.senha;

  const avisarSeDemorar = () => {
    window.clearTimeout(temporizador.current);
    temporizador.current = window.setTimeout(() => setServidorLento(true), AVISO_SERVIDOR_LENTO_MS);
  };
  const pararAviso = () => {
    window.clearTimeout(temporizador.current);
    setServidorLento(false);
  };

  // Na demo, "acorda" o servidor gratuito assim que a página abre.
  useEffect(() => {
    if (!config.demo.ativo) return;
    const aviso = window.setTimeout(() => setServidorLento(true), AVISO_SERVIDOR_LENTO_MS);
    axios
      .get(`${config.api.baseUrl}/saude/`, { timeout: config.api.timeout })
      .catch(() => undefined)
      .finally(() => {
        window.clearTimeout(aviso);
        setServidorLento(false);
      });
    return () => window.clearTimeout(aviso);
  }, []);

  const entrar = async (usuario: string, senha: string) => {
    setLoading(true);
    setError(null);
    avisarSeDemorar();
    try {
      const data = await login({ username: usuario, password: senha });
      localStorage.setItem(config.storage.accessToken, data.access);
      localStorage.setItem(config.storage.refreshToken, data.refresh);
      localStorage.setItem(config.storage.isAuthenticated, 'true');
      await recarregar();
      navigate('/dashboard');
    } catch (err) {
      console.error('Falha no login:', err);
      setError(mensagemDeErro(err));
      localStorage.clear();
    } finally {
      pararAviso();
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    entrar(username, password);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 p-4">
      <div className="p-6 sm:p-8 bg-white rounded-lg shadow-md w-full max-w-sm">
        <h1 className="text-3xl font-bold mb-6 text-center text-slate-800">
          {config.app.name}
        </h1>

        {config.validation.devMode && (
          <div className="mb-4 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-700">
            🔧 Modo de desenvolvimento ativo
          </div>
        )}

        {demoDisponivel && (
          <section className="mb-6" aria-labelledby="titulo-demo">
            <h2 id="titulo-demo" className="text-sm font-semibold text-slate-700">
              Demonstração com dados fictícios
            </h2>
            <p className="text-xs text-slate-500 mb-3">
              Escolha um perfil para explorar. Os dados são reiniciados periodicamente.
            </p>
            <div className="space-y-2">
              {CONTAS_DEMO.map(({ username: conta, rotulo, descricao, icon: Icon }) => (
                <button
                  key={conta}
                  type="button"
                  onClick={() => entrar(conta, config.demo.senha)}
                  disabled={loading}
                  className="w-full flex items-center gap-3 text-left px-3 py-2 border border-slate-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors disabled:opacity-50"
                >
                  <Icon size={20} className="text-blue-600 shrink-0" />
                  <span>
                    <span className="block text-sm font-medium text-slate-800">Entrar como {rotulo}</span>
                    <span className="block text-xs text-slate-500">{descricao}</span>
                  </span>
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3 my-5 text-xs text-slate-400">
              <span className="flex-1 border-t border-slate-200" />
              ou entre com sua conta
              <span className="flex-1 border-t border-slate-200" />
            </div>
          </section>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-slate-700 text-sm font-bold mb-2" htmlFor="username">
              Usuário ou email
            </label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-slate-700 text-sm font-bold mb-2" htmlFor="password">
              Senha
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm mb-4" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading && <Loader2 className="animate-spin" size={18} />}
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        {servidorLento && (
          <p className="mt-4 text-xs text-slate-500 text-center" role="status">
            Acordando o servidor gratuito da demonstração… o primeiro acesso pode levar até 1 minuto.
          </p>
        )}

        <div className="mt-4 text-center text-xs text-slate-500">
          v{config.app.version}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
