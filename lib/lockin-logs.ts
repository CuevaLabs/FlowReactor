import { readJSON, writeJSON } from './safe-storage';

export type SessionLog = {
    sessionId: string;
    intakeId?: string;
    target: string;
    startAt: number;
    endAt: number;
    lengthMinutes: number;
    completed: boolean;
    completionPercent?: number; // self-rated completion 0-100
    xpAwarded?: number; // XP assigned for habit loop reinforcement
    // Reflection summaries (not raw intake)
    reflection?: {
        summary: string;
        distractionsNoted?: string;
        nextStep?: string;
        createdAt: number;
    };
    // Derived awareness/comparison data
    insights?: {
        alignmentScore?: number; // 0-100: reflection vs intent alignment
        notes?: string;
    };
};

const KEY = 'lockin:logs';
let memoryLogs: SessionLog[] = [];

export function addOrUpdateLog(entry: SessionLog) {
    const all = getLogs();
    const idx = all.findIndex((x) => x.sessionId === entry.sessionId);
    if (idx >= 0) all[idx] = entry; else all.unshift(entry);
    setLogs(all);
}

export function getLog(sessionId: string): SessionLog | null {
    return getLogs().find((x) => x.sessionId === sessionId) ?? null;
}

export function getLogs(): SessionLog[] {
    const stored = readJSON<SessionLog[]>(KEY) ?? [];
    memoryLogs = stored;
    return stored;
}

function setLogs(items: SessionLog[]) {
    memoryLogs = items;
    writeJSON(KEY, items);
}
