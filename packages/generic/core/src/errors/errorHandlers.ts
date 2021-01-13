import { httpStatusCodeHandler } from '../utils';

export { CustomError, errorHandlers };

export type { errorCodeType };

type errorCodeType = typeof httpStatusCodeHandler.HTTP_STATUS_CODE.ERROR[keyof typeof httpStatusCodeHandler.HTTP_STATUS_CODE.ERROR];

const errorHandlers = {
  authenticationErrorHandler: buildErrorHandler(httpStatusCodeHandler.HTTP_STATUS_CODE.ERROR.AUTHENTICATION_ERROR),
  permissionErrorHandler: buildErrorHandler(httpStatusCodeHandler.HTTP_STATUS_CODE.ERROR.PERMISSION_ERROR),
  serverErrorHandler: buildErrorHandler(httpStatusCodeHandler.HTTP_STATUS_CODE.ERROR.SERVER_ERROR),
};

class CustomError extends Error {
  statusCode: errorCodeType;

  constructor({ description, statusCode }: { description: string; statusCode: errorCodeType }) {
    super(description);
    this.statusCode = statusCode;
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
