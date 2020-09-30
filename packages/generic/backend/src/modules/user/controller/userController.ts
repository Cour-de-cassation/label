import { expressRequestHandlerType } from '../../../lib/express';
import { userService } from '../service';

export { userController };

const login: expressRequestHandlerType<{
  email: string;
  password: string;
}> = async (req, res, next) => {
  const { email, password } = req.body;
  const { token } = await userService.login({ email, password });
  return token;
};

const userController = { login };
