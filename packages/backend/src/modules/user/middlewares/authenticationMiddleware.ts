import { jwtSigner } from '../../../lib/jwtSigner';
import { logger } from '../../../utils';

export { authenticationMiddleware };

const authenticationMiddleware = (req: any, res: any, next: any) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    jwtSigner.verifyToken(token);
    next();
  } catch (error) {
    logger.log(error);
    res.status(401).send('Not authorized');
  }
};
