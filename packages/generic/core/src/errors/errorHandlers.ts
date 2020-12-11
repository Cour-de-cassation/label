export { errorHandlers, ERROR_CODE };

export type { errorCodeType };

type errorCodeType = typeof ERROR_CODE[number];

const ERROR_CODE = ['AUTHENTICATION_ERROR', 'PERMISSION_ERROR'] as const;

const errorHandlers = {
  authenticationErrorHandler: buildErrorHandler('AUTHENTICATION_ERROR'),
  permissionErrorHandler: buildErrorHandler('PERMISSION_ERROR'),
};

class CustomError extends Error {
  description: string;

  constructor({ code, description }: { code: string; description: string }) {
    super(code);
    this.description = description;
  }
}

function buildErrorHandler(code: errorCodeType) {
  return { build, check };

  function build(description: string) {
    return new CustomError({ code, description });
  }

  function check(anotherCode: errorCodeType) {
    return anotherCode === code;
  }
}
