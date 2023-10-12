# My nextjs app

Making a homepage/blog (again)

Using React/Nextjs and Postgres, served on Vercel.

see https://sym233.vercel.app

## Development

### Database
Postgresql, database url `POSTGRES_URL` environment variable at file `./.env.local`.

Run `ts-node ./src/db/migrate.ts` to migrate database.

Run `kysely-codegen --url POSTGRES_URL` to generate typescript interface for database. It cannot read from env for now.

### Start
`npm run dev` to start nextjs framework.

### Test
`npm run cypress:open` to start cypress.
