// @ts-check
import { defineConfig } from 'astro/config'

import react from '@astrojs/react'
import vercel from '@astrojs/vercel'
import tailwindcss from '@tailwindcss/vite'
import icon from 'astro-icon'

export default defineConfig({
  integrations: [react(), icon({ iconDir: 'src/assets/icons' })],
  vite: {
    plugins: [tailwindcss()]
  },
  output: 'server',
  security: {
    checkOrigin: true
  },
  adapter: vercel()
})
