import axios from 'axios';
import { API_BASE_URL, APP_BASE_URL } from '../config/app';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000
});

const responseSuccessHandler = (response: any) => {
  return response;
};

const responseErrorHandler = (error: any) => {
  if (window.location.href !== `${APP_BASE_URL}/login` && error.response.status === 401) {
    localStorage.clear();
    // eslint-disable-next-line no-alert
    alert('Sessão expirada. Faça o login novamente.');
    window.location.href = '/login';
  }

  return Promise.reject(error);
};

api.interceptors.response.use(responseSuccessHandler, responseErrorHandler);

export default api;
