import { buildDataModelEntry, networkTypeOfDataModel, typeOfDataModel } from '../dataModelType';

export { annotationDataModel, LABEL_ANNOTATION_SOURCE };

export type { annotationType, fetchedAnnotationType };

const LABEL_ANNOTATION_SOURCE = 'label';

const annotationDataModel = {
  category: { type: buildDataModelEntry({ kind: 'primitive', content: 'string' }), network: true },
  documentId: { type: buildDataModelEntry({ kind: 'primitive', content: 'id' }), network: false },
  entityId: { type: buildDataModelEntry({ kind: 'primitive', content: 'string' }), network: true },
  source: { type: buildDataModelEntry({ kind: 'primitive', content: 'string' }), network: true },
  _id: { type: buildDataModelEntry({ kind: 'primitive', content: 'id' }), network: true },
  start: { type: buildDataModelEntry({ kind: 'primitive', content: 'number' }), network: true },
  text: { type: buildDataModelEntry({ kind: 'primitive', content: 'string' }), network: true },
} as const;

type annotationType = typeOfDataModel<typeof annotationDataModel>;

type fetchedAnnotationType = networkTypeOfDataModel<typeof annotationDataModel>;
