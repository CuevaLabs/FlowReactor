import { readJSON, writeJSON } from './safe-storage';

type CommunityMetrics = {
    baselineMinutes: number;
    lastUpdatedAt: number;
};

const KEY = 'lockin:community:baseline';

const DEFAULT_BASELINE: CommunityMetrics = {
    baselineMinutes: 20,
    lastUpdatedAt: Date.now(),
};

export function getCommunityBaseline(): CommunityMetrics {
    const stored = readJSON<CommunityMetrics>(KEY);
    if (!stored || typeof stored.baselineMinutes !== 'number') return DEFAULT_BASELINE;
    return stored;
}

export function saveCommunityBaseline(minutes: number): CommunityMetrics {
    const value: CommunityMetrics = {
        baselineMinutes: Math.max(1, Math.round(minutes)),
        lastUpdatedAt: Date.now(),
    };
    writeJSON(KEY, value);
    return value;
}

export function computeFocusVsCommunityRatio(sessionMinutes: number, baselineMinutes: number): number | null {
    if (!baselineMinutes || baselineMinutes <= 0) return null;
    if (!sessionMinutes || sessionMinutes <= 0) return null;
    return Number((sessionMinutes / baselineMinutes).toFixed(2));
}
