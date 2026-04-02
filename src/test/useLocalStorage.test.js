import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useLocalStorage } from '../hooks/useLocalStorage'

describe('useLocalStorage', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  afterEach(() => {
    window.localStorage.clear()
  })

  it('returns the initial value when nothing is stored', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'))
    expect(result.current[0]).toBe('default')
  })

  it('returns the stored value if present in localStorage', () => {
    window.localStorage.setItem('test-key', JSON.stringify('saved'))
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'))
    expect(result.current[0]).toBe('saved')
  })

  it('updates state and localStorage when setValue is called', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'))

    act(() => {
      result.current[1]('updated')
    })

    expect(result.current[0]).toBe('updated')
    expect(JSON.parse(window.localStorage.getItem('test-key'))).toBe('updated')
  })

  it('accepts a function updater', () => {
    const { result } = renderHook(() => useLocalStorage('counter', 0))

    act(() => {
      result.current[1]((prev) => prev + 1)
    })

    expect(result.current[0]).toBe(1)
    expect(JSON.parse(window.localStorage.getItem('counter'))).toBe(1)
  })

  it('handles invalid JSON in localStorage gracefully', () => {
    window.localStorage.setItem('test-key', 'not-json')
    const { result } = renderHook(() => useLocalStorage('test-key', 'fallback'))
    expect(result.current[0]).toBe('fallback')
  })
})
