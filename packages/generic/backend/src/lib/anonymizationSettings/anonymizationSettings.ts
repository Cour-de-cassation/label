import { promises as fs } from 'fs';
import { anonymizationSettingsType } from '@label/core';

export { anonymizationSettings };

const anonymizationSettings = buildAnonymizationSettings();

const PATH_TO_ANONYMIZATION_SETTINGS = `./settings/anonymisationSettings.json`;

function buildAnonymizationSettings() {
  let anonymizationSettings: anonymizationSettingsType = {};

  return {
    loadAnonymizationSettings,
    getAnonymizationSettings,
  };

  async function loadAnonymizationSettings() {
    anonymizationSettings = JSON.parse(
      await fs.readFile(PATH_TO_ANONYMIZATION_SETTINGS, {
        encoding: 'utf8',
      }),
    ) as anonymizationSettingsType;
  }

  function getAnonymizationSettings() {
    return anonymizationSettings;
  }
}
