import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { UserDb } from '@/db/user';
import { getAuth } from '@/serv';
import { BaseError, errorToResponse, ok } from '@/utils';

export async function GET(request: Request) {
  // session status
  const session = await getAuth();
  if (!session) {
    return errorToResponse(BaseError.credentialError());
  }
  cookies().set('sessionId', session.sessionId);
  return NextResponse.json(ok(session));
}

export async function POST(request: Request) {
  // login
  try {
    const { username, password } = await request.json();
    if (typeof username !== 'string' || typeof password !== 'string') {
      throw BaseError.parameterError();
    }
    const session = await UserDb.login(username, password);
    if (!session) {
      throw BaseError.credentialError();
    }
    cookies().set('sessionId', session.sessionId);
    return NextResponse.json(ok(session));
  } catch (e) {
    return errorToResponse(e);
  }
}

export async function DELETE(request: Request) {
  // logout
  const session = await getAuth();
  cookies().delete('sessionId');
  if (!session) {
    return errorToResponse(BaseError.credentialError());
  }
  await UserDb.logout(session.sessionId);
  return NextResponse.json(ok());
}
