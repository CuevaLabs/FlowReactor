import { useEffect, useState } from 'react';
import { readJSON, writeJSON } from './safe-storage';

type StoredFocusSession = {
	sessionId: string;
	target: string;
	startAt: number; // ms epoch
	lengthMinutes: number;
	paused: boolean;
	remaining?: number; // seconds, only when paused
	intakeId?: string; // optional link to guided intake answers
};

export type FocusSession = StoredFocusSession & {
	endAt: number;
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

function hydrate(session: StoredFocusSession | null): FocusSession | null {
	if (!session) return null;
	return {
		...session,
		endAt: session.startAt + session.lengthMinutes * 60 * 1000,
	};
}

function dehydrate(session: FocusSession | null): StoredFocusSession | null {
	if (!session) return null;
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { endAt, ...rest } = session;
	return rest;
}

function readFromStorage(): FocusSession | null {
	const parsed = readJSON<StoredFocusSession>(KEY);
	const hydrated = hydrate(parsed ?? null);
	memorySession = hydrated;
	return hydrated;
}

export function getSession(): FocusSession | null {
	if (typeof window === "undefined") return memorySession;
	return readFromStorage();
}

function persistSession(session: StoredFocusSession | null) {
	memorySession = hydrate(session);
	writeJSON(KEY, session);
	notifyAll();
}

export function startSession(target: string, lengthMinutes: number, intakeId?: string) {
	const now = Date.now();
	const session: StoredFocusSession = {
		sessionId: cryptoRandomId(),
		target,
		lengthMinutes,
		startAt: now,
		paused: false,
		intakeId,
	};
	persistSession(session);
}

export function endSession() {
	persistSession(null);
}

export function pauseSession() {
	const session = getSession();
	if (!session || session.paused) return;
	const remainingSeconds = getFocusSessionRemainingSeconds(session);
	const stored: StoredFocusSession = {
		...dehydrate(session)!,
		paused: true,
		remaining: remainingSeconds,
	};
	persistSession(stored);
}

export function resumeSession() {
	const session = getSession();
	if (!session || !session.paused) return;
	const remainingSeconds =
		typeof session.remaining === 'number'
			? session.remaining
			: getFocusSessionRemainingSeconds(session);
	const durationSeconds = session.lengthMinutes * 60;
	const elapsedSeconds = Math.max(0, durationSeconds - remainingSeconds);
	const newStartAt = Date.now() - elapsedSeconds * 1000;

	const stored: StoredFocusSession = {
		...dehydrate(session)!,
		startAt: newStartAt,
		paused: false,
	};
	delete stored.remaining;
	persistSession(stored);
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
	const [session, setSessionState] = useState<FocusSession | null>(() => memorySession);

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

export function getFocusSessionRemainingSeconds(session: FocusSession, now = Date.now()) {
	if (session.paused && typeof session.remaining === 'number') {
		return Math.max(0, session.remaining);
	}
	return Math.max(0, Math.floor((session.endAt - now) / 1000));
}
