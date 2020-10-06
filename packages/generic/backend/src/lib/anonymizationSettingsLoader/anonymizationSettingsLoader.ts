import { promises as fs } from 'fs';
import { anonymizationSettingsType } from '@label/core';

export { anonymizationSettingsLoader };

const anonymizationSettingsLoader = buildAnonymizationSettingsLoader();

const PATH_TO_ANONYMIZATION_SETTINGS = `./settings/anonymisationSettings.json`;

function buildAnonymizationSettingsLoader() {
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
