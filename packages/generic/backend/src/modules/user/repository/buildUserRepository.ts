import { userModule, userType } from '@label/core';
import { buildRepositoryBuilder } from '../../../repository';
import { customUserRepositoryType } from './customUserRepositoryType';

export { buildUserRepository };

const buildUserRepository = buildRepositoryBuilder<
  userType,
  customUserRepositoryType
>({
  collectionName: 'users',
  indexes: [
    {
      index: {
        email: 1,
      },
      mustBeUnique: true,
    } as const,
  ],
  buildCustomRepository: (collection) => ({
    async findByEmail(email) {
      const formattedEmail = userModule.lib.formatEmail(email);
      const result = await collection.findOne({ email: formattedEmail });
      if (!result) {
        throw new Error(`No matching user for email ${email}`);
      }
      return result;
    },
    async updateNameAndRoleById(userId, name, role) {
      const { result } = await collection.updateOne(
        { _id: userId },
        { $set: { name, role } },
      );
      return {
        success: result.ok === 1,
      };
    },
  }),
});
