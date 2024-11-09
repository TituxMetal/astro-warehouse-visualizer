// src/services/location.service.ts
import { prisma } from '~/lib/prisma'
import type { CellWithAislesAndLocations } from '~/types/warehouse'

export const locationService = {
  async getLocationContext(
    cellNumber: number,
    aisleNumber: number,
    position: number,
    level: number
  ): Promise<CellWithAislesAndLocations | null> {
    try {
      const cell = await prisma.cell.findUnique({
        where: { number: cellNumber },
        select: {
          number: true,
          aisles: {
            where: {
              number: {
                gte: Math.max(1, aisleNumber - 2),
                lte: aisleNumber + 2
              }
            },
            orderBy: [{ number: 'asc' }, { isOdd: 'asc' }],
            select: {
              number: true,
              isOdd: true,
              locations: {
                where: {
                  position: {
                    gte: Math.max(1, position - 5),
                    lte: position + 5
                  }
                },
                orderBy: [{ position: 'asc' }, { level: 'asc' }],
                select: {
                  position: true,
                  level: true,
                  isPicking: true
                }
              }
            }
          }
        }
      })

      return cell || null
    } catch (error) {
      console.error('Error fetching location context:', error)
      throw new Error('Failed to fetch location data')
    }
  }
}
