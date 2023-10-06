import { UserDb } from "@/db/user";
import { BaseError, errorToResponse, ok } from "@/utils";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // session status
  try {
    const sessionId = request.headers.get('Authentication');
    if (!sessionId) {
      throw BaseError.credentialError();
    }
    const ses = await UserDb.validateSession(sessionId);
    if (!ses) {
      throw BaseError.credentialError();
    }
    return NextResponse.json(ok(ses));
  } catch (e) {
    return errorToResponse(e);
  }
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
    return NextResponse.json(ok(session));
  } catch (e) {
    return errorToResponse(e);
  }
}

export async function PATCH(request: Request) {
  // logout
  try {
    const sessionId = request.headers.get('Authentication');
    if (!sessionId || !await UserDb.validateSession(sessionId)) {
      throw BaseError.credentialError();
    }
    await UserDb.logout(sessionId);
    return NextResponse.json(ok());
  } catch (e) {
    return errorToResponse(e);
  }
}

