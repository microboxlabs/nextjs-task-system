import axios, { AxiosResponse } from 'axios';
import { useAuthStore } from '@/store';
import { FetchResponse } from '@/components/TableTask';
import { UsersResponse } from '@/components/TableUsers';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const authApi = axios.create({ baseURL: API_URL });

authApi.interceptors.request.use(
  async (config: any) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers["Content-Type"] = "application/json";
    config.headers["access-control-allow-origin"] = "*";
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Obtener todos los usuarios
export const getAllUsers = async (query = ""): Promise< UsersResponse | null> => {
  try {
    const response: AxiosResponse<UsersResponse> = await authApi.get(`/user?${query}`);
    return response.data;
  } catch (error) {
    return null;
  }
};

// Registrar usuario
export const registerUser = async (username: string, password: string): Promise<any> => {
  try {
    const response: AxiosResponse<any> = await axios.post(`${API_URL}/auth/register`, {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    throw new Error('Error en el registro');
  }
};

// Iniciar sesión
export const login = async (username: string, password: string): Promise<any | null> => {
  try {
    const response: AxiosResponse<any> = await axios.get(`${API_URL}/auth/login`, {
      auth: {
        username,
        password,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al iniciar sesión", error);
    return null;
  }
};

// Obtener todas las tareas
export const getAllTasks = async (query = ""): Promise<FetchResponse | null> => {
  try {
    const response: AxiosResponse<FetchResponse> = await authApi.get(`/task?${query}`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener las tareas');
  }
};

// Crear tarea
export const createTask = async (payload: any): Promise<any> => {
  try {
    const response: AxiosResponse<any> = await authApi.post(`/task`, payload);
    return response.data;
  } catch (error) {
    throw new Error('Error al crear la tarea');
  }
};

// Actualizar tarea
export const updateTask = async (payload: any): Promise<any> => {
  try {
    const response: AxiosResponse<any> = await authApi.put(`/task`, payload);
    return response.data;
  } catch (error) {
    throw new Error('Error al actualizar la tarea');
  }
};

// Eliminar tarea
export const deleteTask = async (id: string): Promise<any> => {
  try {
    const response: AxiosResponse<any> = await authApi.delete(`/task?id=${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Error al eliminar la tarea');
  }
};
