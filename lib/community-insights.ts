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
    if (typeof window === 'undefined') return DEFAULT_BASELINE;
    try {
        const raw = window.localStorage.getItem(KEY);
        if (!raw) return DEFAULT_BASELINE;
        const parsed = JSON.parse(raw) as CommunityMetrics;
        if (!parsed || typeof parsed.baselineMinutes !== 'number') return DEFAULT_BASELINE;
        return parsed;
    } catch {
        return DEFAULT_BASELINE;
    }
}

export function saveCommunityBaseline(minutes: number): CommunityMetrics {
    const value: CommunityMetrics = {
        baselineMinutes: Math.max(1, Math.round(minutes)),
        lastUpdatedAt: Date.now(),
    };
    if (typeof window !== 'undefined') {
        try {
            window.localStorage.setItem(KEY, JSON.stringify(value));
        } catch {
            // ignore storage errors
        }
    }
    return value;
}

export function computeFocusVsCommunityRatio(sessionMinutes: number, baselineMinutes: number): number | null {
    if (!baselineMinutes || baselineMinutes <= 0) return null;
    if (!sessionMinutes || sessionMinutes <= 0) return null;
    return Number((sessionMinutes / baselineMinutes).toFixed(2));
}
