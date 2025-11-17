// lib/flow-reactor-session.ts

import { useEffect, useState } from 'react';
import { FlowType } from './flow-reactor-types';
import { readJSON, writeJSON } from './safe-storage';

type StoredFlowReactorSession = {
	sessionId: string;
	target: string;
	startAt: number;
	lengthMinutes: number;
	paused: boolean;
	remaining?: number;
	intakeId?: string;
	flowType?: FlowType;
};

export type FlowReactorSession = StoredFlowReactorSession & {
	endAt: number;
};

const KEY = 'flowReactorSession';

let memorySession: FlowReactorSession | null = null;
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
	if (storageListenerAttached || typeof window === 'undefined') return;
	storageListenerAttached = true;
	window.addEventListener('storage', (event) => {
		if (event.key && event.key !== KEY) return;
		memorySession = readFromStorage();
		notifyAll();
	});
}

function hydrateSession(data: StoredFlowReactorSession | null): FlowReactorSession | null {
	if (!data) return null;
	return {
		...data,
		endAt: data.startAt + data.lengthMinutes * 60 * 1000,
	};
}

function dehydrateSession(session: FlowReactorSession | null): StoredFlowReactorSession | null {
	if (!session) return null;
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { endAt, ...rest } = session;
	return rest;
}

function readFromStorage(): FlowReactorSession | null {
	const parsed = readJSON<StoredFlowReactorSession>(KEY);
	const hydrated = hydrateSession(parsed ?? null);
	memorySession = hydrated;
	return hydrated;
}

export function getSession(): FlowReactorSession | null {
	if (typeof window === 'undefined') return memorySession;
	return readFromStorage();
}

function persistSession(session: StoredFlowReactorSession | null) {
	memorySession = hydrateSession(session);
	writeJSON(KEY, session);
	notifyAll();
}

export function startSession(
	target: string,
	lengthMinutes: number,
	intakeId?: string,
	flowType?: FlowType
) {
	const now = Date.now();
	const session: StoredFlowReactorSession = {
		sessionId: cryptoRandomId(),
		target,
		lengthMinutes,
		startAt: now,
		paused: false,
		intakeId,
		flowType,
	};
	persistSession(session);
}

export function endSession() {
	persistSession(null);
}

export function pauseSession() {
	const session = getSession();
	if (!session || session.paused) return;
	const remainingSeconds = getSessionRemainingSeconds(session);
	const stored = {
		...dehydrateSession(session)!,
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
			: getSessionRemainingSeconds(session);

	const durationSeconds = session.lengthMinutes * 60;
	const elapsedSeconds = Math.max(0, durationSeconds - remainingSeconds);
	const newStartAt = Date.now() - elapsedSeconds * 1000;

	const stored: StoredFlowReactorSession = {
		...dehydrateSession(session)!,
		startAt: newStartAt,
		paused: false,
	};
	delete stored.remaining;
	persistSession(stored);
}

export function subscribeSession(callback: () => void) {
	if (typeof window === 'undefined') return () => {};
	listeners.add(callback);
	ensureStorageListener();
	try {
		callback();
	} catch {
		// ignore subscriber errors
	}
	return () => {
		listeners.delete(callback);
	};
}

export function useFlowReactorSession(): FlowReactorSession | null {
	const [session, setSessionState] = useState<FlowReactorSession | null>(() => {
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

export function getSessionRemainingSeconds(session: FlowReactorSession, now = Date.now()) {
	if (session.paused && typeof session.remaining === 'number') {
		return Math.max(0, session.remaining);
	}
	return Math.max(0, Math.floor((session.endAt - now) / 1000));
}

export function cryptoRandomId(): string {
	if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
		// @ts-ignore
		return crypto.randomUUID();
	}
	return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
