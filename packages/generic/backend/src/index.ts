import { buildAnnotator, annotatorConfigType } from './lib/annotator';
import { buildConnector, connectorConfigType } from './lib/connector';
import { dependencyManager, fileSystem, scriptRunner } from './utils';

export {
  buildAnnotator,
  buildConnector,
  dependencyManager,
  fileSystem,
  scriptRunner,
};

export type { annotatorConfigType, connectorConfigType };
