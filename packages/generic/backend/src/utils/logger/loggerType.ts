export type { loggerType };

type loggerType = {
  log: (value: any) => void;
  error: (errorText: string) => void;
};
