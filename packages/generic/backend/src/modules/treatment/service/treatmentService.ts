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
import { updateTreatment } from './updateTreatment';

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
  updateTreatment,
};
