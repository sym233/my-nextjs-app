import { cookies, headers } from 'next/headers';

import { UserDb } from '@/db/user';

/**
 * server only
 * @returns session if authenticated
 */
export const getAuth = async () => {
  const sessionId =
    headers().get('Authentication') || cookies().get('sessionId')?.value;
  if (!sessionId) {
    return;
  }
  const session = await UserDb.validateSession(sessionId);
  if (!session) {
    return;
  }
  return { ...session, sessionId };
};
