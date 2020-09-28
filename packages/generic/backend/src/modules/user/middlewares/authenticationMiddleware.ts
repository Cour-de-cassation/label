import { expressRequestHandlerType } from '../../../lib/express';
import { jwtSigner } from '../../../lib/jwtSigner';
import { logger } from '../../../utils';

export { authenticationMiddleware };

const authenticationMiddleware: expressRequestHandlerType = (
  req,
  res,
  next,
) => {
  try {
    if (!req.headers.authorization) {
      throw new Error('No authorization header provided');
    }
    const token = req.headers.authorization.split(' ')[1];
    jwtSigner.verifyToken(token);
    next();
  } catch (error) {
    logger.log(error);
    res.status(401).send('Not authorized');
  }
};
