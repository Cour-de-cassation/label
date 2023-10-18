import { documentType } from '@label/core';
import { logger } from '../../utils';
import { buildDocumentRepository } from '../../modules/document';
// import { extractRoute } from '../../../../../courDeCassation/src/connector/mapper/extractors/extractRoute/extractRoute'
// import { extractRoute } from '@label/cour-de-cassation/src/connector/mapper/extractors'


export { updateRoute };

async function updateRoute(
  status: documentType['status'],
) {
  logger.log(`Update route of documents with status ${status}`);

  const documentRepository = buildDocumentRepository();

  const documentsToUpdate = await documentRepository.findAllByStatus([status]);
  logger.log(`${documentsToUpdate.length} documents to update route`);

  // for (let index = 0; index < documentsToUpdate.length; index++) {
  //   let newRoute = extractRoute(
  //     {
  //       additionalTermsToAnnotate: documentsToUpdate[index].decisionMetadata.additionalTermsToAnnotate,
  //       session: documentsToUpdate[index].decisionMetadata.session,
  //       solution: documentsToUpdate[index].decisionMetadata.solution,
  //       publicationCategory: documentsToUpdate[index].publicationCategory,
  //       chamberName: documentsToUpdate[index].decisionMetadata.chamberName,
  //       civilMatterCode: documentsToUpdate[index].decisionMetadata.civilMatterCode,
  //       civilCaseCode: documentsToUpdate[index].decisionMetadata.civilCaseCode,
  //       criminalCaseCode: documentsToUpdate[index].decisionMetadata.criminalCaseCode,
  //       NACCode: documentsToUpdate[index].decisionMetadata.NACCode,
  //       endCaseCode: documentsToUpdate[index].decisionMetadata.endCaseCode,
  //     },
  //     documentsToUpdate[index].source
  //   );

  //   documentRepository.updateRouteById(
  //     documentsToUpdate[index]._id,
  //     newRoute
  //   )
  // }
}
