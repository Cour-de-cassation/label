import { documentType, documentModule } from '@label/core';
import { sderCourtDecisionType } from '../api';

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

  return documentModule.lib.buildDocument({
    creationDate: new Date(),
    documentId: sderCourtDecision.sourceId,
    metadata: '',
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
