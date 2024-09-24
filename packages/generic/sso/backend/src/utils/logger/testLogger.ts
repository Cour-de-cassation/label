import { loggerType } from './loggerType';

export { testLogger };

const testLogger: loggerType = {
  async log() {
    return;
  },
  async error() {
    return;
  },
};
