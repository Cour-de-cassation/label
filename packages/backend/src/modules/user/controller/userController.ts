import { userService } from '../service';

export { userController };

const userController = {
  async login(req: any, res: any) {
    const { email, password } = req.body;
    const { token } = await userService.login({ email, password });
    res.send(token);
  },
};
