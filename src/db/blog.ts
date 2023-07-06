import { Generated, Selectable } from 'kysely';

import { createKysely } from '@vercel/postgres-kysely';

interface Blog {
  title: string;
  content: string;
  author: string;
  creationTime: number;
}

type WithId<T> = T & { id: Generated<number> };

interface Database {
  blog: WithId<Blog>;
}

export type SelectBlog = Selectable<Database['blog']>;

const blogs: Blog[] = [
  {
    title: 'hello world',
    content: 'first blog.',
    author: 'admin',
    creationTime: Date.now() - 60 * 1000,
  },
  {
    title: 'test blog',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    author: 'admin',
    creationTime: Date.now(),
  },
];

let db = createKysely<Database>();

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

async function _down() {
  await db.schema.dropTable('blog').ifExists().execute();
}

async function _up() {
  await db.schema
    .createTable('blog')
    .addColumn('id', 'serial', col => col.primaryKey())
    .addColumn('title', 'text', col => col.notNull())
    .addColumn('content', 'text', col => col.notNull())
    .addColumn('author', 'varchar(255)', col => col.notNull())
    .addColumn('creationTime', 'bigint', col => col.notNull())
    .execute();
  await db.insertInto('blog').values(blogs).execute();
}

async function _blogList() {
  return (await db.selectFrom('blog').selectAll().execute()).map(o => ({
    ...o,
    // bigint in pg, present as string in js
    // timestamp guaranteed to fit js integer.
    creationTime: Number.parseInt(o.creationTime as unknown as string),
  }));
}

async function _blog(id: number) {
  return await db
    .selectFrom('blog')
    .where('id', '=', id)
    .selectAll()
    .executeTakeFirst();
}

type Pr<T = void> = Promise<Result<T>>;

export async function init(): Pr {
  try {
    await _down();
    await _up();
    return ok();
  } catch (e) {
    return err(e);
  }
}

export async function blogList(): Pr<Selectable<Database['blog']>[]> {
  try {
    const res = await _blogList();
    return ok(res);
  } catch (e) {
    return err(e);
  }
}

export async function blog(
  id: number
): Pr<Selectable<Database['blog']> | undefined> {
  try {
    const res = await _blog(id);
    return ok(res);
  } catch (e) {
    return err(e);
  }
}
