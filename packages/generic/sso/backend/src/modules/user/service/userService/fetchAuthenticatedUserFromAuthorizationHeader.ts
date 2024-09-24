import { errorHandlers } from 'sder-core';
import { userModule, idModule } from '@label/core';
import { buildUserRepository } from '../../repository';

export { fetchAuthenticatedUserFromAuthorizationHeader };

async function fetchAuthenticatedUserFromAuthorizationHeader(
  authorization?: string,
) {
  const userId = userModule.lib.extractUserIdFromAuthorizationHeader(
    authorization,
  );

  try {
    const userRepository = buildUserRepository();
    return await userRepository.findById(idModule.lib.buildId(userId));
  } catch (_error) {
    throw errorHandlers.authenticationErrorHandler.build(
      `No user for ${userId}`,
    );
  }
}
