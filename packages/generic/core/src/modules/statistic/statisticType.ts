import { buildDataModelEntry, typeOfDataModel } from '../dataModelType';

export { statisticDataModel };

export type { statisticType };

const statisticDataModel = {
  _id: { type: buildDataModelEntry({ kind: 'primitive', content: 'id' }), network: true },
  addedAnnotationsCount: { type: buildDataModelEntry({ kind: 'primitive', content: 'number' }), network: true },
  annotationsCount: { type: buildDataModelEntry({ kind: 'primitive', content: 'number' }), network: true },
  deletedAnnotationsCount: { type: buildDataModelEntry({ kind: 'primitive', content: 'number' }), network: true },
  documentNumber: { type: buildDataModelEntry({ kind: 'primitive', content: 'number' }), network: true },
  linkedEntitiesCount: { type: buildDataModelEntry({ kind: 'primitive', content: 'number' }), network: true },
  modifiedAnnotationsCount: { type: buildDataModelEntry({ kind: 'primitive', content: 'number' }), network: true },
  publicationCategory: {
    type: buildDataModelEntry({ kind: 'list', content: { kind: 'primitive', content: 'string' } }),
    network: true,
  },
  resizedBiggerAnnotationsCount: { type: buildDataModelEntry({ kind: 'primitive', content: 'number' }), network: true },
  resizedSmallerAnnotationsCount: {
    type: buildDataModelEntry({ kind: 'primitive', content: 'number' }),
    network: true,
  },
  source: { type: buildDataModelEntry({ kind: 'primitive', content: 'string' }), network: true },
  treatmentDuration: { type: buildDataModelEntry({ kind: 'primitive', content: 'number' }), network: true },
  userId: { type: buildDataModelEntry({ kind: 'primitive', content: 'id' }), network: true },
  wordsCount: { type: buildDataModelEntry({ kind: 'primitive', content: 'number' }), network: true },
} as const;

type statisticType = typeOfDataModel<typeof statisticDataModel>;
