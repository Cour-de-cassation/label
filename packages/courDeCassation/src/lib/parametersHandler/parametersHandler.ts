import { settingsModule } from '@label/core';
import { promises as fs } from 'fs';
import yargs from 'yargs';

export { parametersHandler };

const parametersHandler = {
  getCommandParameters,
  getParameters,
};

async function getParameters() {
  const { settingsFile } = getCommandParameters();

  const settings = await fs.readFile(settingsFile, {
    encoding: 'utf8',
  });

  const parsedSettings = settingsModule.lib.parseFromJson(settings);
  const enhancedSettings = settingsModule.lib.motivationCategoryHandler.addCategoryToSettings(
    settingsModule.lib.additionalAnnotationCategoryHandler.addCategoryToSettings(
      parsedSettings,
    ),
  );

  return {
    settings: enhancedSettings,
  };
}

function getCommandParameters() {
  const argv = yargs
    .options({
      settings: {
        alias: 's',
        demandOption: true,
        description: 'Settings of LABEL',
        type: 'string',
      },
    })
    .help()
    .alias('help', 'h').argv;

  return {
    settingsFile: argv.settings as string,
  };
}
