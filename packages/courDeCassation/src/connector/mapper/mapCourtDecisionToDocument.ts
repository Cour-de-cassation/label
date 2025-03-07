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
} from './extractors';
import { extractRoute } from './extractors/extractRoute';
import { categoriesMapper } from './categoriesMapper';
import { DecisionDTO, DecisionTJDTO, Sources } from 'dbsder-api-types';

export { mapCourtDecisionToDocument };

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
async function mapCourtDecisionToDocument(
  sderCourtDecision: DecisionDTO,
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
  const numeroRoleGeneral = isDecisionTJ(sderCourtDecision)
    ? sderCourtDecision.numeroRoleGeneral
    : '';
  const appealNumber = extractAppealRegisterRoleGeneralNumber(
    sderCourtDecision.originalText,
    source,
    readableJurisdictionName,
    appeal,
    registerNumber,
    numeroRoleGeneral,
  );

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
  const NAOCode = sderCourtDecision.NAOCode || '';
  const endCaseCode = sderCourtDecision.endCaseCode || '';

  const title = computeTitleFromParsedCourtDecision({
    source: source,
    number: sderCourtDecision.sourceId,
    appealNumber,
    readableChamberName,
    readableJurisdictionName,
    NACCode: NACCode,
    NAOCode: NAOCode,
    date: decisionDate,
  });

  const priority = computePriority(
    sderCourtDecision.sourceName,
    publicationCategory,
    NACCode,
    importer,
  );

  const route = await extractRoute(
    {
      additionalTermsToAnnotate,
      solution,
      parties: sderCourtDecision.parties ? sderCourtDecision.parties : [],
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

  let moyens = undefined;
  if (sderCourtDecision.originalTextZoning?.zones?.moyens) {
    if (Array.isArray(sderCourtDecision.originalTextZoning.zones.moyens)) {
      moyens = sderCourtDecision.originalTextZoning.zones.moyens;
    } else {
      moyens = [sderCourtDecision.originalTextZoning.zones.moyens];
    }
  }

  let expose_du_litige = undefined;
  if (sderCourtDecision.originalTextZoning?.zones?.['expose du litige']) {
    if (
      Array.isArray(
        sderCourtDecision.originalTextZoning.zones['expose du litige'],
      )
    ) {
      expose_du_litige =
        sderCourtDecision.originalTextZoning.zones['expose du litige'];
    } else {
      expose_du_litige = [
        sderCourtDecision.originalTextZoning.zones['expose du litige'],
      ];
    }
  }

  let motivations = undefined;
  if (sderCourtDecision.originalTextZoning?.zones?.motivations) {
    if (Array.isArray(sderCourtDecision.originalTextZoning.zones.motivations)) {
      motivations = sderCourtDecision.originalTextZoning.zones.motivations;
    } else {
      motivations = [sderCourtDecision.originalTextZoning.zones.motivations];
    }
  }

  const zoningZones = {
    introduction:
      sderCourtDecision.originalTextZoning?.zones?.introduction || undefined,
    moyens: moyens,
    'expose du litige': expose_du_litige,
    motivations: motivations,
    dispositif:
      sderCourtDecision.originalTextZoning?.zones?.dispositif || undefined,
    'moyens annexes':
      sderCourtDecision.originalTextZoning?.zones?.['moyens annexes'] ||
      undefined,
  };

  const introduction_subzonage = {
    n_arret:
      sderCourtDecision.originalTextZoning?.introduction_subzonage?.n_arret ||
      undefined,
    formation:
      sderCourtDecision.originalTextZoning?.introduction_subzonage?.formation ||
      undefined,
    publication:
      sderCourtDecision.originalTextZoning?.introduction_subzonage
        ?.publication || undefined,
    juridiction:
      sderCourtDecision.originalTextZoning?.introduction_subzonage
        ?.juridiction || undefined,
    chambre:
      sderCourtDecision.originalTextZoning?.introduction_subzonage?.chambre ||
      undefined,
    pourvoi:
      sderCourtDecision.originalTextZoning?.introduction_subzonage?.pourvoi ||
      undefined,
    composition:
      sderCourtDecision.originalTextZoning?.introduction_subzonage
        ?.composition || undefined,
  };

  let zoning = undefined;
  if (sderCourtDecision.originalTextZoning) {
    zoning = {
      zones: zoningZones || undefined,
      introduction_subzonage: introduction_subzonage || undefined,
      visa: sderCourtDecision.originalTextZoning?.visa || undefined,
      is_public: sderCourtDecision.originalTextZoning?.is_public || undefined,
      is_public_text:
        sderCourtDecision.originalTextZoning?.is_public_text || undefined,
      arret_id: sderCourtDecision.originalTextZoning?.arret_id,
    };
  }

  return documentModule.lib.buildDocument({
    creationDate: creationDate?.getTime(),
    decisionMetadata: {
      appealNumber: appealNumber || '',
      additionalTermsToAnnotate,
      computedAdditionalTerms: undefined,
      additionalTermsParsingFailed: undefined,
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
      parties: sderCourtDecision.parties ? sderCourtDecision.parties : [],
      occultationBlock: sderCourtDecision.blocOccultation || undefined,
      session,
      solution,
      motivationOccultation:
        sderCourtDecision.occultation.motivationOccultation ?? undefined,
    },
    documentNumber: sderCourtDecision.sourceId,
    externalId: idModule.lib.convertToString(sderCourtDecision._id ?? ''),
    loss: undefined,
    priority,
    publicationCategory,
    route,
    importer,
    source,
    title,
    text: sderCourtDecision.originalText,
    zoning: zoning,
    nlpVersions: {} as documentType['nlpVersions'],
    checklist: [],
  });
}

function getPrefixedNumber(
  numberToPrefix: string | undefined,
  source: string,
  readableJurisdictionName: string,
) {
  if (numberToPrefix === undefined) {
    return undefined;
  }
  if (source === 'jurinet' && readableJurisdictionName.includes('cassation')) {
    return `Pourvoi n°${numberToPrefix}`;
  } else {
    return `RG n°${numberToPrefix}`;
  }
}

function computeTitleFromParsedCourtDecision({
  source,
  number,
  appealNumber,
  readableChamberName,
  readableJurisdictionName,
  NACCode,
  NAOCode,
  date,
}: {
  source: string;
  number: number;
  appealNumber: string | undefined;
  readableChamberName: string;
  readableJurisdictionName: string;
  NACCode: string;
  NAOCode: string;
  date?: Date;
}) {
  const prefixedNumber = getPrefixedNumber(
    appealNumber,
    source,
    readableJurisdictionName,
  );

  if (source === Sources.TJ) {
    readableJurisdictionName = `TJ de ${readableJurisdictionName}`;
  }

  if (source === Sources.TCOM) {
    readableJurisdictionName = `TCOM de ${readableJurisdictionName}`;
  }

  const nomenclatureNumber =
    source === Sources.CC && NAOCode
      ? `NAO ${NAOCode}`
      : (source === Sources.TJ || source === Sources.CA) && NACCode
      ? `NAC ${NACCode}`
      : undefined;

  const readableNumber = `Décision n°${number}`;
  const readableAppealNumber = prefixedNumber ? prefixedNumber : undefined;
  const readableDate = date
    ? timeOperator.convertTimestampToReadableDate(date.getTime())
    : undefined;
  const title = [
    readableNumber,
    readableAppealNumber,
    readableJurisdictionName,
    readableChamberName,
    nomenclatureNumber,
    readableDate,
  ]
    .filter(Boolean)
    .join(' · ');
  return title;
}

function computePublicationCategory(
  pubCategory: DecisionDTO['pubCategory'],
  publication: DecisionDTO['publication'],
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
  source: DecisionDTO['sourceName'],
  publicationCategory: documentType['publicationCategory'],
  NACCode: DecisionDTO['NACCode'],
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
    case 'jurica':
      return 1;
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

function isDecisionTJ(decision: DecisionDTO): decision is DecisionTJDTO {
  return decision.sourceName === Sources.TJ;
}
