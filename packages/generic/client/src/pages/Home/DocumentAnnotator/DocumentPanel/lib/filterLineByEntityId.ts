import { splittedTextByLineType } from './getSplittedTextByLine';

export { filterLineByEntityId };

function filterLineByEntityId(entityId: string, splittedTextByLine: splittedTextByLineType): splittedTextByLineType {
  return splittedTextByLine.filter(({ content }) =>
    content.some((chunk) => {
      switch (chunk.type) {
        case 'annotation':
          return chunk.annotation.entityId === entityId;
        case 'text':
          return false;
      }
    }),
  );
}
