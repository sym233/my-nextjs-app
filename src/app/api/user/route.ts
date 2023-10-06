import { UserDb } from "@/db/user";
import { BaseError, errorToResponse, ok } from "@/utils";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // register
  try {
    const { username, password } = await request.json();
    if (typeof username !== 'string' || typeof password !== 'string') {
      throw BaseError.parameterError();
    }
    const created = await UserDb.createUserByPassword(username, password);
    if (!created) {
      throw BaseError.registerError();
    }
    return NextResponse.json(ok());
  } catch (e){
    return errorToResponse(e);
  }
}

export async function PATCH(request: Request) {
  // delete user
  // nextjs seems not to support delete method
  try {
    const { username, password } = await request.json();
    if (typeof username !== 'string' || typeof password !== 'string') {
      throw BaseError.parameterError();
    }
    const valid = await UserDb.validateUserByPassword(username, password);
    if (!valid) {
      throw BaseError.credentialError();
    }
    const deleted = await UserDb.deleteUser(username);
    if (!deleted) {
      throw BaseError.credentialError();
    }
    return NextResponse.json(ok());
  } catch (e) {
    return errorToResponse(e);
  }
}
