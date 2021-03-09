import { anonymizerType, fetchedDocumentType } from '@label/core';

export type { clientAnonymizerType, positionType, rectPositionType };

type clientAnonymizerType = anonymizerType<fetchedDocumentType>;

type positionType = {
  x: number;
  y: number;
};

type rectPositionType = {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
};
