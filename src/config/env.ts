/**
 * Configurações centralizadas do ambiente
 * Todas as variáveis de ambiente são acessadas aqui
 */

const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = import.meta.env[key];
  if (value === undefined && defaultValue === undefined) {
    console.warn(`Variável de ambiente ${key} não definida`);
  }
  return value || defaultValue || '';
};

const getBooleanEnv = (key: string, defaultValue: boolean = false): boolean => {
  const value = import.meta.env[key];
  if (value === undefined) return defaultValue;
  return value === 'true' || value === '1';
};

const getNumberEnv = (key: string, defaultValue: number): number => {
  const value = import.meta.env[key];
  if (value === undefined) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
};

export const config = {
  // Modo de desenvolvimento
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  
  // Configurações do aplicativo
  app: {
    name: getEnvVar('VITE_APP_NAME', 'SmartSecretaria'),
    version: getEnvVar('VITE_APP_VERSION', '1.0.0'),
  },
  
  // Configurações da API
  api: {
    baseUrl: getEnvVar('VITE_API_BASE_URL', 'http://127.0.0.1:8000/api'),
    // Folga para o servidor gratuito "acordar" (pode levar até ~1 minuto).
    timeout: getNumberEnv('VITE_API_TIMEOUT', 60000),
  },
  
  // Demonstração pública (portfólio): botões de acesso rápido e aviso de dados fictícios.
  demo: {
    ativo: getBooleanEnv('VITE_DEMO_MODE', false),
    // Senha pública das contas de demo (a mesma DEMO_PASSWORD do backend).
    senha: getEnvVar('VITE_DEMO_PASSWORD', ''),
  },

  // Configurações de validação
  validation: {
    devMode: getBooleanEnv('VITE_DEV_MODE', true),
    // Dados fictícios da demo não têm CPF/RG válidos: validação só de formato.
    flexivel: getBooleanEnv('VITE_DEV_MODE', true) || getBooleanEnv('VITE_DEMO_MODE', false),
    strictCPF: !getBooleanEnv('VITE_DEV_MODE', true), // Inverso do dev mode
    strictRG: !getBooleanEnv('VITE_DEV_MODE', true),
  },
  
  // Storage keys (para evitar strings mágicas)
  storage: {
    accessToken: 'accessToken',
    refreshToken: 'refreshToken',
    isAuthenticated: 'isAuthenticated',
  },
} as const;

// Validação de configurações críticas ao iniciar
if (!config.api.baseUrl) {
  console.error('❌ VITE_API_BASE_URL não está configurada!');
}

// Log de configurações no modo desenvolvimento
if (config.isDevelopment) {
  console.log('🔧 Configurações do ambiente:', {
    mode: import.meta.env.MODE,
    apiBaseUrl: config.api.baseUrl,
    devMode: config.validation.devMode,
  });
}