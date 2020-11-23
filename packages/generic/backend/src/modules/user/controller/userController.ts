import { expressRequestHandlerType } from '../../../utils';
import { userService } from '../service';

export { userController };

const login: expressRequestHandlerType<{
  email: string;
  password: string;
}> = async (req) => {
  const { email, password } = req.body;
  const { token } = await userService.login({ email, password });
  return token;
};

const resetPasswordRequest: expressRequestHandlerType<{
  email: string;
}> = async (req) => {
  const { email } = req.body;
  await userService.resetPasswordRequest(email);
  return;
};

const resetPassword: expressRequestHandlerType<{
  password: string;
  resetPasswordToken: string;
}> = async (req) => {
  const { password, resetPasswordToken } = req.body;
  const truc = userService.resetPassword(password, resetPasswordToken);
  return truc;
};

const userController = { login, resetPasswordRequest, resetPassword };
