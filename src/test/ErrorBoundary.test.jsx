import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ErrorBoundary from '../components/ErrorBoundary'

function ThrowingComponent() {
  throw new Error('Test error')
}

function GoodComponent() {
  return <p>All good</p>
}

describe('ErrorBoundary', () => {
  // Suppress console.error for expected errors
  const originalError = console.error
  beforeEach(() => {
    console.error = () => {}
  })
  afterEach(() => {
    console.error = originalError
  })

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <GoodComponent />
      </ErrorBoundary>,
    )
    expect(screen.getByText('All good')).toBeInTheDocument()
  })

  it('renders the error UI when a child throws', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>,
    )
    expect(screen.getByText('⚠️ Something went wrong')).toBeInTheDocument()
    expect(screen.getByText(/unexpected error/)).toBeInTheDocument()
    expect(screen.getByText('🔄 Refresh')).toBeInTheDocument()
  })
})
