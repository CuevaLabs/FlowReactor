export type FocusSession = {
    sessionId: string;
    target: string;
    startAt: number; // ms epoch
    endAt: number; // ms epoch
    paused: boolean;
    remaining?: number; // seconds, only when paused
    lengthMinutes: number;
    intakeId?: string; // optional link to guided intake answers
};

const KEY = "focusSession";

export function getSession(): FocusSession | null {
    if (typeof window === "undefined") return null;
    try {
        const raw = localStorage.getItem(KEY);
        return raw ? (JSON.parse(raw) as FocusSession) : null;
    } catch {
        return null;
    }
}

export function setSession(session: FocusSession | null) {
    if (typeof window === "undefined") return;
    if (session) localStorage.setItem(KEY, JSON.stringify(session));
    else localStorage.removeItem(KEY);
    // notify same-tab listeners
    try {
        window.dispatchEvent(new StorageEvent("storage", { key: KEY }));
    } catch {
        // ignore
    }
}

export function startSession(target: string, lengthMinutes: number, intakeId?: string) {
    const now = Date.now();
    const session: FocusSession = {
        sessionId: cryptoRandomId(),
        target,
        lengthMinutes,
        startAt: now,
        endAt: now + lengthMinutes * 60 * 1000,
        paused: false,
        intakeId,
    };
    setSession(session);
}

export function endSession() {
    setSession(null);
}

export function pauseSession() {
    const s = getSession();
    if (!s || s.paused) return;
    const remaining = Math.max(0, Math.floor((s.endAt - Date.now()) / 1000));
    setSession({ ...s, paused: true, remaining });
}

export function resumeSession() {
    const s = getSession();
    if (!s || !s.paused) return;
    const endAt = Date.now() + (s.remaining ?? 0) * 1000;
    const { remaining, ...rest } = s;
    setSession({ ...rest, paused: false, endAt });
}

export function cryptoRandomId(): string {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
        // @ts-ignore
        return crypto.randomUUID();
    }
    // Fallback
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
}


