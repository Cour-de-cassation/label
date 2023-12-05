import { annotationType } from '@label/core';
import { buildTreatmentRepository } from '../../../../modules/treatment';
import { logger } from '../../../../utils';

export { up, down };

async function up() {
  logger.log({ operationName: 'migration', msg: 'Up: ' });

  const treatmentRepository = buildTreatmentRepository();

  const treatments = await treatmentRepository.findAll();

  await Promise.all(
    treatments.map((treatment) => {
      const newAnnotationsDiff = {
        before: treatment.annotationsDiff.before.map(updateAnnotationUp),
        after: treatment.annotationsDiff.after.map(updateAnnotationUp),
      };
      return treatmentRepository.updateOne(treatment._id, {
        annotationsDiff: newAnnotationsDiff,
      });
    }),
  );
}

async function down() {
  logger.log({ operationName: 'migration', msg: 'Down: ' });

  const treatmentRepository = buildTreatmentRepository();

  const treatments = await treatmentRepository.findAll();

  await Promise.all(
    treatments.map((treatment) => {
      const newAnnotationsDiff = {
        before: treatment.annotationsDiff.before.map(updateAnnotationDown),
        after: treatment.annotationsDiff.after.map(updateAnnotationDown),
      };
      return treatmentRepository.updateOne(treatment._id, {
        annotationsDiff: newAnnotationsDiff,
      });
    }),
  );
}

function updateAnnotationUp(annotation: annotationType): annotationType {
  if (
    annotation.category === 'personnePhysiqueNom' ||
    annotation.category === 'personnePhysiquePrenom'
  ) {
    return {
      ...annotation,
      entityId: annotation.entityId
        .replace('personnePhysiqueNom', 'personnePhysique')
        .replace('personnePhysiquePrenom', 'personnePhysique'),
      category: 'personnePhysique',
    };
  }
  if (
    annotation.category === 'professionnelNom' ||
    annotation.category === 'professionnelPrenom'
  ) {
    return {
      ...annotation,
      entityId: annotation.entityId
        .replace('professionnelNom', 'professionnelAvocat')
        .replace('professionnelPrenom', 'professionnelAvocat'),
      category: 'professionnelAvocat',
    };
  }
  return annotation;
}

function updateAnnotationDown(annotation: annotationType): annotationType {
  if (annotation.category === 'personnePhysique') {
    return {
      ...annotation,
      entityId: annotation.entityId.replace(
        'personnePhysique',
        'personnePhysiqueNom',
      ),
      category: 'personnePhysiqueNom',
    };
  }
  if (
    annotation.category === 'professionnelAvocat' ||
    annotation.category === 'professionnelMagistratGreffier'
  ) {
    return {
      ...annotation,
      entityId: annotation.entityId
        .replace('professionnelAvocat', 'professionnelNom')
        .replace('professionnelMagistratGreffier', 'professionnelNom'),
      category: 'professionnelNom',
    };
  }
  if (annotation.category === 'numeroSiretSiren') {
    return {
      ...annotation,
      entityId: annotation.entityId.replace(
        'numeroSiretSiren',
        'personneMorale',
      ),
      category: 'personneMorale',
    };
  }
  return annotation;
}
