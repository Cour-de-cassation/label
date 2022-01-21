import { httpStatusCodeHandler } from '../utils';

export { CustomError, errorHandlers, throwFromStatusCode };

export type { errorCodeType };

type errorCodeType = typeof httpStatusCodeHandler.HTTP_STATUS_CODE.ERROR[keyof typeof httpStatusCodeHandler.HTTP_STATUS_CODE.ERROR];

const errorHandlers = {
  authenticationErrorHandler: buildErrorHandler(httpStatusCodeHandler.HTTP_STATUS_CODE.ERROR.AUTHENTICATION_ERROR),
  permissionErrorHandler: buildErrorHandler(httpStatusCodeHandler.HTTP_STATUS_CODE.ERROR.PERMISSION_ERROR),
  notFoundErrorHandler: buildErrorHandler(httpStatusCodeHandler.HTTP_STATUS_CODE.ERROR.NOT_FOUND_ERROR),
  serverErrorHandler: buildErrorHandler(httpStatusCodeHandler.HTTP_STATUS_CODE.ERROR.SERVER_ERROR),
};

class CustomError extends Error {
  statusCode: errorCodeType;

  constructor({ description, statusCode }: { description: string; statusCode: errorCodeType }) {
    super(description);
    this.statusCode = statusCode;

    Object.setPrototypeOf(this, CustomError.prototype);
  }
}

function buildErrorHandler(statusCode: errorCodeType) {
  return { build, check };

  function build(description: string) {
    return new CustomError({ description, statusCode });
  }

  function check(anotherStatusCode: number) {
    return anotherStatusCode === statusCode;
  }
}

function throwFromStatusCode(statusCode: number) {
  const errorDescription = 'A custom error has been thrown';
  if (httpStatusCodeHandler.isError(statusCode)) {
    throw buildErrorHandler(statusCode as errorCodeType).build(errorDescription);
  } else {
    throw errorHandlers.serverErrorHandler.build(errorDescription);
  }
}
