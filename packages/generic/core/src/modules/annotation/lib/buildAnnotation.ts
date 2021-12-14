import { entityIdHandler } from './entityIdHandler';

export { buildAnnotation };

function buildAnnotation({
  category,
  start,
  text,
  certaintyScore,
}: {
  category: string;
  start: number;
  text: string;
  certaintyScore?: number;
}) {
  return {
    category,
    entityId: entityIdHandler.compute(category, text),
    start,
    text,
    certaintyScore,
  };
}
