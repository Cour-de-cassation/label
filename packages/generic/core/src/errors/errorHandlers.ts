export { CustomError, errorHandlers, ERROR_CODE };

export type { errorCodeType };

type errorCodeType = typeof ERROR_CODE[keyof typeof ERROR_CODE];

const ERROR_CODE = {
  AUTHENTICATION_ERROR: 401,
  PERMISSION_ERROR: 403,
  SERVER_ERROR: 500,
} as const;

const errorHandlers = {
  authenticationErrorHandler: buildErrorHandler(ERROR_CODE.AUTHENTICATION_ERROR),
  permissionErrorHandler: buildErrorHandler(ERROR_CODE.PERMISSION_ERROR),
  serverErrorHandler: buildErrorHandler(ERROR_CODE.SERVER_ERROR),
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
