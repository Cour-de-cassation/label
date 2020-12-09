export { errorHandlers };

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

function buildErrorHandler(code: string) {
  return { build, check };

  function build(description: string) {
    return new CustomError({ code, description });
  }

  function check(anotherCode: string) {
    return anotherCode === code;
  }
}
