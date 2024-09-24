import { fileSystem } from '../fileSystem';
import { loggerType } from './loggerType';
import { prettyLogFormatter } from './prettyLogFormatter';

export { prodLogger };

const prodLogger: loggerType = {
  async log({
    operationName,
    msg,
    data,
  }: {
    operationName: string;
    msg: string;
    data?: Record<string, unknown>;
  }) {
    const prettyValue = prettyLogFormatter.formatLog({
      level: 'info',
      operationName,
      msg,
      data,
    });
    // eslint-disable-next-line no-console
    console.log(prettyValue);
    try {
      await fileSystem.appendToFile('./logs.txt', `${prettyValue}\n`);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
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
    const prettyError = prettyLogFormatter.formatLog({
      level: 'error',
      operationName,
      msg,
      data,
    });
    // eslint-disable-next-line no-console
    console.error(prettyError);
    try {
      await fileSystem.appendToFile('./errors.txt', `${prettyError}\n`);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  },
};
