export type SessionLog = {
    sessionId: string;
    intakeId?: string;
    target: string;
    startAt: number;
    endAt: number;
    lengthMinutes: number;
    completed: boolean;
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
    if (typeof window === 'undefined') return [];
    try {
        const raw = localStorage.getItem(KEY);
        return raw ? (JSON.parse(raw) as SessionLog[]) : [];
    } catch {
        return [];
    }
}

function setLogs(items: SessionLog[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(KEY, JSON.stringify(items));
}


