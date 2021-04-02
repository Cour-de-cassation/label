import { annotationModule } from '../annotation';
import { buildModel, buildType } from '../modelType';

export { annotationsDiffModel };

export type { annotationsDiffType };

const annotationsDiffModel = buildModel({
  kind: 'object',
  content: {
    before: { kind: 'array', content: annotationModule.model },
    after: { kind: 'array', content: annotationModule.model },
  },
} as const);

type annotationsDiffType = buildType<typeof annotationsDiffModel>;
