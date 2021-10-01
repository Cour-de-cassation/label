import { createTreatment } from './createTreatment';
import { createEmptyTreatment } from './createEmptyTreatment';
import { deleteTreatmentsByDocumentId } from './deleteTreatmentsByDocumentId';
import {
  fetchAnnotationsOfDocument,
  fetchAnnotationsDiffDetailsForDocument,
  fetchTreatedDocumentIds,
  fetchTreatmentsByDocumentId,
  fetchTreatmentsByDocumentIds,
} from './fetch';
import { countTreatmentsByDocumentId } from './count';
import { resetTreatmentLastUpdateDate } from './resetTreatmentLastUpdateDate';
import { updateTreatment } from './updateTreatment';
import { updateTreatmentDuration } from './updateTreatmentDuration';
import { updateTreatmentForDocumentIdAndUserId } from './updateTreatmentForDocumentIdAndUserId';

export { treatmentService };

const treatmentService = {
  countTreatmentsByDocumentId,
  createTreatment,
  createEmptyTreatment,
  deleteTreatmentsByDocumentId,
  fetchAnnotationsOfDocument,
  fetchAnnotationsDiffDetailsForDocument,
  fetchTreatedDocumentIds,
  fetchTreatmentsByDocumentId,
  fetchTreatmentsByDocumentIds,
  resetTreatmentLastUpdateDate,
  updateTreatment,
  updateTreatmentDuration,
  updateTreatmentForDocumentIdAndUserId,
};
