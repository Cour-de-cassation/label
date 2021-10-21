import { annotationType } from '../../modules/annotation';
import { settingsType } from '../../modules/settings';
import { autoLinker } from '../autoLink';
import { resolveCouldBeAnotherCategory } from './resolveCouldBeAnotherCategory';

export { buildAutoAnnotator };

function buildAutoAnnotator(settings: settingsType) {
  return {
    annotate(annotations: annotationType[]) {
      return autoLinker.autoLinkAll(resolveAllCouldBeAnotherCategory(annotations), settings);
    },
  };

  function resolveAllCouldBeAnotherCategory(annotations: annotationType[]) {
    const resolvedAnnotations: annotationType[] = [];

    annotations.forEach((annotation) =>
      resolvedAnnotations.push(resolveCouldBeAnotherCategory(annotation, annotations, settings)),
    );

    return resolvedAnnotations;
  }
}
