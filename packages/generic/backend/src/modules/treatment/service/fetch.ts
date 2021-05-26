import {
  annotationModule,
  annotationsDiffModule,
  annotationType,
  documentType,
  idType,
  treatmentModule,
} from '@label/core';
import { buildDocumentRepository } from '../../../modules/document';
import { buildTreatmentRepository } from '../repository';

export {
  fetchAnnotationsOfDocument,
  fetchAnnotationsDiffDetailsForDocument,
  fetchTreatedDocumentIds,
  fetchTreatmentsByDocumentId,
  fetchTreatmentsByDocumentIds,
};

async function fetchAnnotationsOfDocument(documentId: idType) {
  const treatmentRepository = buildTreatmentRepository();
  const treatments = await treatmentRepository.findAllByDocumentId(documentId);

  return treatmentModule.lib.computeAnnotations(treatments);
}

async function fetchAnnotationsDiffDetailsForDocument(
  documentId: documentType['_id'],
) {
  const treatmentRepository = buildTreatmentRepository();
  const documentRepository = buildDocumentRepository();

  const document = await documentRepository.findById(documentId);
  const treatments = await treatmentRepository.findAllByDocumentId(documentId);
  const humanTreatments = treatments.filter(
    (treatment) =>
      treatment.source === 'admin' || treatment.source === 'annotator',
  );
  const annotationsDiff = treatmentModule.lib.computeAnnotationsDiff(
    humanTreatments,
  );
  const {
    addedAnnotations,
    categoryChangedAnnotations,
    deletedAnnotations,
    resizedBiggerAnnotations,
    resizedSmallerAnnotations,
  } = annotationsDiffModule.lib.computeDetailsFromAnnotationsDiff(
    annotationsDiff,
  );
  return {
    addedAnnotations: addedAnnotations.map((addedAnnotation) => {
      const {
        text,
        textStart,
        annotation,
      } = mapAnnotationToAnnotationsDiffDetails(addedAnnotation);
      return {
        text,
        textStart,
        addedAnnotation: annotation,
      };
    }),
    deletedAnnotations: deletedAnnotations.map((deletedAnnotation) => {
      const {
        text,
        textStart,
        annotation,
      } = mapAnnotationToAnnotationsDiffDetails(deletedAnnotation);

      return {
        text,
        textStart,
        deletedAnnotation: annotation,
      };
    }),
    resizedBiggerAnnotations: resizedBiggerAnnotations.map(
      mapAnnotationChangeToAnnotationsDiffDetails,
    ),
    resizedSmallerAnnotations: resizedSmallerAnnotations.map(
      mapAnnotationChangeToAnnotationsDiffDetails,
    ),
    categoryChangedAnnotations: categoryChangedAnnotations.map(
      mapAnnotationChangeToAnnotationsDiffDetails,
    ),
  };

  function mapAnnotationChangeToAnnotationsDiffDetails([
    annotationBefore,
    annotationAfter,
  ]: [annotationType, annotationType]) {
    const {
      textStart: annotationBeforeTextStart,
      textEnd: annotationBeforeTextEnd,
    } = annotationModule.lib.computeNearbyText(annotationBefore, document.text);
    const {
      textStart: annotationAfterTextStart,
      textEnd: annotationAfterTextEnd,
    } = annotationModule.lib.computeNearbyText(annotationAfter, document.text);
    const textStart = Math.min(
      annotationBeforeTextStart,
      annotationAfterTextStart,
    );
    const textEnd = Math.max(annotationBeforeTextEnd, annotationAfterTextEnd);

    const text = document.text.substring(textStart, textEnd);

    return {
      text,
      textStart,
      annotationBefore,
      annotationAfter,
    };
  }

  function mapAnnotationToAnnotationsDiffDetails(annotation: annotationType) {
    const { textEnd, textStart } = annotationModule.lib.computeNearbyText(
      annotation,
      document.text,
    );
    const text = document.text.substring(textStart, textEnd);
    return {
      text,
      textStart,
      annotation,
    };
  }
}

async function fetchTreatedDocumentIds() {
  const treatmentRepository = buildTreatmentRepository();

  return treatmentRepository.distinct('documentId');
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
