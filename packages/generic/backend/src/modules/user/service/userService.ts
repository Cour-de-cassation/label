import {
  assignationType,
  errorHandlers,
  idModule,
  userModule,
  userType,
} from '@label/core';
import { buildUserRepository } from '../repository';
import { hasher, jwtSigner, mailer } from '../../../utils';
import { wordings } from '../../../wordings';

export { userService };

const DEFAULT_ROLE = 'annotator';

const userService = {
  async fetchUserNamesByAssignationId(
    assignationsById: Record<string, assignationType>,
  ) {
    const userRepository = buildUserRepository();
    const userIds = Object.values(assignationsById).map(
      (assignation) => assignation.userId,
    );
    const usersById = await userRepository.findAllByIds(userIds);
    const userNamesByAssignationId = Object.entries(assignationsById).reduce(
      (accumulator, [assignationId, assignation]) => {
        const user =
          usersById[idModule.lib.convertToString(assignation.userId)];

        return {
          ...accumulator,
          [assignationId]: user.name,
        };
      },
      {} as Record<string, string>,
    );

    return userNamesByAssignationId;
  },

  async login(user: {
    email: userType['email'];
    password: userType['password'];
  }) {
    const userRepository = buildUserRepository();
    const storedUser = await userRepository.findByEmail(user.email);
    const isPasswordValid = await hasher.compare(
      user.password,
      storedUser.password,
    );
    if (!isPasswordValid) {
      throw new Error(
        `The received password does not match the stored one for ${user.email}`,
      );
    }

    return jwtSigner.sign(storedUser._id);
  },
  async resetPasswordRequest(email: string) {
    const userRepository = buildUserRepository();
    const storedUser = await userRepository.findByEmail(email);
    const resetPasswordRequestToken = jwtSigner.sign(storedUser._id);
    const resetPasswordLink = `${process.env.WEBAPP_URL}/reset-password/${resetPasswordRequestToken}`;
    const text = `${wordings.resetPasswordMailText}${resetPasswordLink}`;
    await mailer.sendMail({
      to: email,
      subject: wordings.resetPasswordMailSubject,
      text: text,
    });
  },
  async signUpUser(user: {
    email: userType['email'];
    name: userType['name'];
    password: userType['password'];
    role?: userType['role'];
  }) {
    const role = user.role || DEFAULT_ROLE;
    const hashedPassword = await hasher.hash(user.password);
    const userRepository = buildUserRepository();
    const newUser = userModule.lib.buildUser({
      email: user.email,
      name: user.name,
      password: hashedPassword,
      role,
    });
    return userRepository.insert(newUser);
  },
  async resetPassword(password: string, resetPasswordToken: string) {
    const userStrId = jwtSigner.verifyToken(resetPasswordToken);
    const userRepository = buildUserRepository();
    const userId = idModule.lib.buildId(userStrId);
    const user = await userRepository.findById(userId);
    const hashedPassword = await hasher.hash(password);
    return await userRepository.updatePassword(user, hashedPassword);
  },
  async fetchAuthenticatedUserFromAuthorizationHeader(authorization?: string) {
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
  },
};
