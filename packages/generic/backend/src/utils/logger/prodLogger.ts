import { fileSystem } from '../fileSystem';
import { loggerType } from './loggerType';
import { prettyLogFormatter } from './prettyLogFormatter';

export { prodLogger };

const prodLogger: loggerType = {
  async log(value) {
    const prettyValue = prettyLogFormatter.formatLog(value);
    // eslint-disable-next-line no-console
    console.log(prettyValue);
    try {
      await fileSystem.appendToFile('./logs.txt', `${prettyValue}\n`);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  },

  async error(errorText) {
    const prettyError = prettyLogFormatter.formatErrorLog(errorText);
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
