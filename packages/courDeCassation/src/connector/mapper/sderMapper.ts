import { decisionType } from 'sder';
import {
  documentType,
  documentModule,
  idModule,
  timeOperator,
} from '@label/core';
import { extractReadableChamberName, extractReadableJurisdictionName } from './extractors';

export { sderMapper };

const sderMapper = { mapCourtDecisionToDocument };

function mapCourtDecisionToDocument(
  sderCourtDecision: decisionType,
  ): documentType {
  const readableChamberName = extractReadableChamberName(
    {chamberName: sderCourtDecision.chamberName,
    chamberId: sderCourtDecision.chamberId
    },
  );
  const readableJurisdictionName = extractReadableJurisdictionName(
    sderCourtDecision.jurisdictionName,
  );
  const title = computeTitleFromParsedCourtDecision({
    number: sderCourtDecision.sourceId,
    readableChamberName,
    readableJurisdictionName,
    date: sderCourtDecision.dateDecision
      ? new Date(sderCourtDecision.dateDecision)
      : undefined,
  });

  const publicationCategory = computePublicationCategory(sderCourtDecision.pubCategory, sderCourtDecision.publication)

  const priority = computePriority(
    sderCourtDecision.sourceName,
    publicationCategory,
  );

  const criticity = computeCriticity();

  return documentModule.lib.buildDocument({
    creationDate: new Date().getTime(),
    criticity,
    decisionMetadata: {
      additionalTermsToAnnotate: sderCourtDecision.occultation?.additionalTerms || '',
      boundDecisionDocumentNumbers: sderCourtDecision.decatt || [],
      categoriesToOmit: sderCourtDecision.occultation?.categoriesToOmit || [],
      chamberName: readableChamberName,
      juridiction: readableJurisdictionName,
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
  readableChamberName,
  readableJurisdictionName,
  date,
}: {
  number?: number;
  readableChamberName: string;
  readableJurisdictionName: string;
  date?: Date;
}) {
  const readableNumber = `Décision n°${number}`;
  const readableDate = convertRawDateIntoReadableDate(date);
  const title = [
    readableNumber,
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

function computePublicationCategory(pubCategory: string | undefined, publication: string[] | undefined) {
  const publicationCategory: string[] = [];
  if(!!pubCategory) {
    publicationCategory.push(pubCategory);
  }
  if(!!publication) {
    publicationCategory.push(...publication)
  }
  return publicationCategory
}

function convertRawDateIntoReadableDate(rawDate: Date | undefined) {
  if (!rawDate) {
    return undefined;
  }
  if (isNaN(rawDate.getTime())) {
    return undefined;
  }
  return timeOperator.convertTimestampToReadableDate(rawDate.getTime());
}

function computePriority(
  source: string,
  publicationCategory: string[],
): documentType['priority'] {
  if (
    documentModule.lib.publicationHandler.mustBePublished(publicationCategory)
  ) {
    return 'high';
  }
  switch (source) {
    case 'jurinet':
      return 'medium';
    default:
      return 'low';
  }
}
