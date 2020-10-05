import { loggerType } from './loggerType';

export { localLogger };

const localLogger: loggerType = {
  log(value) {
    // eslint-disable-next-line no-console
    console.log(new Date().toISOString(), JSON.stringify(value, null, 2));
  },
};
