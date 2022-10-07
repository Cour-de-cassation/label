import { statisticType } from '../statisticType';

export { dailyCount };

function dailyCount(statistics: statisticType[]) {
  const dailyCount: { [key: number]: { day: number; simple: number; exhaustive: number } } = {};
  for (const statistic of statistics) {
    const day = new Date(statistic.treatmentDate).setHours(0, 0, 0, 0);
    if (!dailyCount[day]) {
      dailyCount[day] = { day, simple: 0, exhaustive: 0 };
    }
    if (statistic.route == 'simple') {
      dailyCount[day][statistic.route]++;
    } else {
      dailyCount[day]['exhaustive']++;
    }
  }
  return dailyCount;
}
