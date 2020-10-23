import { userType } from '@label/core';

export type { customUserRepositoryType };

type customUserRepositoryType = {
  findByEmail: (email: userType['email']) => Promise<userType>;
  updatePassword: (
    user: userType,
    password: string,
  ) => Promise<{ success: boolean }>;
};
