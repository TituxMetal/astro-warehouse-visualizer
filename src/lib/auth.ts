import { PrismaAdapter } from '@lucia-auth/adapter-prisma'
import { Lucia } from 'lucia'
import { TimeSpan } from 'oslo'
import { prisma } from './prisma'

// Create Lucia instance
export const lucia = new Lucia(new PrismaAdapter(prisma.session, prisma.user), {
  sessionExpiresIn: new TimeSpan(1, 'h'),
  sessionCookie: {
    name: 'lucia-astro-auth-session',

    attributes: {
      secure: import.meta.env.PROD,
      sameSite: 'strict'
    }
  },
  getUserAttributes: attributes => {
    return {
      username: attributes.username
    }
  }
})

declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia
    DatabaseUserAttributes: DatabaseUserAttributes
  }
}

interface DatabaseUserAttributes {
  username: string
}
