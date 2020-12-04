import { anonymizerType, fetchedAnnotationType, fetchedDocumentType } from '@label/core';

export type { clientAnonymizerType, positionType };

type clientAnonymizerType = anonymizerType<fetchedAnnotationType, fetchedDocumentType>;

type positionType = {
  x: number;
  y: number;
};
