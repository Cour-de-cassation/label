import { expressRequestHandlerType } from '../../../lib/express';
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

const userController = { login, resetPasswordRequest };
