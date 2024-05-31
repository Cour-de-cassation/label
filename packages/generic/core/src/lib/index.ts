import { buildAnonymizer, anonymizerType } from './anonymizer';
import { autoLinker } from './autoLink';
import { annotationHandler } from './annotationHandler';
import { annotationLinkHandler } from './annotationLinkHandler';
import { annotationOverlapDetector } from './annotationOverlapDetector';
import { annotationTextDetector } from './annotationTextDetector';
import { statisticsCreator } from './statisticsCreator';
import { stringComparator, stringComparisonSensitivityType } from './stringComparator';
import { annotationChunkType, textChunkType, textChunkContentType, textSplitter } from './textSplitter';
import { dateType, timeOperator } from './timeOperator';

export {
  annotationHandler,
  annotationLinkHandler,
  annotationOverlapDetector,
  annotationTextDetector,
  autoLinker,
  buildAnonymizer,
  statisticsCreator,
  stringComparator,
  textSplitter,
  timeOperator,
};

export type {
  anonymizerType,
  annotationChunkType,
  dateType,
  stringComparisonSensitivityType,
  textChunkType,
  textChunkContentType,
};
