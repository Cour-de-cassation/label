import { buildAnnotator, annotatorConfigType } from './lib/annotator';
import { buildConnector, connectorConfigType } from './lib/connector';
import { buildMongo, fileSystem } from './utils';
import { buildBackend } from './app';

export { buildAnnotator, buildBackend, buildConnector, buildMongo, fileSystem };

export type { annotatorConfigType, connectorConfigType };
