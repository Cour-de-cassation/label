import { statisticService } from '../../modules/statistic';

export { purgeDb };

async function purgeDb({ months }: { months: number }) {
  await statisticService.deleteStaticticsBefore({
    since: months,
    unit: 'MONTHS',
  });
}
