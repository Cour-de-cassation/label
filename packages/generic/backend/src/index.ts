import { buildAnnotator, annotatorConfigType } from './lib/annotator';
import { buildConnector, connectorConfigType } from './lib/connector';
import {
  buildExporter,
  exporterConfigType,
  labelTreatmentsType,
} from './lib/exporter';
import { settingsLoader } from './lib/settingsLoader';
import {
  buildMongo,
  dateBuilder,
  dependencyManager,
  fileSystem,
} from './utils';
import { buildBackend } from './app';

export {
  buildAnnotator,
  buildBackend,
  buildConnector,
  buildExporter,
  buildMongo,
  dateBuilder,
  dependencyManager,
  fileSystem,
  settingsLoader,
};

export type {
  annotatorConfigType,
  connectorConfigType,
  exporterConfigType,
  labelTreatmentsType,
};
