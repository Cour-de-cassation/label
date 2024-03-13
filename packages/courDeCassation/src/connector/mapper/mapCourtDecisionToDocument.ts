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
  extractAppealRegisterRoleGeneralNumber,
  correctAppealValueFormat,
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
  const creationDate = convertToValidDate(sderCourtDecision.dateCreation);
  const decisionDate = convertToValidDate(sderCourtDecision.dateDecision);
  const source = sderCourtDecision.sourceName;

  const registerNumber = sderCourtDecision.registerNumber;
  const appeal = sderCourtDecision.appeals[0];
  const numeroRoleGeneral = sderCourtDecision.numeroRoleGeneral || '';
  const appealNumber = extractAppealRegisterRoleGeneralNumber(
    sderCourtDecision.originalText,
    source,
    readableJurisdictionName,
    appeal,
    registerNumber,
    numeroRoleGeneral,
  );

  const title = computeTitleFromParsedCourtDecision({
    source: source,
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

  return documentModule.lib.buildDocument({
    creationDate: creationDate?.getTime(),
    decisionMetadata: {
      appealNumber: correctAppealValueFormat(appealNumber) || '',
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
  });
}
function getNumberPrefix(
  appealNumber: string | undefined,
  source: string,
  readableJurisdictionName: string,
) {
  if (
    (readableJurisdictionName?.includes('cassation') && source !== 'jurica') ||
    'juritj'
  ) {
    return (appealNumber = `Pourvoi n° ${appealNumber}`);
  } else {
    return (appealNumber = `RG n° ${appealNumber}`);
  }
}
function computeTitleFromParsedCourtDecision({
  source,
  number,
  appealNumber,
  readableChamberName,
  readableJurisdictionName,
  date,
}: {
  source: string;
  number: number;
  appealNumber: string | undefined;
  readableChamberName: string;
  readableJurisdictionName: string;
  date?: Date;
}) {
  // appeal titrer RG ou Pourvoi
  appealNumber = getNumberPrefix(
    appealNumber,
    source,
    readableJurisdictionName,
  );

  // juridictionName accompagner de Tribunal j.. pour les tj
  source === 'juritj'
    ? (readableJurisdictionName = `Tribunal judiciaire de ${readableJurisdictionName}`)
    : readableJurisdictionName;

  const readableNumber = `Décision n°${number}`;
  const readableAppealNumber = appealNumber ? appealNumber : undefined;
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
