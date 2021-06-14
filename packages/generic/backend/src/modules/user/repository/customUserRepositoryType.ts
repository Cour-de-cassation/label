import { userType } from '@label/core';
import { projectedType } from '../../../repository';

export type { customUserRepositoryType };

type customUserRepositoryType = {
  findAllWithNoDeletionDateProjection: <projectionT extends keyof userType>(
    projection: Array<projectionT>,
  ) => Promise<Array<projectedType<userType, projectionT>>>;
  findByEmail: (email: userType['email']) => Promise<userType>;
  updateHashedPassword: (
    userId: userType['_id'],
    hashedPassword: string,
  ) => Promise<{ success: boolean }>;
};
