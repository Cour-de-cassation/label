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
import { treatmentService } from './modules/treatment';

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
  treatmentService,
};

export type {
  annotatorConfigType,
  connectorConfigType,
  exporterConfigType,
  labelTreatmentsType,
};
