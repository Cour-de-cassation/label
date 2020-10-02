import { userType } from '@label/core';

export type { customUserRepositoryType };

type customUserRepositoryType = {
  findByEmail: (email: userType['email']) => Promise<userType>;
  findById: (_id: userType['_id']) => Promise<userType>;
  updatePassword: (
    user: userType,
    password: string,
  ) => Promise<{ success: boolean }>;
};
