import { expressRequestHandlerType } from '../../../utils';

export { fakeAuthenticationMiddleware };

const fakeAuthenticationMiddleware: expressRequestHandlerType = (
  _req,
  _res,
  next,
) => {
  next();
};
