import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { config } from '../config/env';

const apiClient = axios.create({
  baseURL: config.api.baseUrl,
  timeout: config.api.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de requisição
apiClient.interceptors.request.use(
  (requestConfig) => {
    const token = localStorage.getItem(config.storage.accessToken);
    if (token) {
      requestConfig.headers.Authorization = `Bearer ${token}`;
    }

    // Log em desenvolvimento
    if (config.isDevelopment) {
      console.log('📤 Request:', {
        method: requestConfig.method?.toUpperCase(),
        url: requestConfig.url,
      });
    }

    return requestConfig;
  },
  (error) => {
    if (config.isDevelopment) {
      console.error('❌ Request Error:', error);
    }
    return Promise.reject(error);
  }
);

/*
 * Renovação do token de acesso.
 * O backend gira o refresh token a cada uso e invalida o anterior (blacklist), então:
 *  - o NOVO refresh token precisa ser guardado;
 *  - requisições que falham ao mesmo tempo esperam uma única renovação.
 */
let renovacaoEmAndamento: Promise<string> | null = null;

const renovarToken = async (): Promise<string> => {
  const refreshToken = localStorage.getItem(config.storage.refreshToken);
  if (!refreshToken) {
    throw new Error('Sem refresh token disponível');
  }
  const response = await axios.post<{ access: string; refresh?: string }>(
    `${config.api.baseUrl}/token/refresh/`,
    { refresh: refreshToken },
    { timeout: config.api.timeout }
  );
  localStorage.setItem(config.storage.accessToken, response.data.access);
  if (response.data.refresh) {
    localStorage.setItem(config.storage.refreshToken, response.data.refresh);
  }
  return response.data.access;
};

const ROTAS_DE_TOKEN = ['/token/', '/token/refresh/', '/token/blacklist/'];

apiClient.interceptors.response.use(
  (response) => {
    if (config.isDevelopment) {
      console.log('📥 Response:', { status: response.status, url: response.config.url });
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;

    if (config.isDevelopment) {
      console.error('❌ Response Error:', {
        status: error.response?.status,
        url: originalRequest?.url,
        message: error.message,
      });
    }

    const ehRotaDeToken = ROTAS_DE_TOKEN.includes(originalRequest?.url ?? '');
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry && !ehRotaDeToken) {
      originalRequest._retry = true;
      try {
        renovacaoEmAndamento ??= renovarToken().finally(() => {
          renovacaoEmAndamento = null;
        });
        const access = await renovacaoEmAndamento;
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Sessão expirada: limpa e volta ao login.
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
