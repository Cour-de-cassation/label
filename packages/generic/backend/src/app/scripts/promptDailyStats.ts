import { logger } from '../../utils';
import { ressourceFilterType, settingsType } from '@label/core';
import { userService } from '../../modules/user';
import { statisticService } from '../../modules/statistic';

export { promptDailyStats };

async function promptDailyStats(settings: settingsType) {
  logger.log({ operationName: 'promptDailyStats', msg: 'START' });

  const activeUsers = (await userService.fetchWorkingUsers()).filter((user) => {
    return user.role === 'annotator' && user.isActivated === true;
  });

  const endDate = Date.now();
  const startDate = endDate - 24 * 60 * 60 * 1000;

  for (const user of activeUsers) {
    const filter: ressourceFilterType = {
      mustHaveSurAnnotations: false,
      mustHaveSubAnnotations: false,
      startDate,
      endDate,
      userId: user._id,
      importer: undefined,
      jurisdiction: undefined,
      publicationCategory: undefined,
      route: undefined,
      source: undefined,
    };

    try {
      const aggregatedStats = await statisticService.fetchAggregatedStatisticsAccordingToFilter(
        filter,
        settings,
      );
      logger.log({
        operationName: 'userDailyStats',
        msg: `dailyStats of ${user.name}`,
        data: { userName: user.name, ...aggregatedStats },
      });
    } catch (error) {
      logger.error({
        operationName: 'promptDailyStats',
        msg: `Error fetching stats: ${error}`,
      });
    }
  }

  logger.log({ operationName: 'promptDailyStats', msg: 'END' });
}
