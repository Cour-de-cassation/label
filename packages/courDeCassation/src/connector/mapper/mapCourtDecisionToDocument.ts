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
import { extractRoute } from './extractors/extractRoute';
import { categoriesMapper } from './categoriesMapper';

export { mapCourtDecisionToDocument };

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
async function mapCourtDecisionToDocument(
  sderCourtDecision: decisionType,
  importer: documentType['importer'],
): Promise<documentType> {
  const readableChamberName = extractReadableChamberName({
    chamberName: sderCourtDecision.chamberName,
    chamberId: sderCourtDecision.chamberId,
  });
  const readableJurisdictionName = extractReadableJurisdictionName(
    sderCourtDecision.jurisdictionName,
  );
  const appealNumber = extractAppealNumber(sderCourtDecision.originalText);

  const creationDate = convertToValidDate(sderCourtDecision.dateCreation);

  const decisionDate = convertToValidDate(sderCourtDecision.dateDecision);

  const source = sderCourtDecision.sourceName;

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

  const categoriesToOmit = categoriesMapper.mapSderCategoriesToLabelCategories(
    sderCourtDecision.occultation?.categoriesToOmit,
  );

  const solution = sderCourtDecision.solution
    ? sderCourtDecision.solution.trim()
    : '';

  const session = sderCourtDecision.formation?.trim() || '';

  const additionalTermsToAnnotate =
    sderCourtDecision.occultation?.additionalTerms || '';
  const civilCaseCode = sderCourtDecision.natureAffaireCivil?.trim() || '';
  const civilMatterCode = sderCourtDecision.codeMatiereCivil?.trim() || '';
  const criminalCaseCode = sderCourtDecision.natureAffairePenal?.trim() || '';
  const NACCode = sderCourtDecision.NACCode || '';
  const endCaseCode = sderCourtDecision.endCaseCode || '';

  const priority = computePriority(
    sderCourtDecision.sourceName,
    publicationCategory,
    NACCode,
    importer,
  );

  const route = extractRoute(
    {
      additionalTermsToAnnotate,
      solution,
      parties: sderCourtDecision.parties,
      publicationCategory,
      chamberName: readableChamberName,
      civilMatterCode,
      session,
      civilCaseCode,
      criminalCaseCode,
      NACCode,
      endCaseCode,
    },
    source,
  );

  const zoningZones = {
    'introduction': sderCourtDecision.originalTextZoning?.zones?.introduction || undefined,
    'moyens': sderCourtDecision.originalTextZoning?.zones?.moyens || undefined,
    'expose du litige': sderCourtDecision.originalTextZoning?.zones?.['expose du litige'] || undefined,
    'motivations': sderCourtDecision.originalTextZoning?.zones?.motivations || undefined,
    'dispositif': sderCourtDecision.originalTextZoning?.zones?.dispositif || undefined,
    'moyens annexes': sderCourtDecision.originalTextZoning?.zones?.['moyens annexes'] || undefined,
  }

  const introduction_subzonage = {
    'n_arret': sderCourtDecision.originalTextZoning?.introduction_subzonage?.n_arret || undefined,
    'formation': sderCourtDecision.originalTextZoning?.introduction_subzonage?.formation || undefined,
    'publication': sderCourtDecision.originalTextZoning?.introduction_subzonage?.publication || undefined,
    'juridiction': sderCourtDecision.originalTextZoning?.introduction_subzonage?.juridiction || undefined,
    'chambre': sderCourtDecision.originalTextZoning?.introduction_subzonage?.chambre || undefined,
    'pourvoi': sderCourtDecision.originalTextZoning?.introduction_subzonage?.pourvoi || undefined,
    'composition': sderCourtDecision.originalTextZoning?.introduction_subzonage?.composition || undefined,
  }

  let zoning = undefined
  if (sderCourtDecision.originalTextZoning) {
    zoning = {
      zones: zoningZones || undefined,
      introduction_subzonage: introduction_subzonage || undefined,
      visa: sderCourtDecision.originalTextZoning?.visa || undefined,
      is_public: sderCourtDecision.originalTextZoning?.is_public || undefined,
      is_public_text: sderCourtDecision.originalTextZoning?.is_public_text || undefined,
      arret_id: sderCourtDecision.originalTextZoning?.arret_id,
    }
  }

  return documentModule.lib.buildDocument({
    creationDate: creationDate?.getTime(),
    decisionMetadata: {
      appealNumber: appealNumber || '',
      additionalTermsToAnnotate,
      boundDecisionDocumentNumbers: sderCourtDecision.decatt || [],
      categoriesToOmit,
      civilCaseCode,
      civilMatterCode,
      criminalCaseCode,
      chamberName: readableChamberName,
      date: decisionDate?.getTime(),
      jurisdiction: readableJurisdictionName,
      NACCode,
      endCaseCode,
      parties: sderCourtDecision.parties || [],
      occultationBlock: sderCourtDecision.blocOccultation || undefined,
      session,
      solution,
    },
    documentNumber: sderCourtDecision.sourceId,
    externalId: idModule.lib.convertToString(sderCourtDecision._id),
    loss: undefined,
    priority,
    publicationCategory,
    route,
    importer,
    source,
    title,
    text: sderCourtDecision.originalText,
    zoning: zoning
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

function computePublicationCategory(
  pubCategory: decisionType['pubCategory'],
  publication: decisionType['publication'],
): documentType['publicationCategory'] {
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
  source: decisionType['sourceName'],
  publicationCategory: documentType['publicationCategory'],
  NACCode: decisionType['NACCode'],
  importer: documentType['importer'],
): documentType['priority'] {
  if (
    documentModule.lib.publicationHandler.mustBePublished(
      publicationCategory,
      NACCode,
    )
  ) {
    return 4;
  }
  switch (importer) {
    case 'manual':
      return 3;
    case 'chained':
      return 1;
    case 'filler':
      return 0;
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
