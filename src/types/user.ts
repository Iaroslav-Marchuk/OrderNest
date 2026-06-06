export type UserRole =
  | 'admin'
  | 'cutting'
  | 'hardening'
  | 'assembly'
  | 'quality'
  | 'logistics'
  | 'guest';

export type HardeningLine = 'line_1' | 'line_2' | 'line_3';

export interface User {
  _id: string;
  name: string;
  tel: string;
  role: UserRole;
  telegramChatId: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserReq {
  name: string;
  tel: string;
  role: UserRole;
  password: string;
}

export interface PatchUserReq {
  userId: string;
  updateData: Partial<
    Pick<User, 'name' | 'tel' | 'role' | 'isActive' | 'telegramChatId'>
  >;
}

export interface ResetPasswordReq {
  userId: string;
  newPass: string;
}
