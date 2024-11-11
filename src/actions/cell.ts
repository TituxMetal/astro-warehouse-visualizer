// src/actions/cell.ts
import { ActionError, defineAction } from 'astro:actions'
import { prisma } from '~/lib/prisma'
import { implementationSchema } from '~/schemas/implementation.schema'
import { cellService } from '~/services/cell.service'
import { generateAisleNumbers } from '~/utils/implementation'

export const cell = {
  create: defineAction({
    accept: 'form',
    input: implementationSchema,
    handler: async input => {
      try {
        // Generate aisles configuration
        const aisles = generateAisleNumbers(
          input.aisleStart,
          input.aisleEnd,
          input.startLocationType,
          input.endLocationType
        )

        // Create the cell
        const cell = await prisma.cell.create({
          data: {
            number: input.cellNumber,
            aislesCount: aisles.length,
            locationsPerAisle: input.locationsPerAisle / 2,
            levelsPerLocation: input.levelCount
          }
        })

        // Create aisle records
        const aislesData = aisles.flatMap(aisle => {
          switch (aisle.locations) {
            case 'both':
              return [
                { number: aisle.number, isOdd: true, cellId: cell.id },
                { number: aisle.number, isOdd: false, cellId: cell.id }
              ]
            case 'odd':
              return [{ number: aisle.number, isOdd: true, cellId: cell.id }]
            case 'even':
              return [{ number: aisle.number, isOdd: false, cellId: cell.id }]
          }
        })

        const createdAisles = await cellService.createAisles(aislesData)

        // Create bays
        const realLocationsPerAisle = input.locationsPerAisle / 2
        const baysPerSide = Math.ceil(realLocationsPerAisle / 4)
        const baysData = await cellService.createBays(createdAisles, baysPerSide)

        // Get created bays
        const bays = await prisma.bay.findMany({
          orderBy: [{ aisleId: 'asc' }, { number: 'asc' }]
        })

        // Create locations
        const allLocations = await cellService.createLocations(createdAisles, bays, input)

        console.log(
          `Cell created successfully with ${createdAisles.length} aisles, ${baysData.length} bays, and ${allLocations.length} locations`
        )

        return {
          success: true,
          message: `Cell created successfully with ${createdAisles.length} aisles, ${baysData.length} bays, and ${allLocations.length} locations`
        }
      } catch (error) {
        console.error('Cell creation error:', error)
        throw new ActionError({
          code: 'UNPROCESSABLE_CONTENT',
          message: 'Failed to create cell'
        })
      }
    }
  })
}
