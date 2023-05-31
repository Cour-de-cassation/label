import { userType } from '@label/core';
import { projectedType } from '../../../repository';

export type { customUserRepositoryType };

type customUserRepositoryType = {
  findAllWithNoDeletionDate: () => Promise<Array<userType>>;
  findByEmail: (email: userType['email']) => Promise<userType>;
  updateHashedPassword: (
    userId: userType['_id'],
    hashedPassword: string,
  ) => Promise<{ success: boolean }>;
};
