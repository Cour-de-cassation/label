import { omit } from 'lodash';
import { migrationModule, migrationType } from '@label/core';
import { buildMigrationRepository } from '../../../../modules/migration';
import { up, down } from '../migrations/1_60a764a45f9f3f8b2ec6a272';

describe('add order in migration model', () => {
  const migrationsWithNewModel = [
    migrationModule.generator.generate({
      order: 2,
      creationDate: new Date(2021).getTime(),
    }),
    migrationModule.generator.generate({
      order: 0,
      creationDate: new Date(2019).getTime(),
    }),
    migrationModule.generator.generate({
      order: 1,
      creationDate: new Date(2020).getTime(),
    }),
  ];
  const migrationsWithOldModel = [
    omit(migrationsWithNewModel[0], 'order'),
    omit(migrationsWithNewModel[1], 'order'),
    omit(migrationsWithNewModel[2], 'order'),
  ];

  it('should test up', async () => {
    const migrationRepository = buildMigrationRepository();
    await Promise.all(
      ((migrationsWithOldModel as any) as migrationType[]).map(
        migrationRepository.insert,
      ),
    );

    await up();

    const migrationsAfterUpdateModel = await migrationRepository.findAll();
    expect(migrationsAfterUpdateModel.sort()).toEqual(
      migrationsWithNewModel.sort(),
    );
  });

  it('should test down', async () => {
    const migrationRepository = buildMigrationRepository();
    await Promise.all(migrationsWithNewModel.map(migrationRepository.insert));

    await down();

    const migrationsAfterUpdateModel = await migrationRepository.findAll();
    expect(migrationsAfterUpdateModel.sort()).toEqual(
      migrationsWithOldModel.sort(),
    );
  });
});
