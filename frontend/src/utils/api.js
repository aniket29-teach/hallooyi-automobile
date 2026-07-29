import axios from 'axios';
import { BASE_URL } from '../config';

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  // baseURL: 'http://localhost:5000/api',

});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;