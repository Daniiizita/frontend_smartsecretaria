import axios from 'axios';
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
        data: requestConfig.data,
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

// Interceptor de resposta para refresh token
apiClient.interceptors.response.use(
  (response) => {
    // Log em desenvolvimento
    if (config.isDevelopment) {
      console.log('📥 Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }
    
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Log de erro em desenvolvimento
    if (config.isDevelopment) {
      console.error('❌ Response Error:', {
        status: error.response?.status,
        url: error.config?.url,
        message: error.message,
      });
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem(config.storage.refreshToken);
        
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await axios.post(
          `${config.api.baseUrl}/token/refresh/`,
          { refresh: refreshToken },
          { timeout: config.api.timeout }
        );

        const { access } = response.data;
        localStorage.setItem(config.storage.accessToken, access);
        originalRequest.headers.Authorization = `Bearer ${access}`;
        
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Limpa storage e redireciona para login
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
