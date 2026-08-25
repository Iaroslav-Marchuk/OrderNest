import axios from 'axios';
import { refreshSession } from './refreshManager';

// const BASE_URL = 'http://localhost:3000';
const BASE_URL = 'https://ordernest-b.onrender.com';

type Listener = () => void;
const listeners = new Set<Listener>();

let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
  listeners.forEach(listener => listener());
};

export const getAccessToken = () => accessToken;

export const subscribeToAccessToken = (listener: Listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(config => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (
      error.response?.status === 403 &&
      !originalRequest.url.includes('/auth/login')
    ) {
      setAccessToken(null);
      window.location.href = '/login';
      return Promise.reject(error);
    }

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/auth/refresh') &&
      !originalRequest.url.includes('/auth/login')
    ) {
      originalRequest._retry = true;
      try {
        await refreshSession();
        originalRequest.headers.Authorization = `Bearer ${getAccessToken()}`;
        return axiosInstance(originalRequest);
      } catch {
        setAccessToken(null);
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
