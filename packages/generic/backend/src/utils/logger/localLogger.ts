import { loggerType } from './loggerType';
import { prettyLogFormatter } from './prettyLogFormatter';

export { localLogger };

const localLogger: loggerType = {
  log(value) {
    // eslint-disable-next-line no-console
    console.log(prettyLogFormatter.formatLog(value));
  },
  error(errorText) {
    // eslint-disable-next-line no-console
    console.error(prettyLogFormatter.formatErrorLog(errorText));
  },
};
