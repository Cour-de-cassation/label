import { expressRequestHandlerType } from '../../../lib/express';
import { logger } from '../../../utils';
import { userService } from '../service';

export { authenticationMiddleware };

const authenticationMiddleware: expressRequestHandlerType = (
  req,
  res,
  next,
) => {
  try {
    userService.extractUserIdFromAuthorizationHeader(req.headers.authorization);
    next();
  } catch (error) {
    logger.log(error);
    res.status(401).send('Not authorized');
  }
};
