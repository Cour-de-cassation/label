import { hasher, userModule, userType } from '@label/core';
import { buildUserRepository } from '../../repository';

export { changePassword };

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
