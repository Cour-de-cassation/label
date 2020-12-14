import { fileSystem } from '../fileSystem';
import { loggerType } from './loggerType';
import { getFormattedDate, getFormattedError } from './utils';

export { prodLogger };

const prodLogger: loggerType = {
  log(value) {
    // eslint-disable-next-line no-console
    console.log(getFormattedDate(), JSON.stringify(value, null, 2));
  },
  error(errorText) {
    // eslint-disable-next-line no-console
    console.error(getFormattedDate(), errorText);
    fileSystem.appendToFile('./errors.log', getFormattedError(errorText));
  },
};
