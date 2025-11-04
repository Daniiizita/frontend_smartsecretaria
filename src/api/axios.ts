import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('Interceptor: Adicionando token de autorização ao cabeçalho.');
  } else {
    console.log('Interceptor: Nenhuma token encontrado.');
  }
  return config;
});

export default apiClient;
