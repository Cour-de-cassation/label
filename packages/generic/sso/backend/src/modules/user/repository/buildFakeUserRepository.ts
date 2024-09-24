import { userModule, userType } from '@label/core';
import {
  buildFakeRepositoryBuilder,
} from '../../../repository';
import { customUserRepositoryType } from './customUserRepositoryType';

export { buildFakeUserRepository };

const buildFakeUserRepository = buildFakeRepositoryBuilder<
  userType,
  customUserRepositoryType
>({
  collectionName: 'users',
  buildCustomFakeRepository: (collection) => ({
    async findByEmail(email) {
      const formattedEmail = userModule.lib.formatEmail(email);
      const result = collection.find((user) => user.email === formattedEmail);
      if (!result) {
        throw new Error(`No matching user for email ${email}`);
      }
      return result;
    },
  }),
});

