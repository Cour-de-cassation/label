import { environmentType, settingsModule } from '@label/core';
import { promises as fs } from 'fs';
import yargs from 'yargs';

export { parametersHandler };

const parametersHandler = {
  getCommandParameters,
  getParameters,
};

async function getParameters() {
  const { environmentFile, settingsFile } = getCommandParameters();

  const environment = await fs.readFile(environmentFile, {
    encoding: 'utf8',
  });
  const settings = await fs.readFile(settingsFile, {
    encoding: 'utf8',
  });

  const parsedSettings = settingsModule.lib.parseFromJson(settings);
  const enhancedSettings = settingsModule.lib.additionalAnnotationCategoryHandler.addCategoryToSettings(
    parsedSettings,
  );

  return {
    environment: JSON.parse(environment) as environmentType,
    settings: enhancedSettings,
  };
}

function getCommandParameters() {
  const argv = yargs
    .options({
      environment: {
        alias: 'e',
        demandOption: true,
        description: 'Environment of LABEL',
        type: 'string',
      },
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
    environmentFile: argv.environment as string,
    settingsFile: argv.settings as string,
  };
}
