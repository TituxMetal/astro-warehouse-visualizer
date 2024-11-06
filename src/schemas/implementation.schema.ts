import { z } from 'astro:schema'

const locationType = z.enum(['odd', 'even', 'both'])

export const implementationSchema = z.object({
  cellNumber: z.number().positive(),
  aisleStart: z.number().positive(),
  aisleEnd: z.number().positive(),
  startLocationType: locationType,
  endLocationType: locationType,
  locationsPerAisle: z.number().positive(),
  levelCount: z.number().positive(),
  hasPicking: z.boolean()
})

export type CellConfigForm = z.infer<typeof implementationSchema>
