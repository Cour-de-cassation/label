import { userType } from '@label/core';

export type { customUserRepositoryType };

type customUserRepositoryType = {
  findByEmail: (email: userType['email']) => Promise<userType>;
  updateNameAndRoleById: (
    userId: userType['_id'],
    name: userType['name'],
    role: userType['role'],
  ) => Promise<{ success: boolean }>;
};
