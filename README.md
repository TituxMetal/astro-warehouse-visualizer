# Astro Prisma Starter

This is a starter project that integrates Prisma with an Astro. It uses the following technologies:

- Astro
- React
- Tailwind CSS
- TypeScript
- ESLint
- Prettier
- Prisma
- lisql
- Turso

It demonstrates how to connect to a Turso database and perform basic operations.

## Development

```bash
yarn dev
```

## Production

```bash
yarn build
yarn preview
```

## Prisma

### Database schema migration flow

Database schema migration flow differs a little bit from the default Prisma flow.

```bash
npx prisma migrate dev --name a_name_for_the_migration --skip-seed
```

This will create a new migration file in the `prisma/migrations` directory.

### Apply the migration to the Turso database

To apply the migration to the Turso database, run:

```bash
turso db shell turso-db-name < ./prisma/migrations/20230922132717_init/migration.sql
```

Replace `turso-db-name` with the name of your Turso database. Replace `20230922132717_init` with the
name of your migration.

### Seed the database

To seed the database, run:

```bash
npx prisma db seed
```

#### Quick notes

I don't remember exactly what the errors were, but, at a certain point, I had to do the following to
get the migrations to work:

1. Delete all the database tables in Turso
2. Delete the database files in the `prisma` directory
3. Run the
   `npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script > migration.sql`
   command
4. Run the `turso db shell astro-auth < ./migration.sql` command
5. Run the `npx prisma migrate dev` command that also creates the Prisma Client
6. Run the `npx prisma db seed` command

References:

- [An excellent blog post about the Prisma Turso integration by Alex Ruheni](https://www.prisma.io/blog/prisma-turso-ea-support-rXGd_Tmy3UXX)
- [The Prisma Turso Docs](https://www.prisma.io/docs/orm/overview/databases/turso)
- [The Turso Docs](https://docs.turso.tech/introduction)

### Using the Prisma Client in your code

To use the Prisma Client in your code, you need to import it from `~/lib/prisma` and use it as
normal.

```ts
import { prisma } from '~/lib/prisma'

const tasks = await prisma.task.findMany()
```

### Prisma Studio

To start Prisma Studio, run:

```bash
npx prisma studio
```

This will start a web server and open a new tab in your browser.
