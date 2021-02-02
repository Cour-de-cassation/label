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
      const formattedEmail = email.trim().toLowerCase();
      const result = collection.find((user) => user.email === formattedEmail);
      if (!result) {
        throw new Error(`No matching user for email ${email}`);
      }
      return result;
    },
    async updatePassword(user, password) {
      const storedUserIndex = collection.findIndex(
        ({ _id }) => _id === user._id,
      );
      if (storedUserIndex === -1) {
        return { success: false };
      }
      collection[storedUserIndex] = { ...user, password };
      return { success: true };
    },
  }),
});
