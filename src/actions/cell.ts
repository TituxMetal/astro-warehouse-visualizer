// src/actions/cell.ts
import { ActionError, defineAction } from 'astro:actions'
import { z } from 'astro:schema'
import { prisma } from '~/lib/prisma'

export const cell = {
  create: defineAction({
    accept: 'form',
    input: z.object({
      number: z.number().positive(),
      aislesCount: z.number().positive(),
      locationsPerAisle: z.number().positive(),
      levelsPerLocation: z.number().positive()
    }),
    handler: async ({ number, aislesCount, locationsPerAisle, levelsPerLocation }) => {
      try {
        await prisma.cell.create({
          data: {
            number,
            aislesCount,
            locationsPerAisle,
            levelsPerLocation
          }
        })

        return {
          success: true,
          message: 'Cell created successfully'
        }
      } catch (error) {
        throw new ActionError({
          code: 'UNPROCESSABLE_CONTENT',
          message: 'Failed to create cell'
        })
      }
    }
  })
}
