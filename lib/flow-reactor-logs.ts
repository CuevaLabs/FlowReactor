// lib/flow-reactor-logs.ts

import { FlowType } from './flow-reactor-types';

export type ReactorSessionLog = {
  sessionId: string;
  intakeId?: string;
  flowType?: FlowType;
  target: string;
  startAt: number;
  endAt: number;
  lengthMinutes: number;
  completed: boolean;
  completionPercent?: number;
  xpAwarded?: number;
  reflection?: {
    summary: string;
    distractionsNoted?: string;
    nextStep?: string;
    createdAt: number;
  };
  insights?: {
    alignmentScore?: number;
    notes?: string;
  };
};

const KEY = 'flowReactor:logs';
let memoryLogs: ReactorSessionLog[] = [];

export function addOrUpdateLog(entry: ReactorSessionLog) {
  const all = getLogs();
  const idx = all.findIndex((x) => x.sessionId === entry.sessionId);
  if (idx >= 0) all[idx] = entry;
  else all.unshift(entry);
  setLogs(all);
}

export function getLog(sessionId: string): ReactorSessionLog | null {
  return getLogs().find((x) => x.sessionId === sessionId) ?? null;
}

export function getLogs(): ReactorSessionLog[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as ReactorSessionLog[]) : [];
    memoryLogs = parsed;
    return parsed;
  } catch {
    return memoryLogs;
  }
}

function setLogs(items: ReactorSessionLog[]) {
  if (typeof window === 'undefined') return;
  memoryLogs = items;
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    // ignore storage errors
  }
}

