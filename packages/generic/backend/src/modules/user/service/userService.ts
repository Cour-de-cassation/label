import { idModule, userModule } from '@label/core';
import { userDtoType } from '../types/userDtoType';
import { buildUserRepository } from '../repository';
import { hasher, jwtSigner, mailer } from '../../../utils';
import { wordings } from '../../../wordings';

export { userService };

const userService = {
  async login(user: userDtoType) {
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
    const token = jwtSigner.sign(storedUser._id);
    return {
      token,
    };
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
  async signUpUser(user: userDtoType) {
    const hashedPassword = await hasher.hash(user.password);
    const userRepository = buildUserRepository();
    const newUser = userModule.lib.buildUser({
      email: user.email,
      password: hashedPassword,
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
  extractUserIdFromAuthorizationHeader(authorization?: string) {
    if (!authorization) {
      throw new Error('No authorization value provided');
    }
    const token = authorization.split(' ')[1];
    const userId = jwtSigner.verifyToken(token);
    return idModule.lib.buildId(userId);
  },
};
