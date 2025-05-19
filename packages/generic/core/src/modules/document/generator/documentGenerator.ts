import { generatorType } from '../../../types';
import { idModule } from '../../id';
import { documentType } from '../documentType';

export { documentGenerator, decisionMetadataGenerator, checklistGenerator };

const checklistGenerator = {
  generate(size: number): documentType['checklist'] {
    return Array.from({ length: size }, () => ({
      check_type: `CHECK_TYPE_${Math.random()}`,
      message: "Default message: L'annotation 'Test' est présente dans différentes catégories.",
      short_message: 'Default short message: Annotation dans plusieurs catégories ?',
      entities: [
        {
          text: 'DefaultEntity',
          start: Math.floor(Math.random() * 100),
          end: Math.floor(Math.random() * 100 + 100),
          category: `defaultCategory_${Math.random()}`,
          source: 'test',
          score: Math.random(),
          entityId: `defaultEntity_${Math.random()}`,
        },
      ],
      sentences: [
        {
          start: Math.floor(Math.random() * 100),
          end: Math.floor(Math.random() * 100 + 100),
        },
      ],
      metadata_text: [`metadata_${Math.random()}`, `_metadata_${Math.random()}`],
    }));
  },
};

const decisionMetadataGenerator: generatorType<documentType['decisionMetadata']> = {
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
    selection,
    sommaire,
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
    selection: selection ?? false,
    sommaire: sommaire ?? '',
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
    checklist,
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
    nlpVersions: nlpVersions ?? undefined,
    checklist: checklist ?? checklistGenerator.generate(Math.floor(Math.random() * (10 - 0 + 1) + 0)),
  }),
};
