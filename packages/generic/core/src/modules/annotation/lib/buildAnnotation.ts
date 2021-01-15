import { entityIdHandler } from './entityIdHandler';

export { buildAnnotation };

function buildAnnotation({ category, start, text }: { category: string; start: number; text: string }) {
  return {
    category,
    entityId: entityIdHandler.compute(category, text),
    start,
    text,
  };
}
