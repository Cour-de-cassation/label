import { idType } from '../id';
import { buildModel, buildType } from '../modelType';

export { documentModel, fetchedDocumentModel, checklistModel };

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
        kind: 'array',
        content: {
          kind: 'object',
          content: {
            start: { kind: 'primitive', content: 'number' },
            end: { kind: 'primitive', content: 'number' },
          },
        },
      },
      { kind: 'primitive', content: 'undefined' },
    ],
  },
  'expose du litige': {
    kind: 'or',
    content: [
      {
        kind: 'array',
        content: {
          kind: 'object',
          content: {
            start: { kind: 'primitive', content: 'number' },
            end: { kind: 'primitive', content: 'number' },
          },
        },
      },
      { kind: 'primitive', content: 'undefined' },
    ],
  },
  motivations: {
    kind: 'or',
    content: [
      {
        kind: 'array',
        content: {
          kind: 'object',
          content: {
            start: { kind: 'primitive', content: 'number' },
            end: { kind: 'primitive', content: 'number' },
          },
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

const introduction_subzonage = {
  n_arret: {
    kind: 'or',
    content: [
      { kind: 'primitive', content: 'string' },
      { kind: 'primitive', content: 'undefined' },
    ],
  },
  formation: {
    kind: 'or',
    content: [
      { kind: 'primitive', content: 'string' },
      { kind: 'primitive', content: 'undefined' },
    ],
  },
  publication: {
    kind: 'or',
    content: [
      { kind: 'array', content: { kind: 'primitive', content: 'string' } },
      { kind: 'primitive', content: 'undefined' },
    ],
  },
  juridiction: {
    kind: 'or',
    content: [
      { kind: 'primitive', content: 'string' },
      { kind: 'primitive', content: 'undefined' },
    ],
  },
  chambre: {
    kind: 'or',
    content: [
      { kind: 'primitive', content: 'string' },
      { kind: 'primitive', content: 'undefined' },
    ],
  },
  pourvoi: {
    kind: 'or',
    content: [
      { kind: 'array', content: { kind: 'primitive', content: 'string' } },
      { kind: 'primitive', content: 'undefined' },
    ],
  },
  composition: {
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
        introduction_subzonage: {
          kind: 'or',
          content: [
            { kind: 'object', content: introduction_subzonage },
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
            { kind: 'primitive', content: 'number' },
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

const checklistModel = {
  kind: 'array',
  content: {
    kind: 'object',
    content: {
      check_type: {
        kind: 'primitive',
        content: 'string',
      },
      message: { kind: 'primitive', content: 'string' },
      short_message: { kind: 'primitive', content: 'string' },
      entities: {
        kind: 'array',
        content: {
          kind: 'object',
          content: {
            text: { kind: 'primitive', content: 'string' },
            start: { kind: 'primitive', content: 'number' },
            category: { kind: 'primitive', content: 'string' },
            source: { kind: 'primitive', content: 'string' },
            score: { kind: 'primitive', content: 'number' },
            entityId: { kind: 'primitive', content: 'string' },
            end: { kind: 'primitive', content: 'number' },
          },
        },
      },
      sentences: {
        kind: 'array',
        content: {
          kind: 'object',
          content: {
            start: { kind: 'primitive', content: 'number' },
            end: { kind: 'primitive', content: 'number' },
          },
        },
      },
      metadata_text: { kind: 'array', content: { kind: 'primitive', content: 'string' } },
    },
  },
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
      computedAdditionalTerms: {
        kind: 'or',
        content: [
          {
            kind: 'object',
            content: {
              additionalTermsToAnnotate: { kind: 'array', content: { kind: 'primitive', content: 'string' } },
              additionalTermsToUnAnnotate: { kind: 'array', content: { kind: 'primitive', content: 'string' } },
            },
          },
          { kind: 'primitive', content: 'undefined' },
        ],
      },
      additionalTermsParsingFailed: {
        kind: 'or',
        content: [
          { kind: 'primitive', content: 'boolean' },
          { kind: 'primitive', content: 'undefined' },
        ],
      },
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
      parties: {
        kind: 'or',
        content: [
          {
            kind: 'array',
            content: {
              kind: 'object',
              content: {
                type: { kind: 'primitive', content: 'string' },
                nom: { kind: 'primitive', content: 'string' },
                prenom: { kind: 'primitive', content: 'string' },
                civilite: {
                  kind: 'or',
                  content: [
                    { kind: 'primitive', content: 'string' },
                    { kind: 'primitive', content: 'undefined' },
                  ],
                },
                qualite: {
                  kind: 'or',
                  content: [
                    { kind: 'primitive', content: 'string' },
                    { kind: 'primitive', content: 'undefined' },
                  ],
                },
              },
            },
          },
          {
            kind: 'array',
            content: {
              kind: 'object',
              content: {},
            },
          },
        ],
      },
      session: { kind: 'primitive', content: 'string' },
      solution: { kind: 'primitive', content: 'string' },
      motivationOccultation: {
        kind: 'or',
        content: [
          { kind: 'primitive', content: 'boolean' },
          { kind: 'primitive', content: 'undefined' },
        ],
      },
      selection: {
        kind: 'or',
        content: [
          { kind: 'primitive', content: 'boolean' },
          { kind: 'primitive', content: 'undefined' },
        ],
      },
      sommaire: {
        kind: 'or',
        content: [
          { kind: 'primitive', content: 'string' },
          { kind: 'primitive', content: 'undefined' },
        ],
      },
    },
  },
  documentNumber: { kind: 'primitive', content: 'number' },
  _id: { kind: 'custom', content: 'id' },
  importer: {
    kind: 'constant',
    content: ['recent', 'manual', 'default'] as const,
  },
  loss: {
    kind: 'or',
    content: [
      { kind: 'primitive', content: 'number' },
      { kind: 'primitive', content: 'undefined' },
    ],
  },
  nlpVersions: {
    kind: 'or',
    content: [
      {
        kind: 'object',
        content: {
          juriSpacyTokenizer: {
            kind: 'object',
            content: {
              version: { kind: 'primitive', content: 'string' },
              date: { kind: 'primitive', content: 'string' },
            },
          },
          juritools: {
            kind: 'object',
            content: {
              version: { kind: 'primitive', content: 'string' },
              date: { kind: 'primitive', content: 'string' },
            },
          },
          pseudonymisationApi: {
            kind: 'object',
            content: {
              version: { kind: 'primitive', content: 'string' },
              date: { kind: 'primitive', content: 'string' },
            },
          },
          model: {
            kind: 'object',
            content: {
              name: { kind: 'primitive', content: 'string' },
            },
          },
        },
      },
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
      'saved',
      'toBePublished',
      'toBeConfirmed',
    ] as const,
  },
  title: { kind: 'primitive', content: 'string' },
  text: { kind: 'primitive', content: 'string' },
  zoning: zoning,
  checklist: checklistModel,
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
