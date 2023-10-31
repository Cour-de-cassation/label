import { buildDocumentRepository } from '../../modules/document';
import { buildTreatmentRepository } from '../../modules/treatment';
import { logger } from '../../utils';

export { cleanOrphansTreatments };

/*
  Clean treatments with no document associated
*/

async function cleanOrphansTreatments() {
  const treatmentRepository = buildTreatmentRepository();
  const documentRepository = buildDocumentRepository();

  const date = new Date();
  date.setMonth(date.getMonth() - 6);

  const treatments = await treatmentRepository.findAllByLastUpdateDateLessThan(
    date.getTime(),
  );
  logger.log(
    `Find ${treatments.length} treatments with lastUpdateDate more than 6 months ago.`,
  );

  for (let i = 0; i < treatments.length; i++) {
    try {
      await documentRepository.findById(treatments[i].documentId);
      logger.log(`Document found for treatment ${treatments[i]._id}.`);
    } catch (error) {
      logger.log(`Document NOT found for treatment ${treatments[i]._id} ! `);
      await treatmentRepository.deleteById(treatments[i]._id);
      logger.log(`Treatment ${treatments[i]._id} deleted.`);
    }
  }
}
