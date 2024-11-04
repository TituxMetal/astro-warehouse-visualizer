import { Prisma } from '@prisma/client'
import { prisma } from '~/lib/prisma'

const BATCH_SIZE = 1000 // Increased batch size for better performance

const createLocationsInBatches = async (
  data: Prisma.LocationCreateManyInput[],
  batchSize: number = BATCH_SIZE
) => {
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize)
    await prisma.location.createMany({ data: batch })
  }
}

const seed = async () => {
  console.log('Starting seed process...')

  const deletedData = await prisma.$transaction([
    prisma.location.deleteMany(),
    prisma.bay.deleteMany(),
    prisma.aisle.deleteMany(),
    prisma.cell.deleteMany()
  ])

  console.log('deletedData', deletedData)

  console.time('Seed duration')

  // Create the cell
  const cell = await prisma.cell.create({
    data: {
      number: 1,
      aislesCount: 18,
      locationsPerAisle: 104,
      levelsPerLocation: 5
    }
  })

  // Calculate number of bays needed (assuming 4 locations per bay)
  const baysPerSide = Math.ceil(104 / 4)

  // Prepare all aisles data first
  const aislesData = Array.from({ length: 18 }, (_, i) => [
    { number: i + 1, isOdd: true, cellId: cell.id },
    { number: i + 1, isOdd: false, cellId: cell.id }
  ]).flat()

  // Create all aisles in one batch
  const aisles = await prisma.$transaction(aislesData.map(data => prisma.aisle.create({ data })))

  console.log(`Created ${aisles.length} aisles`)

  // Create bays for all aisles in batches
  const baysData: Prisma.BayCreateManyInput[] = []
  aisles.forEach(aisle => {
    for (let i = 0; i < baysPerSide; i++) {
      baysData.push({
        number: i + 1,
        width: 4,
        aisleId: aisle.id
      })
    }
  })

  await prisma.bay.createMany({ data: baysData })
  console.log(`Created ${baysData.length} bays`)

  // Get all created bays for reference
  const bays = await prisma.bay.findMany({
    orderBy: [{ aisleId: 'asc' }, { number: 'asc' }]
  })

  // Prepare all locations data
  let allLocations: Prisma.LocationCreateManyInput[] = []

  aisles.forEach((aisle, aisleIndex) => {
    const aisleBays = bays.slice(aisleIndex * baysPerSide, (aisleIndex + 1) * baysPerSide)

    aisleBays.forEach((bay, bayIndex) => {
      const locationsInBay = Math.min(4, 104 - bayIndex * 4)

      for (let i = 0; i < locationsInBay; i++) {
        const basePosition = bayIndex * 4 + i
        const position = aisle.isOdd ? basePosition * 2 + 1 : (basePosition + 1) * 2

        // Add all levels at once
        allLocations.push(
          {
            position,
            level: 0,
            isPicking: true,
            aisleId: aisle.id,
            bayId: bay.id
          },
          ...[10, 20, 30, 40].map(level => ({
            position,
            level,
            isPicking: false,
            aisleId: aisle.id,
            bayId: bay.id
          }))
        )
      }
    })
  })

  console.log(`Creating ${allLocations.length} locations...`)
  await createLocationsInBatches(allLocations)

  console.timeEnd('Seed duration')
  console.log('Seed process completed successfully!')
}

seed()
  .catch(e => {
    console.error('Error during seed process:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
