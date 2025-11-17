import { getLogs, type ReactorSessionLog } from './flow-reactor-logs';

export type RoleThreshold = {
    key: string;
    label: string;
    xp: number;
    description: string;
};

export const ROLE_THRESHOLDS: RoleThreshold[] = [
    { key: 'focus-initiate', label: 'Focus Initiate', xp: 0, description: 'Started your Flow Reactor practice.' },
    { key: 'deep-worker-i', label: 'Deep Worker I', xp: 250, description: 'Completed multiple reactor sessions.' },
    { key: 'deep-worker-ii', label: 'Deep Worker II', xp: 500, description: 'Maintained consistency across weeks.' },
    { key: 'flow-architect', label: 'Flow Architect', xp: 1000, description: 'Leading the community with relentless focus.' },
];

export type ProgressSummary = {
    totalXP: number;
    totalMinutes: number;
    sessions: number;
    streakDays: number;
    currentRole: RoleThreshold;
    nextRole?: RoleThreshold;
    xpToNext: number;
};

export function computeProgress(logs: ReactorSessionLog[]): ProgressSummary {
    const totalXP = logs.reduce((acc, log) => acc + (log.xpAwarded ?? 0), 0);
    const totalMinutes = logs.reduce((acc, log) => acc + log.lengthMinutes, 0);
    const sessions = logs.length;

    const currentRole = [...ROLE_THRESHOLDS]
        .reverse()
        .find((role) => totalXP >= role.xp) ?? ROLE_THRESHOLDS[0];

    const nextRole = ROLE_THRESHOLDS.find((role) => role.xp > totalXP);
    const xpToNext = nextRole ? Math.max(0, nextRole.xp - totalXP) : 0;

    const streakDays = calculateStreak(logs);

    return {
        totalXP,
        totalMinutes,
        sessions,
        streakDays,
        currentRole,
        nextRole,
        xpToNext,
    };
}

export function getProgressFromStorage(): ProgressSummary {
    const logs = getLogs();
    return computeProgress(logs);
}

function calculateStreak(logs: ReactorSessionLog[]): number {
    if (logs.length === 0) return 0;
    const uniqueDays = Array.from(new Set(logs.map((log) => formatDay(log.startAt)))).sort((a, b) => (a < b ? 1 : -1));

    let streak = 0;
    let cursor = formatDay(Date.now());

    for (const day of uniqueDays) {
        if (day === cursor) {
            streak += 1;
            cursor = previousDay(cursor);
        } else if (day < cursor) {
            break;
        }
    }

    return streak;
}

function formatDay(timestamp: number | string): string {
    const date = new Date(timestamp);
    return date.toISOString().slice(0, 10);
}

function previousDay(dayISO: string): string {
    const date = new Date(dayISO);
    date.setUTCDate(date.getUTCDate() - 1);
    return date.toISOString().slice(0, 10);
}
