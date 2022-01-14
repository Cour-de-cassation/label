import { idType } from '../id';
import { buildModel, buildType } from '../modelType';

export { documentModel, fetchedDocumentModel };

export type { documentType, fetchedDocumentType };

const documentModelCommonFields = {
  creationDate: {
    kind: 'or',
    content: [
      { kind: 'primitive', content: 'number' },
      { kind: 'primitive', content: 'undefined' },
    ],
  },
  decisionMetadata: {
    kind: 'object',
    content: {
      appealNumber: { kind: 'primitive', content: 'string' },
      additionalTermsToAnnotate: { kind: 'primitive', content: 'string' },
      boundDecisionDocumentNumbers: { kind: 'array', content: { kind: 'primitive', content: 'number' } },
      categoriesToOmit: { kind: 'array', content: { kind: 'primitive', content: 'string' } },
      chamberName: { kind: 'primitive', content: 'string' },
      civilCaseCode: { kind: 'primitive', content: 'string' },
      civilMatterCode: { kind: 'primitive', content: 'string' },
      criminalCaseCode: { kind: 'primitive', content: 'string' },
      date: {
        kind: 'or',
        content: [
          { kind: 'primitive', content: 'number' },
          { kind: 'primitive', content: 'undefined' },
        ],
      },
      jurisdiction: { kind: 'primitive', content: 'string' },
      occultationBlock: {
        kind: 'or',
        content: [
          { kind: 'primitive', content: 'number' },
          { kind: 'primitive', content: 'undefined' },
        ],
      },
      NACCode: { kind: 'primitive', content: 'string' },
      endCaseCode: { kind: 'primitive', content: 'string' },
      parties: { kind: 'array', content: { kind: 'primitive', content: 'string' } },
      session: { kind: 'primitive', content: 'string' },
      solution: { kind: 'primitive', content: 'string' },
    },
  },
  documentNumber: { kind: 'primitive', content: 'number' },
  _id: { kind: 'custom', content: 'id' },
  publicationCategory: { kind: 'array', content: { kind: 'primitive', content: 'string' } },
  reviewStatus: {
    kind: 'object',
    content: {
      viewerNames: { kind: 'array', content: { kind: 'primitive', content: 'string' } },
      hasBeenAmended: { kind: 'primitive', content: 'boolean' },
    },
  },
  route: {
    kind: 'constant',
    content: ['automatic', 'exhaustive', 'simple', 'confirmation', 'request', 'default'] as const,
  },
  source: { kind: 'primitive', content: 'string' },
  status: {
    kind: 'constant',
    content: [
      'done',
      'free',
      'loaded',
      'nlpAnnotating',
      'pending',
      'rejected',
      'saved',
      'toBePublished',
      'toBeConfirmed',
    ] as const,
  },
  title: { kind: 'primitive', content: 'string' },
  text: { kind: 'primitive', content: 'string' },
} as const;

const fetchedDocumentModel = buildModel({
  kind: 'object',
  content: documentModelCommonFields,
} as const);

const documentModel = buildModel({
  kind: 'object',
  content: {
    ...documentModelCommonFields,
    externalId: { kind: 'primitive', content: 'string' },
    priority: { kind: 'primitive', content: 'number' as const },
    updateDate: { kind: 'primitive', content: 'number' },
  },
} as const);

type fetchedDocumentType = buildType<typeof fetchedDocumentModel, { id: idType }>;

type documentType = buildType<typeof documentModel, { id: idType }>;
