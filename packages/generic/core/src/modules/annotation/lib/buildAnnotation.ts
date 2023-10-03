import { entityIdHandler } from './entityIdHandler';

export { buildAnnotation };

function buildAnnotation({
  category,
  start,
  text,
  certaintyScore,
  entityId,
}: {
  category: string;
  start: number;
  text: string;
  certaintyScore?: number;
  entityId?: string;
}) {
    return {
      category,
      entityId: entityId ?? entityIdHandler.compute(category, text),
      start,
      text,
      certaintyScore,
    };
  }
