import { RequestHandler } from 'express';

export type { expressRequestHandlerType };

type expressRequestHandlerType<expressReqBodyType = any> = RequestHandler<
  any,
  any,
  expressReqBodyType,
  any
>;
