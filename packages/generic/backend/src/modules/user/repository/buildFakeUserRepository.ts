import { userType } from '@label/core';
import { buildFakeRepositoryBuilder } from '../../../repository';
import { customUserRepositoryType } from './customUserRepositoryType';

export { buildFakeUserRepository };

const buildFakeUserRepository = buildFakeRepositoryBuilder<
  userType,
  customUserRepositoryType
>({
  collectionName: 'users',
  buildCustomFakeRepository: (collection) => ({
    async findByEmail(email) {
      const formattedEmail = email.trim().toLowerCase();
      const result = collection.find((user) => user.email === formattedEmail);
      if (!result) {
        throw new Error(`No matching user for email ${email}`);
      }
      return result;
    },
    async updateNameAndRoleById(userId, name, role) {
      const storedUserIndex = collection.findIndex(({ _id }) => _id === userId);
      if (storedUserIndex === -1) {
        return { success: false };
      }
      collection[storedUserIndex] = {
        ...collection[storedUserIndex],
        name,
        role,
      };
      return { success: true };
    },
  }),
});
