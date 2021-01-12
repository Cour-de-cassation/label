import { buildDataModelEntry, graphQLTypeOfDataModel, typeOfDataModel } from '../dataModelType';

export { annotationDataModel, LABEL_ANNOTATION_SOURCE };

export type { annotationType, fetchedAnnotationType };

const LABEL_ANNOTATION_SOURCE = 'label';

const annotationDataModel = {
  category: { type: buildDataModelEntry({ kind: 'primitive', content: 'string' }), graphQL: true },
  documentId: { type: buildDataModelEntry({ kind: 'primitive', content: 'id' }), graphQL: false },
  entityId: { type: buildDataModelEntry({ kind: 'primitive', content: 'string' }), graphQL: true },
  source: { type: buildDataModelEntry({ kind: 'primitive', content: 'string' }), graphQL: true },
  _id: { type: buildDataModelEntry({ kind: 'primitive', content: 'id' }), graphQL: true },
  start: { type: buildDataModelEntry({ kind: 'primitive', content: 'number' }), graphQL: true },
  text: { type: buildDataModelEntry({ kind: 'primitive', content: 'string' }), graphQL: true },
} as const;

type annotationType = typeOfDataModel<typeof annotationDataModel>;

type fetchedAnnotationType = graphQLTypeOfDataModel<typeof annotationDataModel>;
