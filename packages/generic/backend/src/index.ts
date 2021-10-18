import { buildAnnotator, annotatorConfigType } from './lib/annotator';
import { buildConnector, connectorConfigType } from './lib/connector';
import {
  buildExporter,
  exporterConfigType,
  labelTreatmentsType,
} from './lib/exporter';
import { settingsLoader } from './lib/settingsLoader';
import { buildMongo, dependencyManager, fileSystem, logger } from './utils';
import { buildBackend } from './app';

export {
  buildAnnotator,
  buildBackend,
  buildConnector,
  buildExporter,
  buildMongo,
  dependencyManager,
  fileSystem,
  logger,
  settingsLoader,
};

export type {
  annotatorConfigType,
  connectorConfigType,
  exporterConfigType,
  labelTreatmentsType,
};
