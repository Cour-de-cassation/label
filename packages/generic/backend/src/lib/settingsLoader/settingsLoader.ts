import { promises as fs } from 'fs';
import { settingsType } from '@label/core';

export { settingsLoader };

const settingsLoader = buildSettingsLoader();

const PATH_TO_SETTINGS = `./settings/settings.json`;

function buildSettingsLoader() {
  let settings: settingsType = {};

  return {
    loadSettings,
    getSettings,
  };

  async function loadSettings() {
    settings = JSON.parse(
      await fs.readFile(PATH_TO_SETTINGS, {
        encoding: 'utf8',
      }),
    ) as settingsType;
  }

  function getSettings() {
    return settings;
  }
}
