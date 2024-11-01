import { PrismaClient } from '@prisma/client'
// 1. Import libSQL and the Prisma libSQL driver adapter
import { createClient } from '@libsql/client'
import { PrismaLibSQL } from '@prisma/adapter-libsql'
import path from 'node:path'

const isDevMode = process.env.NODE_ENV === 'development'

const dbPath = path.join(process.cwd(), 'prisma', 'replica.db')
const dbUrl = `file://${dbPath}`

// 2. Instantiate libSQL
export const libsql = createClient({
  url: isDevMode ? dbUrl : process.env.DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
  syncUrl: isDevMode ? process.env.TURSO_DATABASE_URL! : undefined,
  syncInterval: 600
})

// 3. Instantiate the libSQL driver adapter
const prismaAdapter = new PrismaLibSQL(libsql)
// Pass the adapter option to the Prisma Client instance
export const prisma = new PrismaClient({ adapter: prismaAdapter })
