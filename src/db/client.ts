import { PostgresDialect, Kysely } from 'kysely';
import { Pool } from 'pg';

import { createKysely } from '@vercel/postgres-kysely';
import { Database } from './types';

function pgConnect(postgresUrl: string): Kysely<Database> {
  const { pathname, hostname, port, username, password } = new URL(postgresUrl);
  const pool = new Pool({
    database: pathname.slice(1),
    host: hostname,
    port: Number.parseInt(port),
    user: username,
    password: password,
    ssl: hostname !== 'localhost' && hostname !== '127.0.0.1',
  });
  const dialect = new PostgresDialect({
    pool,
  });
  console.log('connected using pg');
  return new Kysely({ dialect });
}

const db: Kysely<Database> = (() => {
  if (process.env?.NODE_ENV === 'production') {
    return createKysely<Database>();
  } else {
    const postgresUrl = 'postgres://postgres:postgres@localhost:15432/postgres';
    // const postgresUrl = process.env.POSTGRES_URL as string;
    return pgConnect(postgresUrl);
  }
})();

export default db;
