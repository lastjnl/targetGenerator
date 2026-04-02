import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useWeather } from '../hooks/useWeather'

// Mock the weather utility functions
vi.mock('../utils/weather', () => ({
  NL_FALLBACK: { lat: 52.13, lon: 5.29, label: 'Netherlands' },
  weatherCodeToEmoji: vi.fn((code) => (code === 0 ? '☀️' : '⛅')),
  fetchWeather: vi.fn(),
  geocodeCity: vi.fn(),
}))

import { fetchWeather, geocodeCity } from '../utils/weather'

describe('useWeather', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts with the initial city and empty temp', () => {
    const { result } = renderHook(() => useWeather('Utrecht'))
    expect(result.current.city).toBe('Utrecht')
    expect(result.current.temp).toBe('')
    expect(result.current.loading).toBe(false)
  })

  it('fetches weather after debounce when city is set', async () => {
    geocodeCity.mockResolvedValue({
      results: [{ name: 'Utrecht', country: 'Netherlands', latitude: 52.09, longitude: 5.12 }],
    })
    fetchWeather.mockResolvedValue({
      current_weather: { temperature: 14.2, weathercode: 0 },
    })

    const { result } = renderHook(() => useWeather('Utrecht'))

    // advanceTimersByTimeAsync flushes both timers and microtasks (promises)
    await act(async () => {
      await vi.advanceTimersByTimeAsync(700)
    })

    expect(result.current.temp).toBe('14°C')
    expect(result.current.hint).toBe('Utrecht, Netherlands')
  })

  it('falls back to NL when city is not found', async () => {
    geocodeCity.mockResolvedValue({ results: [] })
    fetchWeather.mockResolvedValue({
      current_weather: { temperature: 10.8, weathercode: 3 },
    })

    const { result } = renderHook(() => useWeather('Nonexistent'))

    await act(async () => {
      await vi.advanceTimersByTimeAsync(700)
    })

    expect(result.current.temp).toBe('11°C')
    expect(result.current.hint).toContain('Not found')
    expect(result.current.hint).toContain('Netherlands')
  })

  it('handles fetch errors gracefully', async () => {
    geocodeCity.mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => useWeather('Broken'))

    await act(async () => {
      await vi.advanceTimersByTimeAsync(700)
    })

    expect(result.current.temp).toBe('')
    expect(result.current.hint).toBe('Failed to fetch weather')
  })

  it('clears temp and hint when city is empty', async () => {
    const { result } = renderHook(() => useWeather(''))

    await act(async () => {
      await vi.advanceTimersByTimeAsync(100)
    })

    expect(result.current.temp).toBe('')
    expect(result.current.hint).toBe('')
  })

  it('updates city via setCity', () => {
    const { result } = renderHook(() => useWeather('Utrecht'))

    act(() => {
      result.current.setCity('Amsterdam')
    })

    expect(result.current.city).toBe('Amsterdam')
  })
})
