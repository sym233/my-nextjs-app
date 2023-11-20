import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { ClientFetch } from './fetch';

interface SessionStore {
  username?: string;
  sessionId?: string;
  failure?: string;
  refresh: () => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useSessionStore = create<SessionStore>()(
  persist(
    set => ({
      username: undefined,
      sessionId: undefined,
      failure: undefined,
      refresh: async () => {
        const res = await ClientFetch.refresh();
        if (res.ok) {
          const { sessionId, username } = res.data;
          set({ sessionId, username });
        } else {
          set({
            sessionId: undefined,
            username: undefined,
          });
        }
      },
      login: async (username, password) => {
        const res = await ClientFetch.login(username, password);
        if (res.ok) {
          const { sessionId } = res.data;
          set({ username, sessionId, failure: undefined });
        } else {
          set({ failure: res.err });
        }
      },
      logout: async () => {
        set({
          sessionId: undefined,
          username: undefined,
        });
        const res = await ClientFetch.logout();
        set({
          failure: res.ok ? undefined : res.err,
        });
      },
    }),
    {
      name: 'store',
      partialize: () => ({}),
      skipHydration: true,
    }
  )
);
