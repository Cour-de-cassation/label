import { buildDataModelEntry, typeOfDataModelEntryType } from '../dataModelType';

export { annotationDataModelField };

export type { annotationType };

const annotationDataModelField = buildDataModelEntry({
  kind: 'object',
  content: {
    category: buildDataModelEntry({ kind: 'primitive', content: 'string' }),
    entityId: buildDataModelEntry({ kind: 'primitive', content: 'string' }),
    start: buildDataModelEntry({ kind: 'primitive', content: 'number' }),
    text: buildDataModelEntry({ kind: 'primitive', content: 'string' }),
  },
} as const);

type annotationType = typeOfDataModelEntryType<typeof annotationDataModelField>;
