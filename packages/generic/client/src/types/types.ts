import { anonymizerType, fetchedAnnotationType, fetchedDocumentType } from '@label/core';

export type { clientAnonymizerType };

type clientAnonymizerType = anonymizerType<fetchedAnnotationType, fetchedDocumentType>;
