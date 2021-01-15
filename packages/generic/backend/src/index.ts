import { buildAnnotator, annotatorConfigType } from './lib/annotator';
import { buildConnector, connectorConfigType } from './lib/connector';
import { buildMongo, fileSystem, scriptRunner } from './utils';

export { buildAnnotator, buildConnector, buildMongo, fileSystem, scriptRunner };

export type { annotatorConfigType, connectorConfigType };
