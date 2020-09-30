import { expressRequestHandlerType } from './express';

export { buildHandlingErrorController };

const buildHandlingErrorController = (
  controller: expressRequestHandlerType,
): expressRequestHandlerType => async (req, res, next) => {
  try {
    const response = await controller(req, res, next);
    res.send(response);
  } catch (error) {
    res.status(500);
    next(error);
  }
};
