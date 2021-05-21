import { migrationModule } from '@label/core';
import { buildMigrationRepository } from '../repository';
import { migrationService } from './migrationService';

describe('migrationService', () => {
  describe('fetchLastOne', () => {
    it('should return last run migration', async () => {
      const migrationRepository = buildMigrationRepository();
      const migrations = [2, 1, 0].map((order) =>
        migrationModule.generator.generate({ order }),
      );
      await Promise.all(migrations.map(migrationRepository.insert));

      const lastMigration = await migrationService.fetchLastOne();

      expect(lastMigration).toEqual(migrations[0]);
    });
  });
});
