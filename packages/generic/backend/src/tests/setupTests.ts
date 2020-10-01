import '@babel/polyfill';
import { clearAllRepositories } from '../scripts/lib';

global.beforeEach(async () => {
  await clearAllRepositories();
});
