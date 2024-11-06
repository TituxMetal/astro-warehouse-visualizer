import type { Prisma, PrismaClient } from '@prisma/client'
import { prisma } from '~/lib/prisma'

const BATCH_SIZE = 1000

export const createLocationsInBatches = async (
  data: Prisma.LocationCreateManyInput[],
  batchSize: number = BATCH_SIZE,
  db: PrismaClient = prisma
) => {
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize)
    await db.location.createMany({ data: batch })
  }
}
