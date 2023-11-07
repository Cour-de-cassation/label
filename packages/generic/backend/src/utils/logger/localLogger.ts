import { loggerType } from './loggerType';
import { prettyLogFormatter } from './prettyLogFormatter';

export { localLogger };

const localLogger: loggerType = {
  async log({
    operationName,
    msg,
    data,
  }: {
    operationName: string;
    msg: string;
    data?: Record<string, unknown>;
  }) {
    // eslint-disable-next-line no-console
    console.log(
      prettyLogFormatter.formatLog({ level: 'info', operationName, msg, data }),
    );
  },
  async error({
    operationName,
    msg,
    data,
  }: {
    operationName: string;
    msg: string;
    data?: Record<string, unknown>;
  }) {
    // eslint-disable-next-line no-console
    console.error(
      prettyLogFormatter.formatLog({
        level: 'error',
        operationName,
        msg,
        data,
      }),
    );
  },
};
