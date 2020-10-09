import { settingsLoader } from '../../../../lib/settingsLoader';

export { resolveSettings };

function resolveSettings() {
  return {
    json: JSON.stringify(settingsLoader.getSettings()),
  };
}
