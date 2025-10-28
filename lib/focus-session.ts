import { useEffect, useState } from 'react';

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

let memorySession: FocusSession | null = null;
const listeners = new Set<() => void>();
let storageListenerAttached = false;

function notifyAll() {
    listeners.forEach((listener) => {
        try {
            listener();
        } catch {
            // ignore listener errors
        }
    });
}

function ensureStorageListener() {
    if (storageListenerAttached || typeof window === "undefined") return;
    storageListenerAttached = true;
    window.addEventListener("storage", (event) => {
        if (event.key && event.key !== KEY) return;
        memorySession = readFromStorage();
        notifyAll();
    });
}

function readFromStorage(): FocusSession | null {
    if (typeof window === 'undefined') return memorySession;
    try {
        const raw = window.localStorage.getItem(KEY);
        const parsed = raw ? (JSON.parse(raw) as FocusSession) : null;
        memorySession = parsed;
        return parsed;
    } catch {
        return memorySession;
    }
}

export function getSession(): FocusSession | null {
    if (typeof window === "undefined") return null;
    return readFromStorage();
}

export function setSession(session: FocusSession | null) {
    if (typeof window === "undefined") return;
    memorySession = session;
    try {
        if (session) localStorage.setItem(KEY, JSON.stringify(session));
        else localStorage.removeItem(KEY);
    } catch {
        // ignore quota or access errors
    }
    notifyAll();
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

export function subscribeSession(callback: () => void) {
    if (typeof window === "undefined") return () => {};
    listeners.add(callback);
    ensureStorageListener();
    // deliver current snapshot immediately for new subscribers
    try {
        callback();
    } catch {
        // ignore subscriber errors
    }
    return () => {
        listeners.delete(callback);
    };
}

export function useFocusSession(): FocusSession | null {
    const [session, setSessionState] = useState<FocusSession | null>(() => {
        if (typeof window === 'undefined') return memorySession;
        return readFromStorage();
    });

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const sync = () => setSessionState(readFromStorage());
        const unsubscribe = subscribeSession(sync);
        return unsubscribe;
    }, []);

    return session;
}

export function cryptoRandomId(): string {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
        // @ts-ignore
        return crypto.randomUUID();
    }
    // Fallback
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
