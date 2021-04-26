import { createTreatment } from './createTreatment';
import { deleteTreatmentsByDocumentId } from './deleteTreatmentsByDocumentId';
import {
  fetchAnnotationsOfDocument,
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
  fetchTreatedDocumentIds,
  fetchTreatmentsByDocumentId,
  fetchTreatmentsByDocumentIds,
  updateTreatment,
};
