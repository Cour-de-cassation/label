import { buildDataModelEntry, typeOfDataModel } from '../dataModelType';

export { statisticDataModel };

export type { statisticType };

const statisticDataModel = {
  _id: { type: buildDataModelEntry({ kind: 'primitive', content: 'id' }), network: true },
  countAddedAnnotations: { type: buildDataModelEntry({ kind: 'primitive', content: 'number' }), network: true },
  countDeletedAnnotations: { type: buildDataModelEntry({ kind: 'primitive', content: 'number' }), network: true },
  countModifiedAnnotations: { type: buildDataModelEntry({ kind: 'primitive', content: 'number' }), network: true },
  countResizedBiggerAnnotations: { type: buildDataModelEntry({ kind: 'primitive', content: 'number' }), network: true },
  countResizedSmallerAnnotations: {
    type: buildDataModelEntry({ kind: 'primitive', content: 'number' }),
    network: true,
  },
  documentNumber: { type: buildDataModelEntry({ kind: 'primitive', content: 'number' }), network: true },
  publicationCategory: {
    type: buildDataModelEntry({ kind: 'list', content: { kind: 'primitive', content: 'string' } }),
    network: true,
  },
  treatmentDuration: { type: buildDataModelEntry({ kind: 'primitive', content: 'number' }), network: true },
  userId: { type: buildDataModelEntry({ kind: 'primitive', content: 'id' }), network: true },
} as const;

type statisticType = typeOfDataModel<typeof statisticDataModel>;
