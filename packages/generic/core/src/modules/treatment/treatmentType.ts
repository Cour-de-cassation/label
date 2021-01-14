import { buildDataModelEntry, networkTypeOfDataModel, typeOfDataModel } from '../dataModelType';
import { annotationsDiffModule } from '../annotationsDiff';

export { treatmentDataModel };

export type { treatmentType, fetchedTreatmentType };

const treatmentDataModel = {
  _id: { type: buildDataModelEntry({ kind: 'primitive', content: 'id' }), network: true },
  annotationsDiff: { type: annotationsDiffModule.dataModelField, network: true },
  documentId: { type: buildDataModelEntry({ kind: 'primitive', content: 'id' }), network: true },
  duration: { type: buildDataModelEntry({ kind: 'primitive', content: 'number' }), network: true },
  order: { type: buildDataModelEntry({ kind: 'primitive', content: 'number' }), network: true },
} as const;

type treatmentType = typeOfDataModel<typeof treatmentDataModel>;

type fetchedTreatmentType = networkTypeOfDataModel<typeof treatmentDataModel>;
