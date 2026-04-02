import { useState } from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

// Mock the useWeather hook so tests don't make real API calls
vi.mock('../hooks/useWeather', () => ({
  useWeather: () => ({
    city: 'Utrecht',
    setCity: vi.fn(),
    temp: '14°C',
    emoji: '⛅',
    hint: 'Utrecht, Netherlands',
    loading: false,
  }),
}))

// Mock useLocalStorage to use plain useState (no actual localStorage)
vi.mock('../hooks/useLocalStorage', () => ({
  useLocalStorage: (_key, initialValue) => useState(initialValue),
}))

function getOutputTextarea() {
  return screen.getAllByRole('textbox').find((el) => el.readOnly)
}

describe('App – integration', () => {
  beforeEach(() => {
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
      writable: true,
      configurable: true,
    })
  })

  it('renders the full form', () => {
    render(<App />)
    expect(screen.getByText('Daily Standup Generator')).toBeInTheDocument()
    expect(screen.getByText(/Home/)).toBeInTheDocument()
    expect(screen.getByText(/Office/)).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Jos')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Fix login bug')).toBeInTheDocument()
    expect(screen.getByText('✨ Generate')).toBeInTheDocument()
  })

  it('does not show output section before generating', () => {
    render(<App />)
    expect(screen.queryByText('Your standup message')).not.toBeInTheDocument()
  })

  it('disables generate button when required fields are empty', () => {
    render(<App />)
    expect(screen.getByText('✨ Generate')).toBeDisabled()
  })

  it('shows validation hint when form is incomplete', () => {
    render(<App />)
    expect(screen.getByText(/Fill in handler, goal, and at least one target/)).toBeInTheDocument()
  })

  it('enables generate button when all fields are filled', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByPlaceholderText('Jos'), 'Jos')
    await user.type(screen.getByPlaceholderText('Fix login bug'), 'Goal')
    await user.type(screen.getByPlaceholderText('Target 1'), 'Task')

    expect(screen.getByText('✨ Generate')).toBeEnabled()
  })

  it('generates the standup message with correct format', async () => {
    const user = userEvent.setup()
    render(<App />)

    // Fill in the form
    await user.type(screen.getByPlaceholderText('Jos'), 'Jos')
    await user.type(screen.getByPlaceholderText('Fix login bug'), 'Sprint goal')
    await user.type(screen.getByPlaceholderText('Target 1'), 'Write unit tests')

    // Generate
    await user.click(screen.getByText('✨ Generate'))

    // Verify output
    expect(screen.getByText('Your standup message')).toBeInTheDocument()
    const textarea = getOutputTextarea()
    expect(textarea.value).toContain('🏠')
    expect(textarea.value).toContain('⛅ 14°C')
    expect(textarea.value).toContain('⛑️ Jos')
    expect(textarea.value).toContain('🎯 Sprint goal')
    expect(textarea.value).toContain('1️⃣ Write unit tests')
  })

  it('switches location to office', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByText(/Office/))
    await user.type(screen.getByPlaceholderText('Jos'), 'Test')
    await user.type(screen.getByPlaceholderText('Fix login bug'), 'Goal')
    await user.type(screen.getByPlaceholderText('Target 1'), 'Task')
    await user.click(screen.getByText('✨ Generate'))

    const output = getOutputTextarea()
    expect(output.value).toContain('🏢')
  })

  it('adds and removes targets', async () => {
    const user = userEvent.setup()
    render(<App />)

    // Start with 1 target
    expect(screen.getAllByPlaceholderText(/Target/).length).toBe(1)

    // Add two more
    await user.click(screen.getByText('+ Add target'))
    await user.click(screen.getByText('+ Add target'))
    expect(screen.getAllByPlaceholderText(/Target/).length).toBe(3)

    // Remove one
    const removeButtons = screen.getAllByTitle('Remove target')
    await user.click(removeButtons[2])
    expect(screen.getAllByPlaceholderText(/Target/).length).toBe(2)
  })

  it('does not remove the last remaining target', async () => {
    const user = userEvent.setup()
    render(<App />)

    const removeButton = screen.getByTitle('Remove target')
    expect(removeButton).toBeDisabled()
    await user.click(removeButton)
    expect(screen.getAllByPlaceholderText(/Target/).length).toBe(1)
  })

  it('filters out empty targets from output', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByPlaceholderText('Jos'), 'Jos')
    await user.type(screen.getByPlaceholderText('Fix login bug'), 'Goal')

    // Add a second target but leave it empty
    await user.click(screen.getByText('+ Add target'))
    await user.type(screen.getByPlaceholderText('Target 1'), 'Real task')

    await user.click(screen.getByText('✨ Generate'))

    const output = getOutputTextarea()
    expect(output.value).toContain('1️⃣ Real task')
    expect(output.value).not.toContain('2️⃣')
  })
})
