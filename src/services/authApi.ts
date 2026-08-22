import { axiosInstance, setAccessToken } from './axiosInstance';

import type {
  LoginUserReq,
  LoginUserRes,
  ChangePasswordRes,
  ChangePasswordReq,
} from '../types/auth';

import type { User } from '../types/user';
import { refreshSession } from './refreshManager';

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
  return refreshSession();
};

export const sendHeartbeatApi = async (): Promise<void> => {
  await axiosInstance.patch('/auth/heartbeat');
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

export const changeLocationApi = async (
  location: string
): Promise<{ location: string }> => {
  const { data } = await axiosInstance.patch<{
    message: string;
    data: { location: string };
  }>('/auth/setLocation', { location });

  return data.data;
};
