import { buildTreatmentRepository } from '../../../../modules/treatment';
import { buildStatisticRepository } from '../../../../modules/statistic';
import { logger } from '../../../../utils';

export { up, down };

/* eslint-disable @typescript-eslint/no-unsafe-member-access*/
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
async function up() {
  logger.log({ operationName: 'migration', msg: 'Up: ' });

  const statisticRepository = buildStatisticRepository();
  const statistics = await statisticRepository.findAll();

  await Promise.all(
    statistics.map((statistic) => {
      return statisticRepository.updateOne(statistic._id, {
        addedAnnotationsCount: {
          sensitive: 0,
          other: ((statistic as any)
            .addedAnnotationsCount as unknown) as number,
        },
        deletedAnnotationsCount: {
          anonymised: 0,
          other: ((statistic as any)
            .deletedAnnotationsCount as unknown) as number,
        },
        modifiedAnnotationsCount: {
          anonymisedToNonAnonymised: 0,
          nonAnonymisedToSensitive: 0,
          other: ((statistic as any)
            .modifiedAnnotationsCount as unknown) as number,
        },
        resizedBiggerAnnotationsCount: {
          sensitive: 0,
          other: ((statistic as any)
            .resizedBiggerAnnotationsCount as unknown) as number,
        },
        resizedSmallerAnnotationsCount: {
          anonymised: 0,
          other: ((statistic as any)
            .resizedSmallerAnnotationsCount as unknown) as number,
        },
      } as any);
    }),
  );

  const treatmentRepository = buildTreatmentRepository();
  const treatments = await treatmentRepository.findAll();

  await Promise.all(
    treatments.map((treatment) => {
      return treatmentRepository.updateOne(treatment._id, {
        addedAnnotationsCount: {
          sensitive: 0,
          other: ((treatment as any)
            .addedAnnotationsCount as unknown) as number,
        },
        deletedAnnotationsCount: {
          anonymised: 0,
          other: ((treatment as any)
            .deletedAnnotationsCount as unknown) as number,
        },
        modifiedAnnotationsCount: {
          anonymisedToNonAnonymised: 0,
          nonAnonymisedToSensitive: 0,
          other: ((treatment as any)
            .modifiedAnnotationsCount as unknown) as number,
        },
        resizedBiggerAnnotationsCount: {
          sensitive: 0,
          other: ((treatment as any)
            .resizedBiggerAnnotationsCount as unknown) as number,
        },
        resizedSmallerAnnotationsCount: {
          anonymised: 0,
          other: ((treatment as any)
            .resizedSmallerAnnotationsCount as unknown) as number,
        },
      } as any);
    }),
  );
}

async function down() {
  logger.log({ operationName: 'migration', msg: 'Down: ' });

  const statisticRepository = buildStatisticRepository();
  const statistics = await statisticRepository.findAll();

  await Promise.all(
    statistics.map((statistic) => {
      return statisticRepository.updateOne(statistic._id, {
        addedAnnotationsCount:
          (statistic as any).addedAnnotationsCount.sensitive +
          (statistic as any).addedAnnotationsCount.other,
        deletedAnnotationsCount:
          (statistic as any).deletedAnnotationsCount.anonymised +
          (statistic as any).deletedAnnotationsCount.other,
        resizedBiggerAnnotationsCount:
          (statistic as any).resizedBiggerAnnotationsCount.sensitive +
          (statistic as any).resizedBiggerAnnotationsCount.other,
        resizedSmallerAnnotationsCount:
          (statistic as any).resizedSmallerAnnotationsCount.anonymised +
          (statistic as any).resizedSmallerAnnotationsCount.other,
        modifiedAnnotationsCount:
          (statistic as any).modifiedAnnotationsCount
            .anonymisedToNonAnonymised +
          (statistic as any).modifiedAnnotationsCount.nonAnonymisedToSensitive +
          (statistic as any).modifiedAnnotationsCount.other,
      } as any);
    }),
  );

  const treatmentRepository = buildTreatmentRepository();
  const treatments = await treatmentRepository.findAll();

  await Promise.all(
    treatments.map((treatment) => {
      return treatmentRepository.updateOne(treatment._id, {
        addedAnnotationsCount:
          (treatment as any).addedAnnotationsCount.sensitive +
          (treatment as any).addedAnnotationsCount.other,
        deletedAnnotationsCount:
          (treatment as any).deletedAnnotationsCount.anonymised +
          (treatment as any).deletedAnnotationsCount.other,
        resizedBiggerAnnotationsCount:
          (treatment as any).resizedBiggerAnnotationsCount.sensitive +
          (treatment as any).resizedBiggerAnnotationsCount.other,
        resizedSmallerAnnotationsCount:
          (treatment as any).resizedSmallerAnnotationsCount.anonymised +
          (treatment as any).resizedSmallerAnnotationsCount.other,
        modifiedAnnotationsCount:
          (treatment as any).modifiedAnnotationsCount
            .anonymisedToNonAnonymised +
          (treatment as any).modifiedAnnotationsCount.nonAnonymisedToSensitive +
          (treatment as any).modifiedAnnotationsCount.other,
      } as any);
    }),
  );
}
