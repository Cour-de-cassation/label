import { userType } from '@label/core';
import { projectedType } from '../../../repository';

export type { customUserRepositoryType };

type customUserRepositoryType = {
  findByEmail: (email: userType['email']) => Promise<userType>;
};
