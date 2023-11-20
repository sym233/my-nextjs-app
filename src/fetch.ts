import { Pr, err, ok } from './utils';

export class ClientFetch {
  static fetch: typeof fetch = async (input, init) => {
    // may modify header etc.
    return fetch(input, init);
  };

  static refresh: () => Pr<{
    username: string;
    sessionId: string;
  }> = async () => {
    const res = await this.fetch('/api/session');
    return await res.json();
  };

  static login: (
    username: string,
    password: string
  ) => Pr<{ sessionId: string }> = async (username, password) => {
    try {
      const res = await this.fetch('/api/session', {
        method: 'post',
        body: JSON.stringify({ username, password }),
      });
      const j = await res.json();
      if (j.ok) {
        const sessionId = j.data.sessionId as string;
        localStorage.setItem(
          'session',
          JSON.stringify({ username, sessionId })
        );
        return ok({ sessionId });
      } else {
        return err(j.err);
      }
    } catch (e) {
      return err(e);
    }
  };

  static logout: () => Pr = async () => {
    try {
      const session = localStorage.getItem('session');
      if (!session) {
        throw new Error('No Session Found');
      }
      localStorage.removeItem('session');
      const { sessionId } = JSON.parse(session) as {
        username: string;
        sessionId: string;
      };
      const res = await this.fetch('/api/session', {
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
  };
}
