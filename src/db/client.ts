import { exit } from 'process';

import { PostgresDialect, Kysely } from 'kysely';
import { Pool } from 'pg';
import { DB } from 'kysely-codegen';

function pgConnect(postgresUrl: string): Kysely<DB> {
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

const db: Kysely<DB> = (() => {
  const postgresUrl = process.env.POSTGRES_URL as string;
  if (!postgresUrl) {
    console.error("Environment Variable \"POSTGRES_URL\" not provided.");
    exit(1);
  }
  return pgConnect(postgresUrl);
})();

export default db;
