import axios from 'axios';
import {useAuthStore} from '@/store'

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const authApi = axios.create({ baseURL: API_URL});
authApi.interceptors.request.use(async (config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers.Authorization = `Bearer ${token}`;
  config.headers["Content-Type"] = "application/json";
  config.headers["access-control-allow-origin"] = "*";
  return config;
});


export const getAllUsers = async (query = "") => {
    try {
      const response = await authApi.get(`${API_URL}/user?${query}`);
      return response.data;
    } catch (error) {
      return null;
    }
  };

  export const registerUser = async (username: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        username,
        password
      });
      return response.data;
    } catch (error) {
      throw new Error('Error en el registro');
    }
  };

export const login = async (username: string, password: string) => {
  try {
    const response = await axios.get(`${API_URL}/auth/login`, {
        auth: {
            username,
            password
          },
    });
    return response.data;
  } catch (error) {
    return null;
  }
};

export const getAllTasks = async (query = "") => {
  try {
    const response = await authApi.get(`${API_URL}/task?${query}`);
    return response.data;
  } catch (error) {
    throw new Error('Error al crear la tarea');
  }
};

export const createTask = async (payload:any) => {
  try {
    const response = await authApi.post(`${API_URL}/task`, payload);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener las tareas');
  }
};

export const updateTask = async (payload:any) => {
  try {
    const response = await authApi.put(`${API_URL}/task`, payload);
    return response.data;
  } catch (error) {
    throw new Error('Error al actualizar la tarea');
  }
};

export const deleteTask = async (id:number) => {
  try {
    const response = await authApi.delete(`${API_URL}/task?id=${id}`)
    return response.data;
  } catch (error) {
    throw new Error('Error al eliminar la tarea');
  }
};