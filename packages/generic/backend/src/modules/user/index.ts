import { userController } from './controller';
import { authenticationMiddleware } from './middlewares';
import { buildUserRepository } from './repository';
import { userResolvers } from './resolvers';
import { buildAuthenticatedResolver } from './lib';
import { userService } from './service';

export {
  userController,
  authenticationMiddleware,
  buildUserRepository,
  userResolvers,
  buildAuthenticatedResolver,
  userService,
};
