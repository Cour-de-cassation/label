import { uniq } from 'lodash';
import { fetchedAnnotationType } from '@label/core';
import { clientAnonymizerType } from '../../../../../types';

export { computeCategoryTableEntry };

function computeCategoryTableEntry({
  annotations,
  anonymizer,
}: {
  annotations: fetchedAnnotationType[];
  anonymizer: clientAnonymizerType;
}) {
  return {
    entityAnnotation: annotations[0],
    entityAnnotationAnonymizedText: anonymizer.anonymize(annotations[0]),
    entityAnnotationTexts: uniq(annotations.map((annotation) => annotation.text)),
    numberOfEntities: annotations.length,
  };
}
