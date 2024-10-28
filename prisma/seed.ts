import { prisma } from '~/lib/prisma'

// Generate 5 sample data to seed in prisma database

const seed = async () => {
  console.log('Start seeding ...')

  // Delete existing data
  console.log('Deleted existing data')

  // Create new data
  console.log('Created new data')

  console.log('Seeding finished')
}

seed()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
