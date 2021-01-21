import { settingsType } from '@label/core';

export { settingsLoader };

const settingsLoader = buildSettingsLoader();

function buildSettingsLoader() {
  let settings: settingsType = {};

  return {
    getSettings,
    setSettings,
  };

  function getSettings() {
    return settings;
  }

  async function setSettings(newSettings: settingsType) {
    settings = newSettings;
  }
}
