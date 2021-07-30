import { userModule } from '@label/core';
import { buildUserRepository } from '../../repository';
import { buildUserService } from './index';

describe('changePassword', () => {
  it('should change the password of the given user', async () => {
    const userService = buildUserService();
    const userRepository = buildUserRepository();
    const userEmail = 'MAIL@MAIL.MAIL';
    const userName = 'NAME';
    const userPassword = userModule.lib.passwordHandler.generate();
    const userNewPassword = userModule.lib.passwordHandler.generate();
    const userRole = 'admin';
    await userService.signUpUser({
      email: userEmail,
      name: userName,
      password: userPassword,
      role: userRole,
    });
    const user = await userRepository.findByEmail(userEmail);

    const result = await userService.changePassword({
      user,
      previousPassword: userPassword,
      newPassword: userNewPassword,
    });

    const { email, name, role, token } = await userService.login({
      email: userEmail,
      password: userNewPassword,
    });
    expect(result).toEqual('passwordUpdated');
    expect(email).toEqual('mail@mail.mail');
    expect(name).toEqual(user.name);
    expect(role).toEqual(user.role);
    expect(token).toBeDefined;
  });

  it('should not change the password of the given user if the previous password is wrong', async () => {
    const userService = buildUserService();
    const userRepository = buildUserRepository();
    const userEmail = 'MAIL@MAIL.MAIL';
    const userName = 'NAME';
    const userPassword = 'PASSWORD';
    const userRole = 'admin';
    await userService.signUpUser({
      email: userEmail,
      name: userName,
      password: userPassword,
      role: userRole,
    });
    const user = await userRepository.findByEmail(userEmail);

    const result = await userService.changePassword({
      user,
      previousPassword: 'WRONG_PASSWORD',
      newPassword: 'NEW_PASSWORD',
    });

    const { email, name, role, token } = await userService.login({
      email: userEmail,
      password: userPassword,
    });
    expect(result).toEqual('wrongPassword');
    expect(email).toEqual('mail@mail.mail');
    expect(name).toEqual(user.name);
    expect(role).toEqual(user.role);
    expect(token).toBeDefined;
  });

  it('should not change the password of the given user if the new password is not valid (less than 8 characters)', async () => {
    const userService = buildUserService();
    const userRepository = buildUserRepository();
    const userEmail = 'MAIL@MAIL.MAIL';
    const userName = 'NAME';
    const userPassword = 'PASSWORD';
    const userRole = 'admin';
    await userService.signUpUser({
      email: userEmail,
      name: userName,
      password: userPassword,
      role: userRole,
    });
    const user = await userRepository.findByEmail(userEmail);

    const result = await userService.changePassword({
      user,
      previousPassword: 'PASSWORD',
      newPassword: 'P',
    });

    const { email, name, role, token } = await userService.login({
      email: userEmail,
      password: userPassword,
    });
    expect(result).toEqual('notValidNewPassword');
    expect(email).toEqual('mail@mail.mail');
    expect(name).toEqual(user.name);
    expect(role).toEqual(user.role);
    expect(token).toBeDefined;
  });

  it('should not change the password of the given user if the new password is not changed', async () => {
    const userService = buildUserService();
    const userRepository = buildUserRepository();
    const userEmail = 'MAIL@MAIL.MAIL';
    const userName = 'NAME';
    const userPassword = userModule.lib.passwordHandler.generate();
    const userRole = 'admin';
    await userService.signUpUser({
      email: userEmail,
      name: userName,
      password: userPassword,
      role: userRole,
    });
    const user = await userRepository.findByEmail(userEmail);

    const result = await userService.changePassword({
      user,
      previousPassword: userPassword,
      newPassword: userPassword,
    });

    const { email, name, role, token } = await userService.login({
      email: userEmail,
      password: userPassword,
    });
    expect(result).toEqual('notValidNewPassword');
    expect(email).toEqual('mail@mail.mail');
    expect(name).toEqual(user.name);
    expect(role).toEqual(user.role);
    expect(token).toBeDefined;
  });
});
