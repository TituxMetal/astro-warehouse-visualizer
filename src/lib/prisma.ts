import { PrismaClient } from '@prisma/client'
// 1. Import libSQL and the Prisma libSQL driver adapter
import { createClient } from '@libsql/client'
import { PrismaLibSQL } from '@prisma/adapter-libsql'
import path from 'node:path'

const dbPath = path.join(process.cwd(), 'prisma', 'replica.db')

// 2. Instantiate libSQL
export const libsql = createClient({
  url: `file://${dbPath}`,
  authToken: process.env.TURSO_AUTH_TOKEN!,
  syncUrl: process.env.TURSO_DATABASE_URL!,
  syncInterval: 600
})

// 3. Instantiate the libSQL driver adapter
const prismaAdapter = new PrismaLibSQL(libsql)
// Pass the adapter option to the Prisma Client instance
export const prisma = new PrismaClient({ adapter: prismaAdapter })
