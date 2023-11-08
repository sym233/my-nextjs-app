import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Pr, err, ok } from './utils';

interface SessionStore {
  username?: string;
  sessionId?: string;
  failure?: string;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useSessionStore = create<SessionStore>()(
  persist(
    set => ({
      username: undefined,
      sessionId: undefined,
      failure: undefined,
      login: async (username, password) => {
        const res = await login(username, password);
        if (res.ok) {
          set({ username, sessionId: res.data.sessionId, failure: undefined });
        } else {
          set({ failure: res.err });
        }
      },
      logout: async () => {
        const res = await logout();
        set({
            sessionId: undefined,
            username: undefined,
            failure: res.ok ? undefined : res.err,
        });
      },
    }),
    {
      name: 'store',
      partialize: ({ username, sessionId }) => ({ username, sessionId }),
      skipHydration: true,
    }
  )
);

async function login(
  username: string,
  password: string
): Pr<{ sessionId: string }> {
  try {
    const res = await fetch('/api/session', {
      method: 'post',
      body: JSON.stringify({ username, password }),
    });
    const j = await res.json();
    if (j.ok) {
      const sessionId = j.data.sessionId as string;
      localStorage.setItem('session', JSON.stringify({ username, sessionId }));
      return ok({ sessionId });
    } else {
      return err(j.err);
    }
  } catch (e) {
    return err(e);
  }
}

async function logout(): Pr {
  try {
    const session = localStorage.getItem('session');
    if (!session) {
      throw new Error('No Session Found');
    }
    localStorage.removeItem('session');
    const { sessionId } = JSON.parse(session) as { username: string, sessionId: string };
    const res = await fetch('/api/session', {
      method: 'delete',
      headers: {
        Authentication: sessionId,
      },
    });
    const j = await res.json();
    if (j.ok) {
      return ok();
    } else {
      return err(j.err);
    }
  } catch (e) {
    return err(e);
  }
}
