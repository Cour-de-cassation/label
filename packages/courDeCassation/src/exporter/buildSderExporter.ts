import { buildExporter } from '@label/backend';
import { environmentType, settingsType } from '@label/core';
import { exporterConfig } from './exporterConfig';

export { buildSderExporter };

function buildSderExporter(
  environment: environmentType,
  settings: settingsType,
) {
  return buildExporter(environment, exporterConfig, settings);
}
