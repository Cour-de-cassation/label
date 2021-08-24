import { groupBy } from 'lodash';
import { annotationModule } from '../../../modules/annotation';

export { buildEntityIdOrderMapper };

function buildEntityIdOrderMapper(entityIds: string[]): Record<string, number> {
  const grouppedByCategoryEntityIds = groupBy(entityIds, annotationModule.lib.entityIdHandler.getCategory);
  return Object.keys(grouppedByCategoryEntityIds).reduce((entityIdOrderMapper, category) => {
    const grouppedEntityIds = grouppedByCategoryEntityIds[category];
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
      return { ...accumulator, [entityId]: orderInCategory };
    }, {} as Record<string, number>);
    return {
      ...entityIdOrderMapper,
      ...spreadEntityIds,
    };
  }, {});
}
