export type { loggerType };

type loggerType = {
  log: (value: any) => void;
  error: (error: any) => void;
};
