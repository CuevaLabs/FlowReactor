// lib/flow-type-storage.ts

import { FlowType } from './flow-reactor-types';

const KEY = 'flowReactor:userFlowType';

export function getUserFlowType(): FlowType | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return raw as FlowType;
  } catch {
    return null;
  }
}

export function setUserFlowType(flowType: FlowType): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEY, flowType);
  } catch {
    // ignore storage errors
  }
}

export function clearUserFlowType(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}

