import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { EventItem, WritebackStep } from '../types';
import { submissionContent } from '../content/submissionContent';

interface ScheduleCtx {
  events: EventItem[];
  selectedEventId: string;
  setSelectedEventId: (id: string) => void;
  appendWriteback: (eventId: string, steps: WritebackStep[]) => void;
  recentlyAppendedIds: string[];
}

const Ctx = createContext<ScheduleCtx | null>(null);

function uniqueStepId(eventId: string, time: string, label: string) {
  return `${eventId}-${time}-${label}`;
}

export function ScheduleProvider({ children }: { children: ReactNode }) {
  const initialEvents = submissionContent.schedule.events as EventItem[];
  const [events, setEvents] = useState<EventItem[]>(initialEvents);
  const [selectedEventId, setSelectedEventId] = useState<string>(initialEvents[0]?.id ?? '');
  const [recentlyAppendedIds, setRecentlyAppendedIds] = useState<string[]>([]);

  const appendWriteback = useCallback((eventId: string, steps: WritebackStep[]) => {
    if (!steps.length) return;
    const newIds = steps.map((s) => uniqueStepId(eventId, s.time, s.label));

    setEvents((prev) =>
      prev.map((e) => {
        if (e.id !== eventId) return e;
        const existing = e.writebackTimeline ?? [];
        const firstPending = existing.findIndex((s) => s.status === 'pending');
        const before = firstPending === -1 ? existing : existing.slice(0, firstPending);
        const after = firstPending === -1 ? [] : existing.slice(firstPending);
        return { ...e, writebackTimeline: [...before, ...steps, ...after] };
      }),
    );

    setRecentlyAppendedIds((prev) => Array.from(new Set([...prev, ...newIds])));
    window.setTimeout(() => {
      setRecentlyAppendedIds((prev) => prev.filter((id) => !newIds.includes(id)));
    }, 6000);
  }, []);

  return (
    <Ctx.Provider
      value={{ events, selectedEventId, setSelectedEventId, appendWriteback, recentlyAppendedIds }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useSchedule() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useSchedule must be used within ScheduleProvider');
  return v;
}

export function stepKey(eventId: string, step: WritebackStep) {
  return uniqueStepId(eventId, step.time, step.label);
}
