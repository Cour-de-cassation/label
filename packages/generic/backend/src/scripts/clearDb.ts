import { scriptRunner } from '../utils';
import { clearAllRepositories } from './lib';

scriptRunner.run(clearAllRepositories, { shouldLoadDb: true });
