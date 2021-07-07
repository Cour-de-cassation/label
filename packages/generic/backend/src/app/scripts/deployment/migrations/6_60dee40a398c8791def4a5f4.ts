import { buildTreatmentRepository } from '../../../../modules/treatment';
import { buildStatisticRepository } from '../../../../modules/statistic';
import { logger } from '../../../../utils';

export { up, down };

async function up() {
  logger.log('Up: ');

  const statisticRepository = buildStatisticRepository();
  const statistics = await statisticRepository.findAll();

  await Promise.all(
    statistics.map((statistic) => {
      return statisticRepository.updateOne(statistic._id, {
        addedAnnotationsCount: {
          sensitive: 0,
          other: (statistic.addedAnnotationsCount as unknown) as number,
        },
        deletedAnnotationsCount: {
          anonymised: 0,
          other: (statistic.deletedAnnotationsCount as unknown) as number,
        },
        modifiedAnnotationsCount: {
          anonymisedToNonAnonymised: 0,
          nonAnonymisedToSensitive: 0,
          other: (statistic.modifiedAnnotationsCount as unknown) as number,
        },
        resizedBiggerAnnotationsCount: {
          sensitive: 0,
          other: (statistic.resizedBiggerAnnotationsCount as unknown) as number,
        },
        resizedSmallerAnnotationsCount: {
          anonymised: 0,
          other: (statistic.resizedSmallerAnnotationsCount as unknown) as number,
        },
      });
    }),
  );

  const treatmentRepository = buildTreatmentRepository();
  const treatments = await treatmentRepository.findAll();

  await Promise.all(
    treatments.map((treatment) => {
      return treatmentRepository.updateOne(treatment._id, {
        addedAnnotationsCount: {
          sensitive: 0,
          other: (treatment.addedAnnotationsCount as unknown) as number,
        },
        deletedAnnotationsCount: {
          anonymised: 0,
          other: (treatment.deletedAnnotationsCount as unknown) as number,
        },
        modifiedAnnotationsCount: {
          anonymisedToNonAnonymised: 0,
          nonAnonymisedToSensitive: 0,
          other: (treatment.modifiedAnnotationsCount as unknown) as number,
        },
        resizedBiggerAnnotationsCount: {
          sensitive: 0,
          other: (treatment.resizedBiggerAnnotationsCount as unknown) as number,
        },
        resizedSmallerAnnotationsCount: {
          anonymised: 0,
          other: (treatment.resizedSmallerAnnotationsCount as unknown) as number,
        },
      });
    }),
  );
}

async function down() {
  logger.log('Down: ');

  const statisticRepository = buildStatisticRepository();
  const statistics = await statisticRepository.findAll();

  await Promise.all(
    statistics.map((statistic) => {
      return statisticRepository.updateOne(statistic._id, {
        addedAnnotationsCount:
          statistic.addedAnnotationsCount.sensitive +
          statistic.addedAnnotationsCount.other,
        deletedAnnotationsCount:
          statistic.deletedAnnotationsCount.anonymised +
          statistic.deletedAnnotationsCount.other,
        resizedBiggerAnnotationsCount:
          statistic.resizedBiggerAnnotationsCount.sensitive +
          statistic.resizedBiggerAnnotationsCount.other,
        resizedSmallerAnnotationsCount:
          statistic.resizedSmallerAnnotationsCount.anonymised +
          statistic.resizedSmallerAnnotationsCount.other,
        modifiedAnnotationsCount:
          statistic.modifiedAnnotationsCount.anonymisedToNonAnonymised +
          statistic.modifiedAnnotationsCount.nonAnonymisedToSensitive +
          statistic.modifiedAnnotationsCount.other,
      } as any);
    }),
  );

  const treatmentRepository = buildTreatmentRepository();
  const treatments = await treatmentRepository.findAll();

  await Promise.all(
    treatments.map((treatment) => {
      return treatmentRepository.updateOne(treatment._id, {
        addedAnnotationsCount:
          treatment.addedAnnotationsCount.sensitive +
          treatment.addedAnnotationsCount.other,
        deletedAnnotationsCount:
          treatment.deletedAnnotationsCount.anonymised +
          treatment.deletedAnnotationsCount.other,
        resizedBiggerAnnotationsCount:
          treatment.resizedBiggerAnnotationsCount.sensitive +
          treatment.resizedBiggerAnnotationsCount.other,
        resizedSmallerAnnotationsCount:
          treatment.resizedSmallerAnnotationsCount.anonymised +
          treatment.resizedSmallerAnnotationsCount.other,
        modifiedAnnotationsCount:
          treatment.modifiedAnnotationsCount.anonymisedToNonAnonymised +
          treatment.modifiedAnnotationsCount.nonAnonymisedToSensitive +
          treatment.modifiedAnnotationsCount.other,
      } as any);
    }),
  );
}
