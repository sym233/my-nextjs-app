import db from './client';
import { Database, Insertable, Selectable } from './types';

export type Blog = Selectable<Database['blog']>;

interface Result<T = void> {
  error?: string;
  data?: T;
}

function err<T>(error: any): Result<T> {
  if (error instanceof Error) {
    return { error: error.message };
  } else {
    return { error: 'error' };
  }
}

function ok(): Result<void>;
function ok<T>(data: T): Result<T>;
function ok<T>(data?: T): Result<T> {
  return { data };
}



async function _blogList(offset: number, limit: number) {
  return (
    await db
      .selectFrom('blog')
      .selectAll()
      .orderBy('creationTime', 'desc')
      .offset(offset)
      .limit(limit)
      .execute()
  ).map(o => ({
    ...o,
    // bigint in pg, present as string in js
    // timestamp guaranteed to fit js integer.
    creationTime: Number.parseInt(o.creationTime as unknown as string),
  }));
}

async function _blog(id: number) {
  let o = await db
    .selectFrom('blog')
    .where('id', '=', id)
    .selectAll()
    .executeTakeFirst();
  return (
    o && {
      ...o,
      creationTime: Number.parseInt(o.creationTime as unknown as string),
    }
  );
}

type Pr<T = void> = Promise<Result<T>>;

export async function blogList(offset: number, limit: number): Pr<Selectable<Database['blog']>[]> {
  try {
    const res = await _blogList(offset, limit);
    return ok(res);
  } catch (e) {
    return err(e);
  }
}

export async function blog(id: number): Pr<Selectable<Database['blog']>> {
  try {
    const res = await _blog(id);
    if (res) {
      return ok(res);
    } else {
      throw new Error(`Blog (${id}) not exists`);
    }
  } catch (e) {
    return err(e);
  }
}
