import { userModule, userType } from '@label/core';
import { buildFakeRepositoryBuilder } from '../../../repository';
import { customUserRepositoryType } from './customUserRepositoryType';

export { buildFakeUserRepository };

const buildFakeUserRepository = buildFakeRepositoryBuilder<
  userType,
  customUserRepositoryType
>({
  buildCustomFakeRepository: (collection) => ({
    async findByEmail(email) {
      const formattedEmail = userModule.lib.formatEmail(email);
      const result = collection.find((user) => user.email === formattedEmail);
      if (!result) {
        throw new Error(`No matching user for email ${email}`);
      }
      return result;
    },
    async updateHashedPassword(user, hashedPassword) {
      const storedUserIndex = collection.findIndex(
        ({ _id }) => _id === user._id,
      );
      if (storedUserIndex === -1) {
        return { success: false };
      }
      collection[storedUserIndex] = { ...user, hashedPassword };
      return { success: true };
    },
  }),
});
