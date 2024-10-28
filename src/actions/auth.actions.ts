import { ActionError, defineAction } from 'astro:actions'
import { generateIdFromEntropySize } from 'lucia'
import { Argon2id } from 'oslo/password'
import { lucia } from '~/lib/auth'
import { prisma } from '~/lib/prisma'
import { authSchema } from '~/schemas/auth.schema'

export const auth = {
  login: defineAction({
    accept: 'form',
    input: authSchema,
    handler: async (input, context) => {
      try {
        // Find the user by username
        const existingUser = await prisma.user.findUnique({
          where: { username: input.username },
          include: { authMethods: true }
        })

        if (!existingUser || !existingUser.authMethods[0]?.hashedPassword) {
          throw new ActionError({
            code: 'UNAUTHORIZED',
            message: 'Invalid credentials'
          })
        }

        // Verify the password
        const validPassword = await new Argon2id().verify(
          existingUser.authMethods[0].hashedPassword,
          input.password
        )

        if (!validPassword) {
          throw new ActionError({
            code: 'UNAUTHORIZED',
            message: 'Invalid credentials'
          })
        }

        // Create a new session
        const session = await lucia.createSession(existingUser.id, {})
        const sessionCookie = lucia.createSessionCookie(session.id)
        context.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)

        return {
          success: true,
          message: 'Logged in successfully'
        }
      } catch (error) {
        console.error('Login error:', error)

        if (error instanceof ActionError) {
          throw error
        }

        throw new ActionError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An error occurred during login'
        })
      }
    }
  }),
  signup: defineAction({
    accept: 'form',
    input: authSchema,
    handler: async (input, context) => {
      try {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
          where: { username: input.username }
        })

        if (existingUser) {
          throw new ActionError({
            code: 'CONFLICT',
            message: 'Invalid credentials'
          })
        }

        // Hash the password
        const hashedPassword = await new Argon2id().hash(input.password)
        // Create a new user
        const userId = generateIdFromEntropySize(15)

        await prisma.$transaction([
          prisma.user.create({
            data: {
              id: userId,
              username: input.username
            }
          }),
          prisma.userAuth.create({
            data: {
              id: generateIdFromEntropySize(15),
              hashedPassword,
              userId
            }
          })
        ])

        // Create a new session
        const session = await lucia.createSession(userId, {})
        const sessionCookie = lucia.createSessionCookie(session.id)
        context.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)

        return {
          success: true,
          message: 'User created successfully'
        }
      } catch (error) {
        console.error('Signup error:', error)

        if (error instanceof ActionError) {
          throw error
        }

        throw new ActionError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An error occurred during signup'
        })
      }
    }
  }),
  logout: defineAction({
    accept: 'form',
    handler: async (_, context) => {
      if (!context.locals.session) {
        return new Response(null, {
          status: 401
        })
      }

      await lucia.invalidateSession(context.locals.session.id)

      const sessionCookie = lucia.createBlankSessionCookie()
      context.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)

      return {}
    }
  })
}
