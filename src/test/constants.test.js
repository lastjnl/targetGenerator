import { describe, it, expect } from 'vitest'
import { NUMBER_EMOJIS } from '../utils/constants'

describe('NUMBER_EMOJIS', () => {
  it('has 9 emoji entries', () => {
    expect(NUMBER_EMOJIS).toHaveLength(9)
  })

  it('starts with 1️⃣ and ends with 9️⃣', () => {
    expect(NUMBER_EMOJIS[0]).toBe('1️⃣')
    expect(NUMBER_EMOJIS[8]).toBe('9️⃣')
  })

  it('contains all emojis from 1 to 9', () => {
    const expected = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣']
    expect(NUMBER_EMOJIS).toEqual(expected)
  })
})
