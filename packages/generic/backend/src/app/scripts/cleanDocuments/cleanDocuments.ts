import { logger } from '../../../utils';
import { cleanAssignations } from './cleanAssignations';
import { cleanAssignedDocuments } from './cleanAssignedDocuments';
import { cleanDoubledDocuments } from './cleanDoubledDocuments';
import { cleanFreeDocuments } from './cleanFreeDocuments';
import { cleanLoadedDocuments } from './cleanLoadedDocuments';
import { cleanTreatments } from './cleanTreatments';

export { cleanDocuments };

async function cleanDocuments() {
  logger.log(`cleanDocuments`);

  await cleanDoubledDocuments();

  await cleanAssignedDocuments();

  await cleanTreatments();

  await cleanAssignations();

  await cleanFreeDocuments();

  await cleanLoadedDocuments();

  logger.log(`cleanDocuments done!`);
}
