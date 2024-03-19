import { idType } from '../id';
import { buildModel, buildType } from '../modelType';

export { documentModel, fetchedDocumentModel };

export type { documentType, fetchedDocumentType };

const zoningZones = {
  introduction: {
    kind: 'or',
    content: [
      {
        kind: 'object',
        content: {
          start: { kind: 'primitive', content: 'number' },
          end: { kind: 'primitive', content: 'number' },
        },
      },
      { kind: 'primitive', content: 'undefined' },
    ],
  },
  moyens: {
    kind: 'or',
    content: [
      {
        kind: 'object',
        content: {
          start: { kind: 'primitive', content: 'number' },
          end: { kind: 'primitive', content: 'number' },
        },
      },
      { kind: 'primitive', content: 'undefined' },
    ],
  },
  'expose du litige': {
    kind: 'or',
    content: [
      {
        kind: 'object',
        content: {
          start: { kind: 'primitive', content: 'number' },
          end: { kind: 'primitive', content: 'number' },
        },
      },
      { kind: 'primitive', content: 'undefined' },
    ],
  },
  motivations: {
    kind: 'or',
    content: [
      {
        kind: 'object',
        content: {
          start: { kind: 'primitive', content: 'number' },
          end: { kind: 'primitive', content: 'number' },
        },
      },
      { kind: 'primitive', content: 'undefined' },
    ],
  },
  dispositif: {
    kind: 'or',
    content: [
      {
        kind: 'object',
        content: {
          start: { kind: 'primitive', content: 'number' },
          end: { kind: 'primitive', content: 'number' },
        },
      },
      { kind: 'primitive', content: 'undefined' },
    ],
  },
  'moyens annexes': {
    kind: 'or',
    content: [
      {
        kind: 'object',
        content: {
          start: { kind: 'primitive', content: 'number' },
          end: { kind: 'primitive', content: 'number' },
        },
      },
      { kind: 'primitive', content: 'undefined' },
    ],
  },
} as const;

const zoning = {
  kind: 'or',
  content: [
    {
      kind: 'object',
      content: {
        zones: {
          kind: 'or',
          content: [
            { kind: 'object', content: zoningZones },
            { kind: 'primitive', content: 'undefined' },
          ],
        },
        visa: {
          kind: 'or',
          content: [
            { kind: 'array', content: { kind: 'primitive', content: 'string' } },
            { kind: 'primitive', content: 'undefined' },
          ],
        },
        is_public: {
          kind: 'or',
          content: [
            { kind: 'primitive', content: 'boolean' },
            { kind: 'primitive', content: 'undefined' },
          ],
        },
        is_public_text: {
          kind: 'or',
          content: [
            { kind: 'array', content: { kind: 'primitive', content: 'string' } },
            { kind: 'primitive', content: 'undefined' },
          ],
        },
        arret_id: { kind: 'primitive', content: 'number' },
      },
    },
    { kind: 'primitive', content: 'undefined' },
  ],
} as const;

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
  importer: {
    kind: 'constant',
    content: ['recent', 'chained', 'filler', 'manual', 'default'] as const,
  },
  loss: {
    kind: 'or',
    content: [
      { kind: 'primitive', content: 'number' },
      { kind: 'primitive', content: 'undefined' },
    ],
  },
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
      'locked',
      'rejected',
      'saved',
      'toBePublished',
      'toBeConfirmed',
    ] as const,
  },
  title: { kind: 'primitive', content: 'string' },
  text: { kind: 'primitive', content: 'string' },
  zoning: zoning,
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
