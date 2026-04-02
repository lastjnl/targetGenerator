import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import WeatherInput from '../components/WeatherInput'

describe('WeatherInput', () => {
  const defaultProps = {
    city: 'Utrecht',
    onCityChange: () => {},
    temp: '12°C',
    emoji: '⛅',
    hint: 'Utrecht, Netherlands',
    loading: false,
  }

  it('renders the city input with the current value', () => {
    render(<WeatherInput {...defaultProps} />)
    const input = screen.getByPlaceholderText(/City name/)
    expect(input).toHaveValue('Utrecht')
  })

  it('displays temperature and emoji in the badge', () => {
    render(<WeatherInput {...defaultProps} />)
    expect(screen.getByText('⛅ 12°C')).toBeInTheDocument()
  })

  it('shows loading indicator when loading', () => {
    render(<WeatherInput {...defaultProps} loading={true} />)
    expect(screen.getByText('⏳')).toBeInTheDocument()
  })

  it('shows dash when no temp and not loading', () => {
    render(<WeatherInput {...defaultProps} temp="" loading={false} />)
    expect(screen.getByText('—')).toBeInTheDocument()
  })

  it('displays the hint text', () => {
    render(<WeatherInput {...defaultProps} />)
    expect(screen.getByText('Utrecht, Netherlands')).toBeInTheDocument()
  })

  it('does not display hint when empty', () => {
    render(<WeatherInput {...defaultProps} hint="" />)
    expect(screen.queryByText('Utrecht, Netherlands')).not.toBeInTheDocument()
  })

  it('calls onCityChange when typing', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(<WeatherInput {...defaultProps} city="" onCityChange={handleChange} />)

    const input = screen.getByPlaceholderText(/City name/)
    await user.type(input, 'A')
    expect(handleChange).toHaveBeenCalledWith('A')
  })
})
