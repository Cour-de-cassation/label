import { loggerType } from './loggerType';
import { getFormattedDate } from './utils';

export { localLogger };

const localLogger: loggerType = {
  log(value) {
    // eslint-disable-next-line no-console
    console.log(getFormattedDate(), JSON.stringify(value, null, 2));
  },
  error(errorText) {
    // eslint-disable-next-line no-console
    console.error(getFormattedDate(), errorText);
  },
};
