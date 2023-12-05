export { prettyLogFormatter };

const prettyLogFormatter = {
  formatLog({
    level,
    operationName,
    msg,
    data,
  }: {
    level: 'info' | 'error';
    operationName: string;
    msg: string;
    data?: Record<string, unknown>;
  }) {
    return `${JSON.stringify({
      level,
      datetime: new Date().toISOString(),
      operationName,
      msg,
      data,
    })}`;
  },
};
