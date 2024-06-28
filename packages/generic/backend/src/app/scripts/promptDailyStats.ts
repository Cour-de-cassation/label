import { logger } from '../../utils';
import { ressourceFilterType, settingsType } from '@label/core';
import { userService } from '../../modules/user';
import { statisticService } from '../../modules/statistic';

export { promptDailyStats };

async function promptDailyStats(settings: settingsType) {
  logger.log({ operationName: 'promptDailyStats', msg: 'START' });

  // Fetch working users
  const activeUsers = (await userService.fetchWorkingUsers()).filter((user) => {
    return user.role === 'annotator' && user.isActivated === true;
  });

  // Define the date range for the last 24 hours
  const endDate = Date.now();
  const startDate = endDate - 24 * 60 * 60 * 1000;

  // Iterate over each active user and fetch their statistics
  for (const user of activeUsers) {
    const filter: ressourceFilterType = {
      mustHaveSurAnnotations: false,
      mustHaveSubAnnotations: false,
      startDate,
      endDate,
      userId: user._id, // Assuming user._id is the correct user ID
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
