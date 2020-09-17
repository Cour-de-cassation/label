import { loggerType } from './loggerType';

export { localLogger };

const localLogger: loggerType = {
  log(value) {
    console.log(new Date().toISOString(), JSON.stringify(value, null, 2));
  },
};
