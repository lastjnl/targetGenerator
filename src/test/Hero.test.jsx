import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Hero from '../components/Hero'

describe('Hero', () => {
  it('renders the title', () => {
    render(<Hero />)
    expect(screen.getByText('Daily Standup Generator')).toBeInTheDocument()
  })

  it('renders the subtitle text', () => {
    render(<Hero />)
    expect(screen.getByText(/Craft your perfect standup message/)).toBeInTheDocument()
  })

  it('renders the clipboard emoji icon', () => {
    render(<Hero />)
    expect(screen.getByText('📋')).toBeInTheDocument()
  })
})
