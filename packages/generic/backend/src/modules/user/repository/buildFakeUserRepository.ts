import { userType } from '@label/core';
import { buildFakeRepositoryBuilder } from '../../../repository';
import { customUserRepositoryType } from './customUserRepositoryType';

export { buildFakeUserRepository };

const buildFakeUserRepository = buildFakeRepositoryBuilder<
  userType,
  customUserRepositoryType
>({
  buildCustomFakeRepository: (collection) => ({
    async findByEmail(email) {
      const result = collection.find((user) => user.email === email);
      if (!result) {
        throw new Error(`No matching user for email ${email}`);
      }
      return result;
    },
  }),
});
