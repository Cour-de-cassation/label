import { buildDataModelEntry, typeOfDataModelEntryType } from '../dataModelType';
import { annotationModule } from '../newAnnotationModule';

export { annotationsDiffDataModelField };

export type { annotationsDiffType };

const annotationsDiffDataModelField = buildDataModelEntry({
  kind: 'object',
  content: {
    before: buildDataModelEntry({ kind: 'list', content: annotationModule.dataModelField }),
    after: buildDataModelEntry({ kind: 'list', content: annotationModule.dataModelField }),
  },
} as const);

type annotationsDiffType = typeOfDataModelEntryType<typeof annotationsDiffDataModelField>;
