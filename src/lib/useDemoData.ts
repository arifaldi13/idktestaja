'use client';

import { useEffect, useState } from 'react';
import { DemoDataSnapshot } from '@/types';
import { getSnapshot, subscribe } from './fakeDb';

export function useDemoData(): DemoDataSnapshot {
    const [snapshot, setSnapshot] = useState<DemoDataSnapshot>(getSnapshot());

    useEffect(() => {
        const unsub = subscribe(setSnapshot);
        return () => unsub();
    }, []);

    return snapshot;
}

