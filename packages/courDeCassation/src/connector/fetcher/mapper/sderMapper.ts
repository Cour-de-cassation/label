import { decisionType } from 'sder';
import { documentType, documentModule, timeOperator } from '@label/core';

export { sderMapper };

const sderMapper = { mapCourtDecisionToDocument };

function mapCourtDecisionToDocument(
  sderCourtDecision: decisionType,
): documentType {
  const title = computeTitleFromParsedCourtDecision({
    number: sderCourtDecision.registerNumber,
    chamber: sderCourtDecision.chamberName,
    juridiction: sderCourtDecision.jurisdictionName,
    date: sderCourtDecision.dateDecision,
  });

  const priority = computePriority(sderCourtDecision.sourceName);

  return documentModule.lib.buildDocument({
    creationDate: new Date(),
    documentId: sderCourtDecision.sourceId,
    metadata: '',
    priority,
    publicationCategory:
      (sderCourtDecision.zoning &&
        sderCourtDecision.zoning.introduction_subzonage &&
        sderCourtDecision.zoning.introduction_subzonage.publication) ||
      [],
    source: sderCourtDecision.sourceName,
    title,
    text: sderCourtDecision.originalText,
  });
}

function computeTitleFromParsedCourtDecision({
  number,
  chamber,
  juridiction,
  date,
}: {
  number?: string;
  chamber?: string;
  juridiction?: string;
  date?: Date;
}) {
  const readableNumber = `Décision n°${number}`;
  const readableChamber = convertChamberIntoReadableChamber(chamber);
  const readableDate = convertRawDateIntoReadableDate(date);
  const title = [readableNumber, juridiction, readableChamber, readableDate]
    .filter(Boolean)
    .join(' · ');
  return title;
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

function convertChamberIntoReadableChamber(chamber: string | undefined) {
  if (!chamber) {
    return '';
  }
  if (chamber && chamber.match(/CIV\.[1-3]/)) {
    return 'Chambre civile';
  } else if (chamber === 'SOC') {
    return 'Chambre sociale';
  }
  return '';
}

function computePriority(source: string): documentType['priority'] {
  switch (source) {
    case 'jurinet':
      return 'medium';
    default:
      return 'low';
  }
}
