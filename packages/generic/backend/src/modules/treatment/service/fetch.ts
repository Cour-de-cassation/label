import { uniqWith } from 'lodash';
import { idModule, idType, treatmentModule } from '@label/core';
import { buildTreatmentRepository } from '../repository';

export {
  fetchAnnotationsOfDocument,
  fetchTreatedDocumentIds,
  fetchTreatmentsByDocumentId,
  fetchTreatmentsByDocumentIds,
};

async function fetchAnnotationsOfDocument(documentId: idType) {
  const treatmentRepository = buildTreatmentRepository();
  const treatments = await treatmentRepository.findAllByDocumentId(documentId);

  return treatmentModule.lib.computeAnnotations(treatments);
}

async function fetchTreatedDocumentIds() {
  const treatmentRepository = buildTreatmentRepository();
  const treatments = await treatmentRepository.findAllProjection([
    'documentId',
  ]);
  const treatedDocumentIds = uniqWith(
    treatments.map((treatment) => treatment.documentId),
    idModule.lib.equalId,
  );

  return treatedDocumentIds;
}

async function fetchTreatmentsByDocumentId(documentId: idType) {
  const treatmentRepository = buildTreatmentRepository();
  const treatments = await treatmentRepository.findAllByDocumentId(documentId);

  return treatments;
}

async function fetchTreatmentsByDocumentIds(documentIds: idType[]) {
  const treatmentRepository = buildTreatmentRepository();
  const treatmentsByDocumentIds = await treatmentRepository.findAllByDocumentIds(
    documentIds,
  );

  return treatmentsByDocumentIds;
}
