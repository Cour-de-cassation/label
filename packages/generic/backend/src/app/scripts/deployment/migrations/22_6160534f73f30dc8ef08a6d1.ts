import { buildTreatmentRepository } from '../../../../modules/treatment';
import { buildStatisticRepository } from '../../../../modules/statistic';
import { logger } from '../../../../utils';

export { up, down };

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access*/
async function up() {
  logger.log('Up: ');

  const statisticRepository = buildStatisticRepository();
  const treatmentRepository = buildTreatmentRepository();

  const statistics = await statisticRepository.findAll();
  const treatments = await treatmentRepository.findAll();

  await Promise.all(
    statistics.map((statistic) =>
      statisticRepository.updateOne(statistic._id, {
        subAnnotationsSensitiveCount:
          (statistic as any).addedAnnotationsCount.sensitive +
          (statistic as any).modifiedAnnotationsCount.nonAnonymisedToSensitive +
          (statistic as any).resizedBiggerAnnotationsCount.sensitive,
        subAnnotationsNonSensitiveCount:
          (statistic as any).addedAnnotationsCount.other +
          (statistic as any).resizedBiggerAnnotationsCount.other,
        surAnnotationsCount:
          (statistic as any).deletedAnnotationsCount.anonymised +
          (statistic as any).modifiedAnnotationsCount
            .anonymisedToNonAnonymised +
          (statistic as any).resizedSmallerAnnotationsCount.anonymised,
      }),
    ),
  );
  await statisticRepository.deletePropertiesForMany({}, [
    'addedAnnotationsCount',
    'deletedAnnotationsCount',
    'modifiedAnnotationsCount',
    'resizedBiggerAnnotationsCount',
    'resizedSmallerAnnotationsCount',
  ]);

  await Promise.all(
    treatments.map((treatment) =>
      treatmentRepository.updateOne(treatment._id, {
        subAnnotationsSensitiveCount:
          (treatment as any).addedAnnotationsCount.sensitive +
          (treatment as any).modifiedAnnotationsCount.nonAnonymisedToSensitive +
          (treatment as any).resizedBiggerAnnotationsCount.sensitive,
        subAnnotationsNonSensitiveCount:
          (treatment as any).addedAnnotationsCount.other +
          (treatment as any).resizedBiggerAnnotationsCount.other,
        surAnnotationsCount:
          (treatment as any).deletedAnnotationsCount.anonymised +
          (treatment as any).modifiedAnnotationsCount
            .anonymisedToNonAnonymised +
          (treatment as any).resizedSmallerAnnotationsCount.anonymised,
      }),
    ),
  );
  await treatmentRepository.deletePropertiesForMany({}, [
    'addedAnnotationsCount',
    'deletedAnnotationsCount',
    'modifiedAnnotationsCount',
    'resizedBiggerAnnotationsCount',
    'resizedSmallerAnnotationsCount',
  ]);
}

async function down() {
  logger.log('Down: ');

  const statisticRepository = buildStatisticRepository();
  const treatmentRepository = buildTreatmentRepository();

  const statistics = await statisticRepository.findAll();
  const treatments = await treatmentRepository.findAll();

  await Promise.all(
    statistics.map((statistic) =>
      statisticRepository.updateOne(statistic._id, {
        addedAnnotationsCount: {
          sensitive: statistic.subAnnotationsSensitiveCount,
          other: statistic.subAnnotationsNonSensitiveCount,
        },
        deletedAnnotationsCount: {
          anonymised: statistic.surAnnotationsCount,
          other: 0,
        },
        modifiedAnnotationsCount: {
          nonAnonymisedToSensitive: 0,
          anonymisedToNonAnonymised: 0,
          other: 0,
        },
        resizedBiggerAnnotationsCount: { sensitive: 0, other: 0 },
        resizedSmallerAnnotationsCount: { anonymised: 0, other: 0 },
      } as any),
    ),
  );
  await statisticRepository.deletePropertiesForMany({}, [
    'subAnnotationsSensitiveCount',
    'subAnnotationsNonSensitiveCount',
    'surAnnotationsCount',
  ]);

  await Promise.all(
    treatments.map((treatment) =>
      treatmentRepository.updateOne(treatment._id, {
        addedAnnotationsCount: {
          sensitive: treatment.subAnnotationsSensitiveCount,
          other: treatment.subAnnotationsNonSensitiveCount,
        },
        deletedAnnotationsCount: {
          anonymised: treatment.surAnnotationsCount,
          other: 0,
        },
        modifiedAnnotationsCount: {
          nonAnonymisedToSensitive: 0,
          anonymisedToNonAnonymised: 0,
          other: 0,
        },
        resizedBiggerAnnotationsCount: { sensitive: 0, other: 0 },
        resizedSmallerAnnotationsCount: { anonymised: 0, other: 0 },
      } as any),
    ),
  );
  await treatmentRepository.deletePropertiesForMany({}, [
    'subAnnotationsSensitiveCount',
    'subAnnotationsNonSensitiveCount',
    'surAnnotationsCount',
  ]);
}
