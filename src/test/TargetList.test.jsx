import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TargetList from '../components/TargetList'

describe('TargetList', () => {
  const defaultProps = {
    targets: ['Write tests', 'Review PR'],
    onUpdate: () => {},
    onRemove: () => {},
    onAdd: () => {},
  }

  it('renders all target inputs', () => {
    render(<TargetList {...defaultProps} />)
    expect(screen.getByDisplayValue('Write tests')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Review PR')).toBeInTheDocument()
  })

  it('renders number emojis for each target', () => {
    render(<TargetList {...defaultProps} />)
    expect(screen.getByText('1️⃣')).toBeInTheDocument()
    expect(screen.getByText('2️⃣')).toBeInTheDocument()
  })

  it('renders the "Add target" button', () => {
    render(<TargetList {...defaultProps} />)
    expect(screen.getByText('+ Add target')).toBeInTheDocument()
  })

  it('calls onAdd when clicking "Add target"', async () => {
    const user = userEvent.setup()
    const handleAdd = vi.fn()
    render(<TargetList {...defaultProps} onAdd={handleAdd} />)

    await user.click(screen.getByText('+ Add target'))
    expect(handleAdd).toHaveBeenCalledOnce()
  })

  it('calls onRemove when clicking the remove button', async () => {
    const user = userEvent.setup()
    const handleRemove = vi.fn()
    render(<TargetList {...defaultProps} onRemove={handleRemove} />)

    const removeButtons = screen.getAllByTitle('Remove target')
    await user.click(removeButtons[0])
    expect(handleRemove).toHaveBeenCalledWith(0)
  })

  it('disables remove button when only one target', () => {
    render(<TargetList {...defaultProps} targets={['Single']} />)
    const removeButton = screen.getByTitle('Remove target')
    expect(removeButton).toBeDisabled()
  })

  it('calls onUpdate when typing in a target input', async () => {
    const user = userEvent.setup()
    const handleUpdate = vi.fn()
    render(<TargetList {...defaultProps} onUpdate={handleUpdate} />)

    const input = screen.getByDisplayValue('Write tests')
    await user.type(input, '!')
    expect(handleUpdate).toHaveBeenCalled()
  })
})
