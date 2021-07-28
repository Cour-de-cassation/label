import { maxBy, min, sumBy } from 'lodash';
import { annotationsDiffModule } from '../../annotationsDiff';
import { settingsType } from '../../settings';
import { treatmentType } from '../treatmentType';
import { assertTreatmentsSameDocumentId } from './assertTreatmentsSameDocumentId';
import { build } from './build';
import { computeTreatmentIdsText } from './computeTreatmentIdsText';

export { aggregate };

function aggregate(
  treatments: treatmentType[],
  source: treatmentType['source'],
  settings: settingsType,
): treatmentType {
  if (treatments.length === 0) {
    throw new Error(`Could not aggregate an empty treatments array`);
  }
  const order = min(treatments.map(({ order }) => order));

  if (order === undefined) {
    throw new Error(`Could not compute the minimum order for treatments ${computeTreatmentIdsText(treatments)}`);
  }

  const duration = sumBy(treatments, (treatment) => treatment.duration);
  const lastTreatment = maxBy(treatments, (treatment) => treatment.order);
  if (lastTreatment === undefined) {
    throw new Error(
      `Could not compute the last treatment by order for treatments ${computeTreatmentIdsText(treatments)}`,
    );
  }
  assertTreatmentsSameDocumentId(treatments);
  const annotationsDiff = annotationsDiffModule.lib.squash(treatments.map((treatment) => treatment.annotationsDiff));

  const treatment = build({ order, source, documentId: treatments[0].documentId, annotationsDiff }, settings);
  return { ...treatment, duration, lastUpdateDate: lastTreatment.lastUpdateDate };
}
