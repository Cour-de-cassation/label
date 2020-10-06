import { anonymizationSettingsLoader } from '../../../../lib/anonymizationSettingsLoader';

export { resolveAnonymizationSettings };

function resolveAnonymizationSettings() {
  return {
    json: JSON.stringify(
      anonymizationSettingsLoader.getAnonymizationSettings(),
    ),
  };
}
