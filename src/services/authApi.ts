import { axiosInstance, setAccessToken } from './axiosInstance';

import type {
  LoginUserReq,
  LoginUserRes,
  ChangePasswordRes,
  ChangePasswordReq,
} from '../types/auth';

import type { User } from '../types/user';

export const loginApi = async (
  credentials: LoginUserReq
): Promise<LoginUserRes> => {
  const { data } = await axiosInstance.post<{
    message: string;
    data: LoginUserRes;
  }>('/auth/login', credentials);
  setAccessToken(data.data.accessToken);
  return data.data;
};

export const logoutApi = async (): Promise<void> => {
  await axiosInstance.post('/auth/logout');
  setAccessToken(null);
};

export const refreshSessionApi = async (): Promise<void> => {
  const { data } = await axiosInstance.post<{
    message: string;
    data: LoginUserRes;
  }>('/auth/refresh');
  setAccessToken(data.data.accessToken);
};

export const getCurrentUserApi = async (): Promise<User> => {
  const { data } = await axiosInstance.get<{
    message: string;
    data: { currentUser: User };
  }>('/auth/currentUser');
  return data.data.currentUser;
};

export const changePasswordApi = async (
  body: ChangePasswordReq
): Promise<ChangePasswordRes> => {
  const { data } = await axiosInstance.patch<{
    message: string;
    data: ChangePasswordRes;
  }>('/auth/change-password', body);
  setAccessToken(data.data.accessToken);
  return data.data;
};
