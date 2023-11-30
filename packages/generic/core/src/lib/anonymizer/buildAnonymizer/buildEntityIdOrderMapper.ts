import { groupBy, uniq } from 'lodash';
import { annotationType } from '../../../modules/annotation';

export { buildEntityIdOrderMapper };

function buildEntityIdOrderMapper(annotations: annotationType[]): Record<string, number> {
  const grouppedAnnotationsByCategory = groupBy(annotations, 'category');
  return Object.keys(grouppedAnnotationsByCategory).reduce((entityIdOrderMapper, category) => {
    const grouppedEntityIds = uniq(grouppedAnnotationsByCategory[category].map((annotation) => annotation.entityId));
    const spreadEntityIds = grouppedEntityIds.reduce((accumulator, entityId) => {
      const orderInCategory = [...grouppedEntityIds]
        .sort((entityIdA, entityIdB) => entityIdA.localeCompare(entityIdB))
        .indexOf(entityId);
      if (orderInCategory === -1) {
        throw new Error(
          `Error in buildEntityIdOrderMapper: "${entityId}" not found for category "${category}" among "${grouppedEntityIds.join(
            ', ',
          )}"`,
        );
      }
      return { ...accumulator, [`${entityId}`]: orderInCategory };
    }, {} as Record<string, number>);
    return {
      ...entityIdOrderMapper,
      ...spreadEntityIds,
    };
  }, {});
}
