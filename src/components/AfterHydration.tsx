'use client';

import { useEffect } from 'react';

import { useSessionStore } from '@/store';

const AfterHydration = () => {
  useEffect(() => {
    // load store after hydration
    // avoid hrydration error
    useSessionStore.persist.rehydrate();
  }, []);

  return null;
}

export default AfterHydration;
