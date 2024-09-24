import { expressRequestHandlerType } from './express';

export { buildHandlingErrorController };

const buildHandlingErrorController = (
  controller: expressRequestHandlerType,
): expressRequestHandlerType => async (req, res, next) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const response = await controller(req, res, next);
    res.send(response);
  } catch (error) {
    res.status(500);
    next(error);
  }
};
