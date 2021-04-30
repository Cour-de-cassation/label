import { idType } from '../id';
import { buildModel, buildType } from '../modelType';

export { documentModel, fetchedDocumentModel };

export type { documentType, fetchedDocumentType };

const documentModelCommonFields = {
  decisionMetadata: {
    kind: 'object',
    content: {
      chamberName: { kind: 'primitive', content: 'string' },
      juridiction: { kind: 'primitive', content: 'string' },
    },
  },
  documentNumber: { kind: 'primitive', content: 'number' },
  _id: { kind: 'custom', content: 'id' },
  markedAsPublished: { kind: 'primitive', content: 'boolean' },
  publicationCategory: { kind: 'array', content: { kind: 'primitive', content: 'string' } },
  status: {
    kind: 'constant',
    content: ['done', 'exported', 'free', 'loaded', 'nlpAnnotating', 'pending', 'rejected', 'saved'] as const,
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
    creationDate: { kind: 'primitive', content: 'date' },
    externalId: { kind: 'primitive', content: 'string' },
    metadata: { kind: 'primitive', content: 'string' },
    priority: { kind: 'constant', content: ['low', 'medium', 'high'] as const },
    source: { kind: 'primitive', content: 'string' },
    updateDate: { kind: 'primitive', content: 'number' },
  },
} as const);

type fetchedDocumentType = buildType<typeof fetchedDocumentModel, { id: idType }>;

type documentType = buildType<typeof documentModel, { id: idType }>;
