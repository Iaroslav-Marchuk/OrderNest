import axios from 'axios';
import { setAccessToken } from './axiosInstance';
import type { LoginUserRes } from '../types/auth';

const BASE_URL = 'http://localhost:3000';
// const BASE_URL = 'https://minifigs-b.onrender.com';

let refreshPromise: Promise<void> | null = null;

export const refreshSession = async (): Promise<void> => {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = axios
    .post<{ message: string; data: LoginUserRes }>(
      `${BASE_URL}/auth/refresh`,
      {},
      { withCredentials: true }
    )
    .then(({ data }) => {
      setAccessToken(data.data.accessToken);
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
};
