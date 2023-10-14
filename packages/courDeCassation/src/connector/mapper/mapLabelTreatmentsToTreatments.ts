import { decisionType } from 'sder';
import {
  documentType,
  documentModule,
  idModule,
  timeOperator,
  treatmentType,
} from '@label/core';
import {
  extractReadableChamberName,
  extractReadableJurisdictionName,
  extractAppealNumber,
} from './extractors';
import { extractRoute } from './extractors/extractRoute';
import { categoriesMapper } from './categoriesMapper';
import { labelTreatmentsType, treatmentService } from '@label/backend';

export { mapLabelTreatmentsToTreatments };

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
async function mapLabelTreatmentsToTreatments(
  labelTreatments: labelTreatmentsType,
): Promise<treatmentType[]> {
  const treatments: treatmentType[];

  for (const labelTreatment of labelTreatments) {
    treatments.push(treatmentService.createTreatment()));
  }

  return treatments;
}
