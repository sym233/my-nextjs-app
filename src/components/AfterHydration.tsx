'use client';

import { useEffect } from 'react';

import { useSessionStore } from '@/store';

const AfterHydration = () => {
  const refresh = useSessionStore(s => s.refresh);
  useEffect(() => {
    // load store after hydration
    // avoid hrydration error
    useSessionStore.persist.rehydrate();
    refresh();
  }, []);

  return null;
}

export default AfterHydration;
