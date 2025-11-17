// lib/flow-type-storage.ts

import { FlowType } from './flow-reactor-types';
import { readString, writeString } from './safe-storage';

const KEY = 'flowReactor:userFlowType';

export function getUserFlowType(): FlowType | null {
  const raw = readString(KEY);
  if (!raw) return null;
  return raw as FlowType;
}

export function setUserFlowType(flowType: FlowType): void {
  writeString(KEY, flowType);
}

export function clearUserFlowType(): void {
  writeString(KEY, null);
}
