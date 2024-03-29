import { errorHandlers } from 'sder-core';
import { userModule, userType } from '@label/core';
import { buildUserRepository } from '../../repository';

export { buildLogin };

function buildLogin(checkCallAttempts: (identifier: string) => void) {
  return login;

  async function login({
    email,
    password,
  }: {
    email: userType['email'];
    password: string;
  }) {
    try {
      checkCallAttempts(userModule.lib.formatEmail(email));
      const userRepository = buildUserRepository();
      const user = await userRepository.findByEmail(email);

      if (!(await userModule.lib.passwordHandler.checkUser(user, password))) {
        throw new Error(
          `The received password does not match the stored one for ${user.email}`,
        );
      }

      const token = await userModule.lib.getTokenForUser(user);

      const passwordTimeValidityStatus = userModule.lib.passwordHandler.getPasswordTimeValidityStatus(
        user,
      );

      return {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        token,
        passwordTimeValidityStatus,
      };
    } catch (err) {
      throw errorHandlers.authenticationErrorHandler.build(
        `Login failed using ${email} email.`,
      );
    }
  }
}
