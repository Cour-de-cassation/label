import {
  assignationType,
  errorHandlers,
  hasher,
  idModule,
  indexer,
  userModule,
  userType,
} from '@label/core';
import { buildCallAttemptsRegulator } from '../../../lib/callAttemptsRegulator';
import { jwtSigner, logger } from '../../../utils';
import { buildUserRepository } from '../repository';

export { userService, buildUserService };

const DEFAULT_ROLE = 'annotator';

const DELAY_BETWEEN_LOGIN_ATTEMPTS_IN_SECONDS = 1 * 1000;

const MAX_LOGIN_ATTEMPTS = 1;

const userService = buildUserService();

function buildUserService() {
  const { checkCallAttempts } = buildCallAttemptsRegulator(
    MAX_LOGIN_ATTEMPTS,
    DELAY_BETWEEN_LOGIN_ATTEMPTS_IN_SECONDS,
  );
  return {
    changePassword,
    createUser,
    fetchAuthenticatedUserFromAuthorizationHeader,
    fetchUsersByAssignations,
    fetchUsersWithDetails,
    login,
    resetPassword,
    setIsActivatedForUser,
    setDeletionDateForUser,
    signUpUser,
  };

  async function createUser({
    name,
    email,
    role,
  }: {
    name: string;
    email: string;
    role: userType['role'];
  }) {
    const password = userModule.lib.passwordHandler.generate();
    await signUpUser({ name, email, role, password });
    return password;
  }

  async function changePassword({
    user,
    previousPassword,
    newPassword,
  }: {
    user: userType;
    previousPassword: string;
    newPassword: string;
  }) {
    const userRepository = buildUserRepository();

    const isPreviousPasswordValid = await hasher.compare(
      previousPassword,
      user.hashedPassword,
    );

    const isNewPasswordEqualToCurrent = await hasher.compare(
      newPassword,
      user.hashedPassword,
    );

    if (!isPreviousPasswordValid) {
      return 'wrongPassword';
    } else if (
      isNewPasswordEqualToCurrent ||
      !userModule.lib.passwordHandler.isValid(newPassword)
    ) {
      return 'notValidNewPassword';
    } else {
      await userRepository.updateHashedPassword(
        user._id,
        await userModule.lib.computeHashedPassword(newPassword),
      );

      return 'passwordUpdated';
    }
  }

  async function fetchUsersByAssignations(assignations: assignationType[]) {
    const userRepository = buildUserRepository();
    const userIds = assignations.map((assignation) => assignation.userId);
    const usersById = await userRepository.findAllByIds(userIds);

    const usersByAssignationId = indexer.mapIndexBy(
      assignations,
      (assignation) => idModule.lib.convertToString(assignation._id),
      (assignation) =>
        usersById[idModule.lib.convertToString(assignation.userId)],
    );

    indexer.assertEveryIdIsDefined(
      assignations.map((assignation) =>
        idModule.lib.convertToString(assignation._id),
      ),
      usersByAssignationId,
      (_id) => `The assignation ${_id} has no matching user`,
    );
    return usersByAssignationId;
  }

  async function fetchUsersWithDetails() {
    const userRepository = buildUserRepository();
    const users = await userRepository.findAllWithNoDeletionDateProjection([
      '_id',
      'email',
      'isActivated',
      'name',
      'role',
    ]);
    return users.map(({ _id, email, isActivated, name, role }) => ({
      user: {
        _id,
        email,
        isActivated,
        name,
        role,
      },
    }));
  }

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

      const token = jwtSigner.sign(user._id);

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
      logger.error(err);
      throw new Error('Login failed');
    }
  }

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

  async function setDeletionDateForUser(userId: userType['_id']) {
    const userRepository = buildUserRepository();
    await userRepository.updateOne(userId, {
      deletionDate: new Date().getTime(),
    });
  }

  async function setIsActivatedForUser({
    userId,
    isActivated,
  }: {
    userId: userType['_id'];
    isActivated: userType['isActivated'];
  }) {
    const userRepository = buildUserRepository();
    await userRepository.updateOne(userId, { isActivated });
  }

  async function signUpUser({
    email,
    name,
    password,
    role = DEFAULT_ROLE,
  }: {
    email: string;
    name: string;
    password: string;
    role?: userType['role'];
  }) {
    const userRepository = buildUserRepository();
    const newUser = await userModule.lib.buildUser({
      email,
      name,
      password,
      role,
    });

    return userRepository.insert(newUser);
  }

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
}
