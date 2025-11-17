// lib/flow-reactor-logs.ts

import { FlowType } from './flow-reactor-types';
import { readJSON, writeJSON } from './safe-storage';

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
  const stored = readJSON<ReactorSessionLog[]>(KEY) ?? [];
  memoryLogs = stored;
  return stored;
}

function setLogs(items: ReactorSessionLog[]) {
  memoryLogs = items;
  writeJSON(KEY, items);
}
