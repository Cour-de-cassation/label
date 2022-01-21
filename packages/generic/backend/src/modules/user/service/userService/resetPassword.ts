import { errorHandlers } from 'sder';
import { userModule, userType } from '@label/core';
import { buildUserRepository } from '../../repository';

export { resetPassword };

async function resetPassword(userId: userType['_id']) {
  const userRepository = buildUserRepository();
  const password = userModule.lib.passwordHandler.generate();
  const hashedPassword = await userModule.lib.computeHashedPassword(password);
  const { success } = await userRepository.updateHashedPassword(
    userId,
    hashedPassword,
  );

  if (!success) {
    throw errorHandlers.notFoundErrorHandler.build(
      `No user found for id ${userId}`,
    );
  }

  return password;
}
