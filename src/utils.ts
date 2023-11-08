import { NextResponse } from 'next/server';

interface Ok<T = void> {
  ok: true;
  data: T;
}

interface Err {
  ok?: false;
  err: string;
}

export type Result<T = void> = Ok<T> | Err;

export function err(error: any): Err {
  if (typeof error === 'string') {
    return { ok: false, err: error };
  }
  if (error instanceof Error) {
    return { ok: false, err: error.message };
  }
  return { ok: false, err: 'Unknown Error' };
}

export function ok(): Ok<void>;
export function ok<T>(data: T): Ok<T>;
export function ok<T>(data?: T): Ok<T> {
  return { ok: true, data: data as T };
}

export type Pr<T = void> = Promise<Result<T>>;

export async function res<T>(func: Promise<T>): Pr<T> {
  try {
    const r = await func;
    return ok(r);
  } catch (e) {
    return err(e);
  }
}

export class BaseError extends Error {
  static parameterError(): BaseError {
    return new BaseError('parameter error');
  }

  static registerError(): BaseError {
    return new BaseError('register error');
  }

  static credentialError(): BaseError {
    return new BaseError('credential error');
  }

  toJson(): Err {
    return err(this);
  }
}

export function errorToResponse(err: unknown): NextResponse {
  if (err instanceof BaseError) {
    return NextResponse.json(err.toJson());
  }
  return NextResponse.json({ err: 'Internal Error' });
}
