// lib/flow-reactor-session.ts

import { useEffect, useState } from 'react';
import { FlowType } from './flow-reactor-types';

export type FlowReactorSession = {
  sessionId: string;
  target: string;
  startAt: number;
  endAt: number;
  paused: boolean;
  remaining?: number;
  lengthMinutes: number;
  intakeId?: string;
  flowType?: FlowType;
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

function readFromStorage(): FlowReactorSession | null {
  if (typeof window === 'undefined') return memorySession;
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as FlowReactorSession) : null;
    memorySession = parsed;
    return parsed;
  } catch {
    return memorySession;
  }
}

export function getSession(): FlowReactorSession | null {
  if (typeof window === 'undefined') return null;
  return readFromStorage();
}

export function setSession(session: FlowReactorSession | null) {
  if (typeof window === 'undefined') return;
  memorySession = session;
  try {
    if (session) localStorage.setItem(KEY, JSON.stringify(session));
    else localStorage.removeItem(KEY);
  } catch {
    // ignore quota or access errors
  }
  notifyAll();
}

export function startSession(
  target: string,
  lengthMinutes: number,
  intakeId?: string,
  flowType?: FlowType
) {
  const now = Date.now();
  const session: FlowReactorSession = {
    sessionId: cryptoRandomId(),
    target,
    lengthMinutes,
    startAt: now,
    endAt: now + lengthMinutes * 60 * 1000,
    paused: false,
    intakeId,
    flowType,
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

export function cryptoRandomId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    // @ts-ignore
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

