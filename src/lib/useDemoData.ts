'use client';

import { useSyncExternalStore } from 'react';
import type { DemoDataSnapshot } from '@/types';
import { getSnapshot, subscribe } from './fakeDb';

export function useDemoData(): DemoDataSnapshot {
  return useSyncExternalStore(subscribe, getSnapshot);
}
