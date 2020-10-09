import { settingsType } from "../settingsType";

export { buildSettings };

export type { partialSettingsType };

type partialSettingsType = {
  [category: string]:
    | {
        anonymizationTexts?: string[];
        color?: string;
      }
    | undefined;
};

function buildSettings(partialSettings: partialSettingsType = {}) {
  const settings: settingsType = {};

  Object.keys(partialSettings).forEach(
    (category) =>
      (settings[category] = {
        anonymizationTexts: buildAnonymizationTexts(
          partialSettings[category]?.anonymizationTexts
        ),
        color: buildColor(partialSettings[category]?.color),
      })
  );

  return settings;
}

function buildAnonymizationTexts(anonymizationTexts: string[] | undefined) {
  return anonymizationTexts ? anonymizationTexts : [];
}

function buildColor(color: string | undefined) {
  return color ? color : "000000";
}
