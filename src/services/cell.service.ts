// src/services/cell.service.ts
import type { Prisma } from '@prisma/client'
import { prisma } from '~/lib/prisma'
import type { CellConfigForm } from '~/schemas/implementation.schema'
import { generateLevels } from '~/utils/implementation'
import { createLocationsInBatches } from './createLocationsInBatches'

export const cellService = {
  async createAisles(aislesData: Array<{ number: number; isOdd: boolean; cellId: number }>) {
    return await prisma.$transaction(aislesData.map(data => prisma.aisle.create({ data })))
  },

  async createBays(aisles: Array<{ id: number }>, baysPerSide: number) {
    const baysData: Prisma.BayCreateManyInput[] = aisles.flatMap(aisle =>
      Array.from({ length: baysPerSide }, (_, i) => ({
        number: i + 1,
        width: 4,
        aisleId: aisle.id
      }))
    )

    await prisma.bay.createMany({ data: baysData })

    return baysData
  },

  async createLocations(
    aisles: Array<{ id: number; isOdd: boolean }>,
    bays: Array<{ id: number; aisleId: number }>,
    input: CellConfigForm
  ) {
    const levels = generateLevels(input.levelCount)
    const allLocations: Prisma.LocationCreateManyInput[] = []

    aisles.forEach(aisle => {
      const aisleBays = bays.filter(bay => bay.aisleId === aisle.id)
      aisleBays.forEach((bay, bayIndex) => {
        const locationsInBay = Math.min(4, input.locationsPerAisle / 2 - bayIndex * 4)

        for (let i = 0; i < locationsInBay; i++) {
          const basePosition = bayIndex * 4 + i
          const position = aisle.isOdd ? basePosition * 2 + 1 : (basePosition + 1) * 2

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

    await createLocationsInBatches(allLocations)

    return allLocations
  },
  async getAllCells() {
    return await prisma.cell.findMany({
      include: {
        _count: {
          select: { aisles: true }
        }
      }
    })
  }
}