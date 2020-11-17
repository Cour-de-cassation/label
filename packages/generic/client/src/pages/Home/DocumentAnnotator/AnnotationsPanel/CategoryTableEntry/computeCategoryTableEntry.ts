import { uniq } from 'lodash';
import { annotatorStateHandlerType } from '../../../../../services/annotatorState';
import { clientAnonymizerType } from '../../../../../types';

export { computeCategoryTableEntry };

function computeCategoryTableEntry({
  annotatorStateHandler,
  anonymizer,
  entityId,
}: {
  annotatorStateHandler: annotatorStateHandlerType;
  anonymizer: clientAnonymizerType;
  entityId: string;
}) {
  const entityAnnotations = annotatorStateHandler
    .get()
    .annotations.filter((annotation) => annotation.entityId === entityId);
  const entityAnnotationTexts = uniq(entityAnnotations.map((annotation) => annotation.text));

  return {
    entityAnnotation: entityAnnotations[0],
    entityAnnotationAnonymizedText: anonymizer.anonymize(entityAnnotations[0]),
    entityAnnotationTexts,
    numberOfEntities: entityAnnotations.length,
  };
}
