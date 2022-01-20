import { anonymizerType, fetchedDocumentType } from '@label/core';

export type { clientAnonymizerType };

type clientAnonymizerType = anonymizerType<fetchedDocumentType>;
