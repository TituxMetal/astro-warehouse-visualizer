/// <reference types="vitest" />
import path from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    include: ['src/**/*.test.{js,ts}']
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './src'),
      '~ui': path.resolve(__dirname, './src/components/ui')
    }
  }
})
