export { httpStatusCodeHandler };

const HTTP_STATUS_CODE = {
  SUCCESS: {
    OK: 200,
    CREATED: 201,
  },
  ERROR: {
    AUTHENTICATION_ERROR: 401,
    PERMISSION_ERROR: 403,
    NOT_FOUND_ERROR: 404,
    SERVER_ERROR: 500,
  },
} as const;

const httpStatusCodeHandler = {
  HTTP_STATUS_CODE,
  isError(statusCode: number) {
    return (Object.values(HTTP_STATUS_CODE.ERROR) as number[]).includes(statusCode);
  },
  isSuccess(statusCode: number) {
    return (Object.values(HTTP_STATUS_CODE.SUCCESS) as number[]).includes(statusCode);
  },
  merge(statusCodes: number[]) {
    return statusCodes.reduce(
      (returnedStatusCode, statusCode) => (this.isError(statusCode) ? statusCode : returnedStatusCode),
      HTTP_STATUS_CODE.SUCCESS.OK,
    );
  },
};
