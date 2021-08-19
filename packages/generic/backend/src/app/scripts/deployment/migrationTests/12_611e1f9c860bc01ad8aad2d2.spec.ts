import { annotationModule, treatmentModule } from '@label/core';
import { buildTreatmentRepository } from '../../../../modules/treatment';
import { up, down } from '../migrations/12_611e1f9c860bc01ad8aad2d2';

describe('update categories settings', () => {
  const treatmentWithOldModelForUp = treatmentModule.generator.generate({
    annotationsDiff: {
      before: [
        annotationModule.lib.buildAnnotation({
          category: 'personnePhysiquePrenom',
          text: 'Benoit',
          start: 0,
        }),
        annotationModule.lib.buildAnnotation({
          category: 'personnePhysiqueNom',
          text: 'Serrano',
          start: 10,
        }),
        annotationModule.lib.buildAnnotation({
          category: 'professionnelPrenom',
          text: 'Romain',
          start: 20,
        }),
        annotationModule.lib.buildAnnotation({
          category: 'professionnelNom',
          text: 'Glé',
          start: 30,
        }),
        annotationModule.lib.buildAnnotation({
          category: 'adresse',
          text: "5 quai de l'horloge",
          start: 40,
        }),
      ],
      after: [],
    },
  });
  const treatmentWithNewModelForUp = treatmentModule.generator.generate({
    ...treatmentWithOldModelForUp,
    annotationsDiff: {
      before: [
        annotationModule.lib.buildAnnotation({
          category: 'personnePhysique',
          text: 'Benoit',
          start: 0,
        }),
        annotationModule.lib.buildAnnotation({
          category: 'personnePhysique',
          text: 'Serrano',
          start: 10,
        }),
        annotationModule.lib.buildAnnotation({
          category: 'professionnelAvocat',
          text: 'Romain',
          start: 20,
        }),
        annotationModule.lib.buildAnnotation({
          category: 'professionnelAvocat',
          text: 'Glé',
          start: 30,
        }),
        annotationModule.lib.buildAnnotation({
          category: 'adresse',
          text: "5 quai de l'horloge",
          start: 40,
        }),
      ],
      after: [],
    },
  });

  const treatmentWithNewModelForDown = treatmentModule.generator.generate({
    annotationsDiff: {
      before: [
        annotationModule.lib.buildAnnotation({
          category: 'personnePhysique',
          text: 'Benoit',
          start: 0,
        }),
        annotationModule.lib.buildAnnotation({
          category: 'professionnelAvocat',
          text: 'Romain',
          start: 20,
        }),
        annotationModule.lib.buildAnnotation({
          category: 'professionnelMagistratGreffier',
          text: 'Glé',
          start: 30,
        }),
        annotationModule.lib.buildAnnotation({
          category: 'adresse',
          text: "5 quai de l'horloge",
          start: 40,
        }),
        annotationModule.lib.buildAnnotation({
          category: 'numeroSiretSiren',
          text: '123431234',
          start: 60,
        }),
      ],
      after: [],
    },
  });
  const treatmentWithOldModelForDown = treatmentModule.generator.generate({
    ...treatmentWithNewModelForDown,
    annotationsDiff: {
      before: [
        annotationModule.lib.buildAnnotation({
          category: 'personnePhysiqueNom',
          text: 'Benoit',
          start: 0,
        }),
        annotationModule.lib.buildAnnotation({
          category: 'professionnelNom',
          text: 'Romain',
          start: 20,
        }),
        annotationModule.lib.buildAnnotation({
          category: 'professionnelNom',
          text: 'Glé',
          start: 30,
        }),
        annotationModule.lib.buildAnnotation({
          category: 'adresse',
          text: "5 quai de l'horloge",
          start: 40,
        }),
        annotationModule.lib.buildAnnotation({
          category: 'personneMorale',
          text: '123431234',
          start: 60,
        }),
      ],
      after: [],
    },
  });

  it('should test up', async () => {
    const treatmentRepository = buildTreatmentRepository();
    await treatmentRepository.insert(treatmentWithOldModelForUp);
    await up();

    const treatmentAfterUpdateModel = await treatmentRepository.findById(
      treatmentWithOldModelForUp._id,
    );
    expect(treatmentAfterUpdateModel).toEqual(treatmentWithNewModelForUp);
  });

  it('should test down', async () => {
    const treatmentRepository = buildTreatmentRepository();
    await treatmentRepository.insert(treatmentWithNewModelForDown);
    await down();

    const treatmentAfterUpdateModel = await treatmentRepository.findById(
      treatmentWithNewModelForDown._id,
    );
    expect(treatmentAfterUpdateModel).toEqual(treatmentWithOldModelForDown);
  });
});
