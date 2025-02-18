import { startOfDay, startOfWeek, startOfMonth, subDays } from 'date-fns';

export function getDateRangeForPeriod(period: 'day' | 'week' | 'month') {
  const now = new Date();
  let startDate: Date;

  switch (period) {
    case 'day':
      startDate = startOfDay(now);
      break;
    case 'week':
      startDate = startOfWeek(now);
      break;
    case 'month':
      startDate = startOfMonth(now);
      break;
    default:
      startDate = subDays(now, 30);
  }

  return {
    startDate,
    endDate: now
  };
}