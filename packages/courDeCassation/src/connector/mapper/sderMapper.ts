import { decisionType } from 'sder';
import {
  documentType,
  documentModule,
  idModule,
  timeOperator,
} from '@label/core';
import {
  extractReadableChamberName,
  extractReadableJurisdictionName,
  extractAppealNumber,
} from './extractors';
import { categoriesMapper } from './categoriesMapper';

export { sderMapper };

const sderMapper = { mapCourtDecisionToDocument };

function mapCourtDecisionToDocument(
  sderCourtDecision: decisionType,
): documentType {
  const readableChamberName = extractReadableChamberName({
    chamberName: sderCourtDecision.chamberName,
    chamberId: sderCourtDecision.chamberId,
  });
  const readableJurisdictionName = extractReadableJurisdictionName(
    sderCourtDecision.jurisdictionName,
  );
  const appealNumber = extractAppealNumber(sderCourtDecision.originalText);

  const decisionDate = convertToValidDate(sderCourtDecision.dateDecision);

  const title = computeTitleFromParsedCourtDecision({
    number: sderCourtDecision.sourceId,
    appealNumber,
    readableChamberName,
    readableJurisdictionName,
    date: decisionDate,
  });

  const publicationCategory = computePublicationCategory(
    sderCourtDecision.pubCategory,
    sderCourtDecision.publication,
  );

  const priority = computePriority(
    sderCourtDecision.sourceName,
    publicationCategory,
  );

  const criticity = computeCriticity();

  const categoriesToOmit = categoriesMapper.mapSderCategoriesToLabelCategories(
    sderCourtDecision.occultation?.categoriesToOmit,
  );

  return documentModule.lib.buildDocument({
    creationDate: new Date().getTime(),
    criticity,
    decisionMetadata: {
      appealNumber: appealNumber || '',
      additionalTermsToAnnotate:
        sderCourtDecision.occultation?.additionalTerms || '',
      boundDecisionDocumentNumbers: sderCourtDecision.decatt || [],
      categoriesToOmit,
      chamberName: readableChamberName,
      date: decisionDate?.getTime(),
      jurisdiction: readableJurisdictionName,
      occultationBlock: sderCourtDecision.blocOccultation || undefined,
      session: sderCourtDecision.formation || '',
      solution: sderCourtDecision.solution,
    },
    documentNumber: sderCourtDecision.sourceId,
    externalId: idModule.lib.convertToString(sderCourtDecision._id),
    metadata: '',
    priority,
    publicationCategory,
    source: sderCourtDecision.sourceName,
    title,
    text: sderCourtDecision.originalText,
  });
}

function computeTitleFromParsedCourtDecision({
  number,
  appealNumber,
  readableChamberName,
  readableJurisdictionName,
  date,
}: {
  number: number;
  appealNumber: string | undefined;
  readableChamberName: string;
  readableJurisdictionName: string;
  date?: Date;
}) {
  const readableNumber = `Décision n°${number}`;
  const readableAppealNumber = appealNumber
    ? `pourvoi n°${appealNumber}`
    : undefined;
  const readableDate = date
    ? timeOperator.convertTimestampToReadableDate(date.getTime())
    : undefined;
  const title = [
    readableNumber,
    readableAppealNumber,
    readableJurisdictionName,
    readableChamberName,
    readableDate,
  ]
    .filter(Boolean)
    .join(' · ');
  return title;
}

function computeCriticity() {
  return 1;
}

function computePublicationCategory(
  pubCategory: string | undefined,
  publication: string[] | undefined,
) {
  const publicationCategory: string[] = [];
  if (!!pubCategory) {
    publicationCategory.push(pubCategory);
  }
  if (!!publication) {
    publicationCategory.push(...publication);
  }
  return publicationCategory;
}

function computePriority(
  source: string,
  publicationCategory: string[],
): documentType['priority'] {
  if (
    documentModule.lib.publicationHandler.mustBePublished(publicationCategory)
  ) {
    return 4;
  }
  switch (source) {
    case 'jurinet':
      return 2;
    default:
      return 0;
  }
}

function convertToValidDate(date: string | undefined) {
  if (!date) {
    return undefined;
  }

  const convertedDate = new Date(date);
  if (isNaN(convertedDate.valueOf())) {
    return undefined;
  }
  return convertedDate;
}
