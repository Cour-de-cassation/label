import { getSplittedTextByLine, splittedTextByLineType } from './getSplittedTextByLine';
import {
  annotationPerCategoryAndEntityType,
  annotationPerEntityType,
  groupByCategoryAndEntity,
} from './groupByCategoryAndEntity';
import { computeMultilineSelection, textNeighboursType } from './computeMultilineSelection';

export { computeMultilineSelection, getSplittedTextByLine, groupByCategoryAndEntity };

export type { annotationPerCategoryAndEntityType, annotationPerEntityType, splittedTextByLineType, textNeighboursType };
