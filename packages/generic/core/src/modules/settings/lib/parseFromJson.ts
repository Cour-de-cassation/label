import { settingsType } from '../settingsType';
import { buildSettings, partialSettingsType } from './buildSettings';

export { parseFromJson };

function parseFromJson(json: string): settingsType {
  const partialSettings = JSON.parse(json) as partialSettingsType;
  return buildSettings(partialSettings);
}
