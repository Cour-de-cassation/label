import { generatorType } from '../../../types';
import { idModule } from '../../id';
import { statisticType } from '../statisticType';

export { statisticGenerator };

const statisticGenerator: generatorType<statisticType> = {
  generate: ({
    _id,
    annotationsCount,
    appealNumber,
    chamberName,
    decisionDate,
    documentExternalId,
    documentNumber,
    jurisdiction,
    linkedEntitiesCount,
    publicationCategory,
    session,
    route,
    importer,
    source,
    subAnnotationsSensitiveCount,
    surAnnotationsCount,
    subAnnotationsNonSensitiveCount,
    treatmentDate,
    treatmentsSummary,
    wordsCount,
    endCaseCode,
    NACCode,
    annotationReportsChecklist,
  } = {}) => ({
    _id: _id ? idModule.lib.buildId(_id) : idModule.lib.buildId(),
    annotationsCount: annotationsCount ? annotationsCount : 0,
    appealNumber: appealNumber ? appealNumber : undefined,
    chamberName: chamberName || `SOURCE_${Math.random()}`,
    decisionDate: decisionDate,
    documentExternalId: documentExternalId ? documentExternalId : idModule.lib.convertToString(idModule.lib.buildId()),
    documentNumber: documentNumber !== undefined ? documentNumber : Math.floor(Math.random() * 1000000),
    jurisdiction,
    linkedEntitiesCount: linkedEntitiesCount ? linkedEntitiesCount : 0,
    publicationCategory: publicationCategory ? publicationCategory : [],
    session: session || undefined,
    endCaseCode: endCaseCode || undefined,
    NACCode: NACCode || undefined,
    route: route ?? `default`,
    importer: importer ?? `default`,
    source: source ?? `SOURCE_${Math.random()}`,
    subAnnotationsNonSensitiveCount:
      subAnnotationsNonSensitiveCount !== undefined ? subAnnotationsNonSensitiveCount : 0,
    subAnnotationsSensitiveCount: subAnnotationsSensitiveCount !== undefined ? subAnnotationsSensitiveCount : 0,
    surAnnotationsCount: surAnnotationsCount !== undefined ? surAnnotationsCount : 0,
    treatmentDate: treatmentDate ? treatmentDate : new Date().getTime(),
    treatmentsSummary: treatmentsSummary ? treatmentsSummary : [],
    wordsCount: wordsCount ? wordsCount : 0,
    annotationReportsChecklist: annotationReportsChecklist
      ? annotationReportsChecklist
      : [
          {
            checkType: 'different_categories',
            message:
              "L'annotation 'Yon' est présente dans différentes catégories: ['Magistrat/Greffier', 'Personne physique']",
            entities: [
              {
                text: 'Yon',
                start: 9358,
                category: 'personnePhysique',
                source: 'postprocess',
                score: 1.0,
                entityId: 'personnePhysique_yon',
                end: 9361,
              },
              {
                text: 'Yon',
                start: 6796,
                category: 'professionnelMagistratGreffier',
                source: 'postprocess',
                score: 1.0,
                entityId: 'professionnelMagistratGreffier_yon',
                end: 6799,
              },
            ],
            sentences: [
              {
                start: 0,
                end: 22,
              },
            ],
            metadata_text: [],
          },
        ],
  }),
};
