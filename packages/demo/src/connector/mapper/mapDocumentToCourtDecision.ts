import { decisionModule, decisionType } from 'sder';
import { documentType, idModule } from '@label/core';

export { mapDocumentToCourtDecision };

function mapDocumentToCourtDecision(document: documentType): decisionType {
  let dateDecision;
  if (document.decisionMetadata.date) {
    dateDecision = new Date();
    dateDecision.setTime(document.decisionMetadata.date);
  }
  let dateCreation;
  if (document.creationDate) {
    dateCreation = new Date();
    dateCreation.setTime(document.creationDate);
  }

  return decisionModule.lib.generateDecision({
    _id: idModule.lib.buildId(document.externalId),
    blocOccultation: document.decisionMetadata.occultationBlock,
    chamberName: document.decisionMetadata.chamberName,
    dateCreation: dateCreation?.toISOString(),
    dateDecision: dateDecision?.toISOString(),
    decatt: document.decisionMetadata.boundDecisionDocumentNumbers,
    formation: document.decisionMetadata.session,
    jurisdictionName: document.decisionMetadata.jurisdiction,
    labelStatus: 'toBeTreated',
    natureAffaireCivil: document.decisionMetadata.civilCaseCode,
    natureAffairePenal: document.decisionMetadata.criminalCaseCode,
    codeMatiereCivil: document.decisionMetadata.civilMatterCode,
    originalText: document.text,
    labelTreatments: [],
    occultation: {
      additionalTerms: document.decisionMetadata.additionalTermsToAnnotate,
      categoriesToOmit: document.decisionMetadata.categoriesToOmit,
    },
    publication: document.publicationCategory.filter(
      (publicationCategoryLetter) =>
        ['B', 'R', 'L', 'C'].includes(publicationCategoryLetter),
    ),
    pubCategory: document.publicationCategory.find(
      (publicationCategoryLetter) =>
        !['B', 'R', 'L', 'C'].includes(publicationCategoryLetter),
    ),
    sourceId: document.documentNumber,
    sourceName: document.source,
    solution: document.decisionMetadata.solution,
  });
}
