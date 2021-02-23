import { documentType, documentModule } from '@label/core';
import { sderCourtDecisionType } from '../../../sderApi';

export { sderMapper };

const sderMapper = { mapCourtDecisionToDocument };

function mapCourtDecisionToDocument(
  sderCourtDecision: sderCourtDecisionType,
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
  date?: string;
}) {
  const readableNumber = `Décision n°${number}`;
  const readableChamber = convertChamberIntoReadableChamber(chamber);
  const title = [readableNumber, juridiction, readableChamber, date]
    .filter(Boolean)
    .join(' · ');
  return title;
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
