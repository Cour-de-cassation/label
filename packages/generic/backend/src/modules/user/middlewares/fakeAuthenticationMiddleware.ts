import { expressRequestHandlerType } from '../../../lib/express';

export { fakeAuthenticationMiddleware };

const fakeAuthenticationMiddleware: expressRequestHandlerType = (
  _req,
  _res,
  next,
) => {
  next();
};
