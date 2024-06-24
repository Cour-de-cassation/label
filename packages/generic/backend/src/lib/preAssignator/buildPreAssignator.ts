import { documentType, idModule } from '@label/core';
import { logger } from '../../utils';
import { preAssignationService } from '../../modules/preAssignation';
import { assignationService } from '../../modules/assignation';
import { documentService } from '../../modules/document';

export { buildPreAssignator };

function buildPreAssignator() {
  return {
    preAssignDocument,
  };

  async function preAssignDocument(document: documentType): Promise<boolean> {
    logger.log({
      operationName: 'preAssignation',
      msg: `Starting preAssignation for document ${document.source} ${document.documentNumber}`,
    });

    if (document.status === 'nlpAnnotating' || document.status === 'loaded') {
      logger.log({
        operationName: 'preAssignation',
        msg: `in preassignation`,
      });
      const preAssignationForDocument =
        (await preAssignationService.fetchPreAssignationBySourceAndNumber(
          document.documentNumber.toString(),
          document.source,
        )) ||
        (await preAssignationService.fetchPreAssignationBySourceAndNumber(
          document.decisionMetadata.appealNumber,
          document.source,
        ));

      if (preAssignationForDocument != undefined) {
        logger.log({
          operationName: 'preAssignation',
          msg: `Pre-assignation found for document ${document.source} ${document.documentNumber}. Matching pre-assignation number : ${preAssignationForDocument.number}. Creating assignation...`,
        });
        await assignationService.createAssignation({
          documentId: idModule.lib.buildId(document._id),
          userId: idModule.lib.buildId(preAssignationForDocument.userId),
        });
        await preAssignationService.deletePreAssignation(
          preAssignationForDocument._id,
        );
        if (document.route === 'automatic' || document.route === 'simple') {
          await documentService.updateDocumentRoute(
            idModule.lib.buildId(document._id),
            'exhaustive',
          );
        }
        await documentService.updateDocumentStatus(
          idModule.lib.buildId(document._id),
          'saved',
        );

        return true;
      } else {
        logger.log({
          operationName: 'preAssignation',
          msg: `Pre-assignation not found for document ${document.source} ${document.documentNumber}`,
        });
        return false;
      }
    } else {
      logger.log({
        operationName: 'preAssignation',
        msg: `out preassignation`,
      });
      throw new Error(
        'Document status must be loaded or nlpAnnotating before pre-assign it',
      );
    }
  }
}
