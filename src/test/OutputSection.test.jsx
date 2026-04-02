import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import OutputSection from '../components/OutputSection'

describe('OutputSection', () => {
  const sampleOutput = '🏠 | ⛅ 12°C | ⛑️ Jos | 🎯 Fix login bug\n1️⃣ Write tests'

  beforeEach(() => {
    // Mock clipboard API
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      writable: true,
      configurable: true,
    })
  })

  it('renders the output title', () => {
    render(<OutputSection output={sampleOutput} />)
    expect(screen.getByText('Your standup message')).toBeInTheDocument()
  })

  it('renders the output in a readonly textarea', () => {
    render(<OutputSection output={sampleOutput} />)
    const textarea = screen.getByLabelText('Your standup message')
    expect(textarea).toHaveValue(sampleOutput)
    expect(textarea).toHaveAttribute('readonly')
  })

  it('renders the copy button', () => {
    render(<OutputSection output={sampleOutput} />)
    expect(screen.getByText('📋 Copy to clipboard')).toBeInTheDocument()
  })

  it('copies text and shows confirmation when clicking copy', async () => {
    // Setup clipboard mock before rendering
    const user = userEvent.setup({
      writeToClipboard: true,
    })

    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      writable: true,
      configurable: true,
    })

    render(<OutputSection output={sampleOutput} />)

    await user.click(screen.getByText('📋 Copy to clipboard'))

    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith(sampleOutput)
    })
    expect(screen.getByText('✅ Copied!')).toBeInTheDocument()
  })
})
