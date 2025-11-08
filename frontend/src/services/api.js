import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

export const getPlazas = () => api.get('/plaza');
export const postEntrada = (id) => api.post(`/tiempo/entrada/${id}`);
export const postSalida = (id) => api.post(`/tiempo/salida/${id}`);

export default api;
