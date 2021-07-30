import { errorHandlers, idModule } from '@label/core';
import { jwtSigner } from '../../../../utils';
import { buildUserRepository } from '../../repository';

export { fetchAuthenticatedUserFromAuthorizationHeader };

async function fetchAuthenticatedUserFromAuthorizationHeader(
  authorization?: string,
) {
  const userRepository = buildUserRepository();

  if (authorization) {
    const token = authorization.split(' ')[1];
    const userId = jwtSigner.verifyToken(token);

    try {
      return await userRepository.findById(idModule.lib.buildId(userId));
    } catch (_error) {
      throw errorHandlers.authenticationErrorHandler.build(
        `No user for ${userId}`,
      );
    }
  } else {
    throw errorHandlers.authenticationErrorHandler.build(
      'No authorization value provided',
    );
  }
}
