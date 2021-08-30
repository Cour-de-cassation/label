import { annotationModule } from '../../../modules/annotation';
import { settingsType } from '../../settings';
import { annotationsDiffType } from '../annotationsDiffType';

export { areAnnotationsDiffCompatibleWithSettings };

function areAnnotationsDiffCompatibleWithSettings(annotationsDiff: annotationsDiffType, settings: settingsType) {
  const availableCategories = Object.keys(settings);
  return annotationsDiff.after.every(
    (annotation) =>
      availableCategories.includes(annotation.category) &&
      availableCategories.includes(annotationModule.lib.entityIdHandler.getCategory(annotation.entityId)),
  );
}
