// src/services/aisle.service.ts
import { prisma } from '~/lib/prisma'

export const aisleService = {
  async getAisleWithLocations(cellNumber: number, aisleNumber: number) {
    const aisles = await prisma.aisle.findMany({
      where: {
        number: aisleNumber,
        cell: {
          number: cellNumber
        }
      },
      include: {
        cell: true,
        locations: {
          orderBy: {
            position: 'asc'
          },
          distinct: ['position', 'level']
        },
        _count: {
          select: {
            locations: true
          }
        }
      }
    })

    return aisles
  }
}
