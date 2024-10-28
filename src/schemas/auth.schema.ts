import { z } from 'astro:schema'

export const authSchema = z.object({
  username: z.string().min(3).max(31),
  password: z.string().min(6).max(255)
})
