import { createTreatment } from './createTreatment';
import { deleteTreatmentsByDocumentId } from './deleteTreatmentsByDocumentId';
import {
  fetchAnnotationsOfDocument,
  fetchAnnotationsDiffDetailsForDocument,
  fetchTreatedDocumentIds,
  fetchTreatmentsByDocumentId,
  fetchTreatmentsByDocumentIds,
} from './fetch';
import { updateTreatment } from './updateTreatment';

export { treatmentService };

const treatmentService = {
  createTreatment,
  deleteTreatmentsByDocumentId,
  fetchAnnotationsOfDocument,
  fetchAnnotationsDiffDetailsForDocument,
  fetchTreatedDocumentIds,
  fetchTreatmentsByDocumentId,
  fetchTreatmentsByDocumentIds,
  updateTreatment,
};
