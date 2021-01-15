import { anonymizerType, fetchedDocumentType } from '@label/core';

export type { clientAnonymizerType, positionType };

type clientAnonymizerType = anonymizerType<fetchedDocumentType>;

type positionType = {
  x: number;
  y: number;
};
