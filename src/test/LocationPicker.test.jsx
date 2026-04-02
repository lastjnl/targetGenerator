import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LocationPicker from '../components/LocationPicker'

describe('LocationPicker', () => {
  it('renders Home and Office options', () => {
    render(<LocationPicker value="home" onChange={() => {}} />)
    expect(screen.getByText(/Home/)).toBeInTheDocument()
    expect(screen.getByText(/Office/)).toBeInTheDocument()
  })

  it('checks the Home radio when value is "home"', () => {
    render(<LocationPicker value="home" onChange={() => {}} />)
    const homeRadio = screen.getByRole('radio', { name: /Home/ })
    const officeRadio = screen.getByRole('radio', { name: /Office/ })
    expect(homeRadio).toBeChecked()
    expect(officeRadio).not.toBeChecked()
  })

  it('checks the Office radio when value is "office"', () => {
    render(<LocationPicker value="office" onChange={() => {}} />)
    const officeRadio = screen.getByRole('radio', { name: /Office/ })
    expect(officeRadio).toBeChecked()
  })

  it('calls onChange when clicking a radio option', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(<LocationPicker value="home" onChange={handleChange} />)

    await user.click(screen.getByText(/Office/))
    expect(handleChange).toHaveBeenCalledWith('office')
  })
})
