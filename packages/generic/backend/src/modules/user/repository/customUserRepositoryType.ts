import { userType } from '@label/core';

export type { customUserRepositoryType };

type customUserRepositoryType = {
  findAllWithNoDeletionDate: () => Promise<Array<userType>>;
  findByEmail: (email: userType['email']) => Promise<userType>;
  updateHashedPassword: (
    userId: userType['_id'],
    hashedPassword: string,
  ) => Promise<{ success: boolean }>;
};
