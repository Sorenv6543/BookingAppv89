import { describe, it, expect } from 'vitest'

describe('Basic test suite', () => {
  it('should pass a simple test', () => {
    expect(1 + 1).toBe(2)
  })
  
  it('should handle string operations', () => {
    expect('hello').toContain('ell')
    expect('hello'.length).toBe(5)
  })
  
  it('should handle boolean logic', () => {
    expect(true).toBe(true)
    expect(false).toBe(false)
    expect(!!0).toBe(false)
  })
}) 