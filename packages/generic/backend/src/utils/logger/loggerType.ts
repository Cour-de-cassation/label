export type { loggerType };

type loggerType = {
  log: (value: any) => void;
  error: (err: any) => void;
};
