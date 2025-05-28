import { documentModel, checklistModel } from '../document/documentType';
import { idType } from '../id';
import { buildModel, buildType } from '../modelType';

export { statisticModel };

export type { statisticType };

const statisticModel = buildModel({
  kind: 'object',
  content: {
    _id: { kind: 'custom', content: 'id' },
    annotationsCount: { kind: 'primitive', content: 'number' },
    appealNumber: {
      kind: 'or',
      content: [
        { kind: 'primitive', content: 'string' },
        { kind: 'primitive', content: 'undefined' },
      ],
    },
    documentNumber: documentModel.content.documentNumber,
    decisionDate: documentModel.content.decisionMetadata.content.date,
    documentExternalId: { kind: 'primitive', content: 'string' },
    chamberName: {
      kind: 'or',
      content: [
        { kind: 'primitive', content: 'string' },
        { kind: 'primitive', content: 'undefined' },
      ],
    },
    importer: documentModel.content.importer,
    jurisdiction: {
      kind: 'or',
      content: [
        { kind: 'primitive', content: 'string' },
        { kind: 'primitive', content: 'undefined' },
      ],
    },
    linkedEntitiesCount: { kind: 'primitive', content: 'number' },
    publicationCategory: { kind: 'array', content: { kind: 'primitive', content: 'string' } },
    session: {
      kind: 'or',
      content: [
        { kind: 'primitive', content: 'string' },
        { kind: 'primitive', content: 'undefined' },
      ],
    },
    endCaseCode: {
      kind: 'or',
      content: [
        { kind: 'primitive', content: 'string' },
        { kind: 'primitive', content: 'undefined' },
      ],
    },
    NACCode: {
      kind: 'or',
      content: [
        { kind: 'primitive', content: 'string' },
        { kind: 'primitive', content: 'undefined' },
      ],
    },
    route: documentModel.content.route,
    source: { kind: 'primitive', content: 'string' },
    surAnnotationsCount: {
      kind: 'primitive',
      content: 'number',
    },
    subAnnotationsSensitiveCount: {
      kind: 'primitive',
      content: 'number',
    },
    subAnnotationsNonSensitiveCount: {
      kind: 'primitive',
      content: 'number',
    },
    treatmentDate: { kind: 'primitive', content: 'number' },
    treatmentsSummary: {
      kind: 'array',
      content: {
        kind: 'object',
        content: {
          userId: { kind: 'custom', content: 'id' },
          treatmentDuration: { kind: 'primitive', content: 'number' },
        },
      },
    },
    wordsCount: { kind: 'primitive', content: 'number' },
    checklist: checklistModel,
    comment: {
      kind: 'or',
      content: [
        { kind: 'primitive', content: 'string' },
        { kind: 'primitive', content: 'undefined' },
      ],
    },
  },
} as const);

type statisticType = buildType<typeof statisticModel, { id: idType }>;
