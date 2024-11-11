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
        bays: {
          include: {
            locations: {
              orderBy: {
                position: 'asc'
              }
            },
            aisle: true
          },
          orderBy: {
            number: 'asc'
          }
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
