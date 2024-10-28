import type { APIContext, MiddlewareNext } from 'astro'
import { sequence } from 'astro:middleware'
import { lucia } from './lib/auth'
import { libsql } from './lib/prisma'

const dbSync = async (_: unknown, next: MiddlewareNext) => {
  if (import.meta.env.DEV) {
    console.log('Sync database with Turso')
    await libsql.sync()
  }

  return next()
}

const auth = async (context: APIContext, next: MiddlewareNext) => {
  const sessionId = context.cookies.get(lucia.sessionCookieName)?.value ?? null

  if (!sessionId) {
    context.locals.user = null
    context.locals.session = null

    return next()
  }

  const { session, user } = await lucia.validateSession(sessionId)

  if (session && session.fresh) {
    const sessionCookie = lucia.createSessionCookie(session.id)

    context.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)
  }

  if (!session) {
    const sessionCookie = lucia.createBlankSessionCookie()

    context.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)
  }

  context.locals.session = session
  context.locals.user = user

  return next()
}

export const onRequest = sequence(dbSync, auth)
