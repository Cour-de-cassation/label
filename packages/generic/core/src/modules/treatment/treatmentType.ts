import { annotationsDiffModule } from '../annotationsDiff';
import { idType } from '../id';
import { buildModel, buildType } from '../modelType';

export { treatmentModel };

export type { treatmentType };

const treatmentModel = buildModel({
  kind: 'object',
  content: {
    _id: { kind: 'custom', content: 'id' },
    annotationsDiff: annotationsDiffModule.model,
    documentId: { kind: 'custom', content: 'id' },
    duration: { kind: 'primitive', content: 'number' },
    lastUpdateDate: { kind: 'primitive', content: 'number' },
    order: { kind: 'primitive', content: 'number' },
    surAnnotationsCount: {
      kind: 'primitive',
      content: 'number',
    },
    subAnnotationsSensitiveCount: {
      kind: 'primitive',
      content: 'number',
    },
    subAnnotationsNonSensitiveCount: {
      kind: 'primitive',
      content: 'number',
    },
    source: {
      kind: 'constant',
      content: ['annotator', 'admin', 'NLP', 'postProcess', 'supplementaryAnnotations', 'reimportedTreatment'] as const,
    },
  },
} as const);

type treatmentType = buildType<typeof treatmentModel, { id: idType }>;
