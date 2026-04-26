import type {EventItem} from '../types';

type CalendarMonthKind = 'prev' | 'curr' | 'next';

export interface CalendarDay {
  key: string;
  day: number;
  month: CalendarMonthKind;
}

export interface CalendarModel {
  monthLabel: string;
  days: CalendarDay[];
  eventsByDate: Record<string, EventItem[]>;
  todayKey: string;
}

function parseCalendarDate(calendarDate: string) {
  const [year, month, day] = calendarDate.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function formatCalendarKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getMonthKind(date: Date, monthAnchor: Date): CalendarMonthKind {
  const dateValue = date.getFullYear() * 12 + date.getMonth();
  const anchorValue = monthAnchor.getFullYear() * 12 + monthAnchor.getMonth();

  if (dateValue < anchorValue) return 'prev';
  if (dateValue > anchorValue) return 'next';
  return 'curr';
}

export function buildCalendarModel(events: EventItem[]): CalendarModel {
  const todayKey = formatCalendarKey(new Date());

  if (events.length === 0) {
    return {
      monthLabel: '待定',
      days: [],
      eventsByDate: {},
      todayKey,
    };
  }

  const sortedDates = events
    .map((event) => event.calendarDate)
    .filter(Boolean)
    .sort();

  const anchorDate = parseCalendarDate(sortedDates[0] ?? todayKey);
  const monthStart = new Date(anchorDate.getFullYear(), anchorDate.getMonth(), 1);
  const monthEnd = new Date(anchorDate.getFullYear(), anchorDate.getMonth() + 1, 0);
  const leadingDays = monthStart.getDay();
  const totalSlots = Math.ceil((leadingDays + monthEnd.getDate()) / 7) * 7;
  const gridStart = new Date(anchorDate.getFullYear(), anchorDate.getMonth(), 1 - leadingDays);

  const days: CalendarDay[] = Array.from({length: totalSlots}, (_, index) => {
    const date = new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + index);
    return {
      key: formatCalendarKey(date),
      day: date.getDate(),
      month: getMonthKind(date, anchorDate),
    };
  });

  const eventsByDate = events.reduce<Record<string, EventItem[]>>((acc, event) => {
    if (!acc[event.calendarDate]) {
      acc[event.calendarDate] = [];
    }
    acc[event.calendarDate].push(event);
    return acc;
  }, {});

  return {
    monthLabel: `${anchorDate.getFullYear()} 年 ${anchorDate.getMonth() + 1} 月`,
    days,
    eventsByDate,
    todayKey,
  };
}
