import type {
  CreateUserReq,
  GetUsersParams,
  PatchUserReq,
  ResetPasswordReq,
  User,
  UserResponse,
} from '../types/user';
import { axiosInstance } from './axiosInstance';

export const getAllUsersApi = async (
  params: GetUsersParams
): Promise<UserResponse> => {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(
      ([, v]) => v !== '' && v !== undefined && v !== null
    )
  );
  const { data } = await axiosInstance.get<{
    message: string;
    data: UserResponse;
  }>('/users', { params: cleanParams });
  return data.data;
};

export const getUserByIdApi = async (userId: string): Promise<User> => {
  const { data } = await axiosInstance.get<{
    message: string;
    data: { user: User };
  }>(`/users/${userId}`);

  return data.data.user;
};

export const createUserApi = async (userData: CreateUserReq): Promise<User> => {
  const { data } = await axiosInstance.post<{
    message: string;
    data: { user: User };
  }>('/users', userData);

  return data.data.user;
};

export const patchUserApi = async ({
  userId,
  updateData,
}: PatchUserReq): Promise<User> => {
  const { data } = await axiosInstance.patch<{
    message: string;
    data: { updatedUser: User };
  }>(`/users/${userId}`, updateData);

  return data.data.updatedUser;
};

export const resetPasswordApi = async ({
  userId,
  newPass,
}: ResetPasswordReq): Promise<void> => {
  await axiosInstance.patch<{
    message: string;
  }>(`/users/${userId}/reset-password`, { newPass });
};

export const deleteUserApi = async (userId: string): Promise<void> => {
  await axiosInstance.delete(`/users/${userId}`);
};
