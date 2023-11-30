export type { loggerType };

type loggerType = {
  log: ({
    operationName,
    msg,
    data,
  }: {
    operationName: string;
    msg: string;
    data?: Record<string, unknown>;
  }) => Promise<void>;
  error: ({
    operationName,
    msg,
    data,
  }: {
    operationName: string;
    msg: string;
    data?: Record<string, unknown>;
  }) => Promise<void>;
};
