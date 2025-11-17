// lib/flow-reactor-intake.ts

import { FlowType } from './flow-reactor-types';
import { readJSON, writeJSON } from './safe-storage';

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
  const stored = readJSON<ReactorAnswers[]>(KEY) ?? [];
  memoryIntakes = stored;
  return stored;
}

function setAllIntakes(items: ReactorAnswers[]) {
  memoryIntakes = items;
  writeJSON(KEY, items);
}

function randomId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    // @ts-ignore
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
