// src/actions/cell.ts
import type { Prisma } from '@prisma/client'
import { ActionError, defineAction } from 'astro:actions'
import { prisma } from '~/lib/prisma'
import { implementationSchema } from '~/schemas/implementation.schema'
import { createLocationsInBatches } from '~/services/createLocationsInBatches'
import { generateAisleNumbers, generateLevels } from '~/utils/implementation'

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

        // Create aisle records based on configuration
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

        const createdAisles = await prisma.$transaction(
          aislesData.map(data => prisma.aisle.create({ data }))
        )

        // Calculate bays per aisle side
        const baysPerSide = Math.ceil(input.locationsPerAisle / 4)

        // Create bays
        const baysData: Prisma.BayCreateManyInput[] = createdAisles.flatMap(aisle =>
          Array.from({ length: baysPerSide }, (_, i) => ({
            number: i + 1,
            width: 4,
            aisleId: aisle.id
          }))
        )

        await prisma.bay.createMany({ data: baysData })

        // Get created bays for reference
        const bays = await prisma.bay.findMany({
          orderBy: [{ aisleId: 'asc' }, { number: 'asc' }]
        })

        // Generate levels
        const levels = generateLevels(input.levelCount)

        // Prepare locations data
        const allLocations: Prisma.LocationCreateManyInput[] = []

        createdAisles.forEach(aisle => {
          const aisleBays = bays.filter(bay => bay.aisleId === aisle.id)

          aisleBays.forEach((bay, bayIndex) => {
            const locationsInBay = Math.min(4, input.locationsPerAisle / 2 - bayIndex * 4)

            for (let i = 0; i < locationsInBay; i++) {
              const basePosition = bayIndex * 4 + i
              const position = aisle.isOdd ? basePosition * 2 + 1 : (basePosition + 1) * 2

              // Create locations for all levels
              levels.forEach(level => {
                allLocations.push({
                  position,
                  level,
                  isPicking: input.hasPicking && level === 0,
                  aisleId: aisle.id,
                  bayId: bay.id
                })
              })
            }
          })
        })

        // Create all locations
        await createLocationsInBatches(allLocations)

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
