import { omit } from 'lodash';
import { treatmentModule, treatmentType } from '@label/core';
import { buildTreatmentRepository } from '../../../../modules/treatment';
import { addInfoInTreatment } from './addInfoInTreatment';

describe('addInfoInTreatment', () => {
  it('should add treatment info in the treatments in the database', async () => {
    const treatmentRepository = buildTreatmentRepository();
    const treatments = [{}, {}, {}].map(treatmentModule.generator.generate);
    const treatmentsWithOldModel = treatments.map((treatment) =>
      omit(treatment, [
        'addedAnnotationsCount',
        'deletedAnnotationsCount',
        'modifiedAnnotationsCount',
        'resizedBiggerAnnotationsCount',
        'resizedSmallerAnnotationsCount',
      ]),
    );
    await Promise.all(
      ((treatmentsWithOldModel as any) as treatmentType[]).map(
        treatmentRepository.insert,
      ),
    );

    await addInfoInTreatment();

    const treatmentsAfterUpdate = await treatmentRepository.findAll();
    treatmentsAfterUpdate.forEach((treatment) => {
      expect(treatment.addedAnnotationsCount).toBeDefined;
      expect(treatment.deletedAnnotationsCount).toBeDefined;
      expect(treatment.modifiedAnnotationsCount).toBeDefined;
      expect(treatment.resizedBiggerAnnotationsCount).toBeDefined;
      expect(treatment.resizedSmallerAnnotationsCount).toBeDefined;
    });
  });
});
