import { RequestHandler } from 'express';

export { expressRequestHandlerType };

type expressRequestHandlerType<expressReqBodyType = any> = RequestHandler<
  any,
  any,
  expressReqBodyType,
  any
>;
