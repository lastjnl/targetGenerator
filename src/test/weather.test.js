import { describe, it, expect } from 'vitest'
import { weatherCodeToEmoji, NL_FALLBACK } from '../utils/weather'

describe('weatherCodeToEmoji', () => {
  it('returns ☀️ for clear sky (code 0)', () => {
    expect(weatherCodeToEmoji(0)).toBe('☀️')
  })

  it('returns ⛅ for partly cloudy (codes 1–3)', () => {
    expect(weatherCodeToEmoji(1)).toBe('⛅')
    expect(weatherCodeToEmoji(2)).toBe('⛅')
    expect(weatherCodeToEmoji(3)).toBe('⛅')
  })

  it('returns 🌫️ for fog (codes 4–48)', () => {
    expect(weatherCodeToEmoji(45)).toBe('🌫️')
    expect(weatherCodeToEmoji(48)).toBe('🌫️')
  })

  it('returns 🌧️ for drizzle (codes 51–57)', () => {
    expect(weatherCodeToEmoji(51)).toBe('🌧️')
    expect(weatherCodeToEmoji(57)).toBe('🌧️')
  })

  it('returns 🌧️ for rain (codes 58–65)', () => {
    expect(weatherCodeToEmoji(61)).toBe('🌧️')
    expect(weatherCodeToEmoji(65)).toBe('🌧️')
  })

  it('returns 🌨️ for freezing rain (codes 66–67)', () => {
    expect(weatherCodeToEmoji(66)).toBe('🌨️')
    expect(weatherCodeToEmoji(67)).toBe('🌨️')
  })

  it('returns ❄️ for snow (codes 68–77)', () => {
    expect(weatherCodeToEmoji(71)).toBe('❄️')
    expect(weatherCodeToEmoji(77)).toBe('❄️')
  })

  it('returns 🌧️ for rain showers (codes 78–82)', () => {
    expect(weatherCodeToEmoji(80)).toBe('🌧️')
    expect(weatherCodeToEmoji(82)).toBe('🌧️')
  })

  it('returns 🌨️ for snow showers (codes 83–86)', () => {
    expect(weatherCodeToEmoji(85)).toBe('🌨️')
    expect(weatherCodeToEmoji(86)).toBe('🌨️')
  })

  it('returns ⛈️ for thunderstorm (code 95)', () => {
    expect(weatherCodeToEmoji(95)).toBe('⛈️')
  })

  it('returns ⛈️ for thunderstorm with hail (codes 96–99)', () => {
    expect(weatherCodeToEmoji(96)).toBe('⛈️')
    expect(weatherCodeToEmoji(99)).toBe('⛈️')
  })

  it('returns ☁️ for unknown codes (≥100)', () => {
    expect(weatherCodeToEmoji(100)).toBe('☁️')
    expect(weatherCodeToEmoji(200)).toBe('☁️')
  })

  it('returns ⛅ for negative codes (falls through to code<=3)', () => {
    expect(weatherCodeToEmoji(-1)).toBe('⛅')
  })
})

describe('NL_FALLBACK', () => {
  it('has valid latitude and longitude for the Netherlands', () => {
    expect(NL_FALLBACK.lat).toBeCloseTo(52.13, 1)
    expect(NL_FALLBACK.lon).toBeCloseTo(5.29, 1)
  })

  it('has a label', () => {
    expect(NL_FALLBACK.label).toBe('Netherlands')
  })
})
