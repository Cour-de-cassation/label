import { generatorType, generatorDecisionMetadataType } from '../../../types';
import { idModule } from '../../id';
import { documentType } from '../documentType';

export { documentGenerator, decisionMetadataGenerator };
const decisionMetadataGenerator: generatorDecisionMetadataType<documentType['decisionMetadata']> = {
  generate: ({
    additionalTermsToAnnotate,
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
  } = {}) => ({
    additionalTermsToAnnotate: additionalTermsToAnnotate ?? `ADDITIONAL_TERMS_TO_ANNOTATE_${Math.random()}`,
    appealNumber: appealNumber ?? `APPEAL_NUMBER_${Math.random()}`,
    boundDecisionDocumentNumbers: boundDecisionDocumentNumbers ?? [],
    categoriesToOmit: categoriesToOmit ?? [`CATEGORIES_TO_OMIT_${Math.random()}`],
    chamberName: chamberName ?? `CHAMBRE_NAME_${Math.random()}`,
    civilCaseCode: civilCaseCode ?? `CIVIL_CASE_CODE_${Math.random()}`,
    civilMatterCode: civilMatterCode ?? `CIVIL_MATTER_CODE_${Math.random()}`,
    criminalCaseCode: criminalCaseCode ?? `CRIMINAL_CASE_CODE_${Math.random()}`,
    date: date ?? new Date().getTime(),
    jurisdiction: jurisdiction ?? `JURISDICTION_${Math.random()}`,
    NACCode: NACCode ?? `NAC_CODE_${Math.random()}`,
    endCaseCode: endCaseCode ?? `END_CASE_CODE_${Math.random()}`,
    occultationBlock: occultationBlock ?? 10,
    parties: parties ?? [`PARTIES_${Math.random()}`],
    session: session ?? `SESSION_${Math.random()}`,
    solution: solution ?? `SOLUTION_${Math.random()}`,
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
  } = {}) => ({
    creationDate: creationDate ? creationDate : new Date().getTime(),
    decisionMetadata: decisionMetadata
      ? decisionMetadata
      : decisionMetadataGenerator.generate(),
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
  }),
};
