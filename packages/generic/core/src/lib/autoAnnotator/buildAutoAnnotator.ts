import { annotationType, settingsType } from '../../modules';
import { autoLinker } from '../autoLink';
import { resolveCouldBeAnotherCategory } from './resolveCouldBeAnotherCategory';

export { buildAutoAnnotator };

function buildAutoAnnotator(settings: settingsType) {
  return {
    annotate(annotations: annotationType[]) {
      return autoLinker.autoLinkAll(resolveAllCouldBeAnotherCategory(annotations));
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
