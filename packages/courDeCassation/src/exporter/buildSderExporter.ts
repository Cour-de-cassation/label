import { buildExporter } from '@label/backend';
import { settingsType } from '@label/core';
import { exporterConfig } from './exporterConfig';

export { buildSderExporter };

function buildSderExporter(settings: settingsType) {
  return buildExporter(exporterConfig, settings);
}
