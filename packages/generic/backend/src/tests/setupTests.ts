import { clearDb } from '../app/scripts';

global.beforeEach(async () => {
  await clearDb({});
});
