import { generatorType, generatorDecisionMetadataType } from '../../../types';
import { idModule } from '../../id';
import { documentType } from '../documentType';

export { documentGenerator, decisionMetadataGenerator };
const decisionMetadataGenerator: generatorDecisionMetadataType<documentType['decisionMetadata']> = {
  generate: ({
    additionalTermsToAnnotate,
    additionalTermsParsingFailed,
    computedAdditionalTerms,
    appealNumber,
    boundDecisionDocumentNumbers,
    categoriesToOmit,
    chamberName,
    civilCaseCode,
    civilMatterCode,
    criminalCaseCode,
    date,
    jurisdiction,
    NACCode,
    endCaseCode,
    occultationBlock,
    parties,
    session,
    solution,
    motivationOccultation,
  } = {}) => ({
    additionalTermsToAnnotate: additionalTermsToAnnotate ?? '',
    computedAdditionalTerms: computedAdditionalTerms ?? undefined,
    additionalTermsParsingFailed: additionalTermsParsingFailed ?? undefined,
    appealNumber: appealNumber ?? '',
    boundDecisionDocumentNumbers: boundDecisionDocumentNumbers ?? [],
    categoriesToOmit: categoriesToOmit ?? [],
    chamberName: chamberName ?? '',
    civilCaseCode: civilCaseCode ?? '',
    civilMatterCode: civilMatterCode ?? '',
    criminalCaseCode: criminalCaseCode ?? '',
    date: date ?? new Date().getTime(),
    jurisdiction: jurisdiction ?? '',
    NACCode: NACCode ?? '',
    endCaseCode: endCaseCode ?? '',
    occultationBlock: occultationBlock ?? 0,
    parties: parties ?? [],
    session: session ?? '',
    solution: solution ?? '',
    motivationOccultation: motivationOccultation ?? undefined,
  }),
};

const documentGenerator: generatorType<documentType> = {
  generate: ({
    creationDate,
    decisionMetadata,
    documentNumber,
    externalId,
    _id,
    importer,
    loss,
    priority,
    publicationCategory,
    reviewStatus,
    route,
    source,
    status,
    title,
    text,
    updateDate,
    zoning,
    nlpVersions,
  } = {}) => ({
    creationDate: creationDate ? creationDate : new Date().getTime(),
    decisionMetadata: decisionMetadata ? decisionMetadata : decisionMetadataGenerator.generate(),
    documentNumber: documentNumber ?? Math.floor(Math.random() * 1000000),
    externalId: externalId ?? `EXTERNAL_ID_${Math.random()}`,
    _id: _id ? idModule.lib.buildId(_id) : idModule.lib.buildId(),
    importer: importer ?? 'default',
    loss: loss,
    priority: priority !== undefined ? priority : 0,
    publicationCategory: publicationCategory ? publicationCategory : [],
    reviewStatus: reviewStatus || { hasBeenAmended: false, viewerNames: [] },
    route: route || 'default',
    source: source ?? `SOURCE_${Math.random()}`,
    status: status ?? 'free',
    title: title ?? `TITLE_${Math.random()}`,
    text: text ?? `TEXT_${Math.random()}`,
    updateDate: updateDate ?? new Date().getTime(),
    zoning: zoning ?? undefined,
    nlpVersions: nlpVersions ?? nlpVersionsMock,
  }),
};

const nlpVersionsMock = {
  juriSpacyTokenizer: {
    version: `VERSION_${Math.random()}`,
    date: `DATE_${Math.random()}`,
  },
  juritools: {
    version: `VERSION_${Math.random()}`,
    date: `DATE_${Math.random()}`,
  },
  pseudonymisationApi: {
    version: `VERSION_${Math.random()}`,
    date: `DATE_${Math.random()}`,
  },
  model: {
    name: `MODEL_${Math.random()}`,
  },
};
