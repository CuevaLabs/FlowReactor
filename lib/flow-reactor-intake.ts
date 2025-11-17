// lib/flow-reactor-intake.ts

import { FlowType } from './flow-reactor-types';

export type ReactorAnswers = {
  id: string;
  createdAt: number;
  flowType: FlowType;
  answers: Record<string, string>;
};

const KEY = 'flowReactor:intakes';
let memoryIntakes: ReactorAnswers[] = [];

export function saveIntake(
  flowType: FlowType,
  answers: Record<string, string>
): ReactorAnswers {
  const record: ReactorAnswers = {
    id: randomId(),
    createdAt: Date.now(),
    flowType,
    answers,
  };
  const all = getAllIntakes();
  all.unshift(record);
  setAllIntakes(all);
  return record;
}

export function getIntake(id: string): ReactorAnswers | null {
  return getAllIntakes().find((x) => x.id === id) ?? null;
}

export function getAllIntakes(): ReactorAnswers[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as ReactorAnswers[]) : [];
    memoryIntakes = parsed;
    return parsed;
  } catch {
    return memoryIntakes;
  }
}

function setAllIntakes(items: ReactorAnswers[]) {
  if (typeof window === 'undefined') return;
  memoryIntakes = items;
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    // ignore storage errors
  }
}

function randomId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    // @ts-ignore
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

