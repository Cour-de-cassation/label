import { userType } from '@label/core';
import { buildRepositoryBuilder } from '../../../repository';
import { customUserRepositoryType } from './customUserRepositoryType';

export { buildUserRepository };

const buildUserRepository = buildRepositoryBuilder<
  userType,
  customUserRepositoryType
>({
  collectionName: 'users',
  buildCustomRepository: collection => ({
    async findByEmail(email) {
      const result = await collection.findOne({ email });
      if (!result) {
        throw new Error(`No matching user for email ${email}`);
      }
      return result;
    },
  }),
});
