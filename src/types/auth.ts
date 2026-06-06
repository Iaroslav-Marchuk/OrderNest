import type { User } from './user';

export interface LoginUserReq {
  tel: string;
  password: string;
}

export interface LoginUserRes {
  accessToken: string;
  user: User;
}

export interface ChangePasswordReq {
  oldPass: string;
  newPass: string;
}

export interface ChangePasswordRes {
  accessToken: string;
  user: User;
}
