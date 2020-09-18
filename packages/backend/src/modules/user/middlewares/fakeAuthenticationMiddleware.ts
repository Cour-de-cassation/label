import { ExpressRequestHandlerType } from '../../../lib/express';

export { fakeAuthenticationMiddleware };

const fakeAuthenticationMiddleware: ExpressRequestHandlerType = (
  _req,
  _res,
  next,
) => {
  next();
};
