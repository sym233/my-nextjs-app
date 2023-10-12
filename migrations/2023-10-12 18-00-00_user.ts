import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('userInfo')
    .addColumn('id', 'serial', col => col.primaryKey())
    .addColumn('username', 'varchar(255)', col => col.notNull().unique())
    // .addColumn('creationTime', 'bigint', col => col.notNull())
    .execute();

  await db.schema
    .createTable('userPassword')
    .addColumn('id', 'serial', col => col.primaryKey())
    .addColumn('userId', 'integer', col => col.notNull())
    .addColumn('hashedPassword', 'varchar(255)', col => col.notNull())
    .addColumn('salt', 'varchar(255)', col => col.notNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('userInfo').ifExists().execute();
  await db.schema.dropTable('userPassword').ifExists().execute();
}
