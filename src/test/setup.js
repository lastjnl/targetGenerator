import '@testing-library/jest-dom/vitest'
import { beforeAll, afterAll } from 'vitest'

// Suppress jsdom's "Not implemented: HTMLCanvasElement.getContext()" noise
const originalError = console.error
beforeAll(() => {
  console.error = (...args) => {
    if (typeof args[0] === 'string' && args[0].includes('Not implemented')) return
    originalError(...args)
  }
})
afterAll(() => {
  console.error = originalError
})
