import { annotationType } from '../../modules/annotation';
import { settingsType } from '../../modules/settings';
import { autoLinker } from '../autoLink';

export { buildAutoAnnotator };

function buildAutoAnnotator(settings: settingsType) {
  return {
    annotate(annotations: annotationType[]) {
      return autoLinker.autoLinkAll(annotations, settings);
    },
  };
}
