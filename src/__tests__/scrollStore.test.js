import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'

// Reset module-level state before each test by re-importing the module
let publishScroll, useScrollOffset

beforeEach(async () => {
  vi.resetModules()
  const mod = await import('../scrollStore')
  publishScroll = mod.publishScroll
  useScrollOffset = mod.useScrollOffset
})

describe('scrollStore — publishScroll', () => {
  it('notifies a single subscribed listener when publishScroll is called', () => {
    const { result } = renderHook(() => useScrollOffset())

    act(() => {
      publishScroll(0.42)
    })

    expect(result.current).toBe(0.42)
  })

  it('notifies multiple subscribed listeners simultaneously', () => {
    const hook1 = renderHook(() => useScrollOffset())
    const hook2 = renderHook(() => useScrollOffset())
    const hook3 = renderHook(() => useScrollOffset())

    act(() => {
      publishScroll(0.75)
    })

    expect(hook1.result.current).toBe(0.75)
    expect(hook2.result.current).toBe(0.75)
    expect(hook3.result.current).toBe(0.75)
  })

  it('stores and notifies with the most recent offset', () => {
    const { result } = renderHook(() => useScrollOffset())

    act(() => {
      publishScroll(0.1)
    })
    expect(result.current).toBe(0.1)

    act(() => {
      publishScroll(0.5)
    })
    expect(result.current).toBe(0.5)

    act(() => {
      publishScroll(1.0)
    })
    expect(result.current).toBe(1.0)
  })

  it('handles zero offset correctly', () => {
    const { result } = renderHook(() => useScrollOffset())

    act(() => {
      publishScroll(0.5)
    })
    expect(result.current).toBe(0.5)

    act(() => {
      publishScroll(0)
    })
    expect(result.current).toBe(0)
  })
})

describe('scrollStore — useScrollOffset', () => {
  it('returns the initial default offset of 0 before any publish', () => {
    const { result } = renderHook(() => useScrollOffset())
    expect(result.current).toBe(0)
  })

  it('updates returned value after publishScroll is called', () => {
    const { result } = renderHook(() => useScrollOffset())

    act(() => {
      publishScroll(0.33)
    })

    expect(result.current).toBe(0.33)
  })

  it('each hook instance gets the latest published value', () => {
    const hookA = renderHook(() => useScrollOffset())

    act(() => {
      publishScroll(0.25)
    })

    const hookB = renderHook(() => useScrollOffset())

    // hookB picks up the last published value
    expect(hookB.result.current).toBe(0.25)

    act(() => {
      publishScroll(0.88)
    })

    expect(hookA.result.current).toBe(0.88)
    expect(hookB.result.current).toBe(0.88)
  })

  it('unsubscribes on unmount so removed listeners do not receive updates', () => {
    const hook1 = renderHook(() => useScrollOffset())
    const hook2 = renderHook(() => useScrollOffset())

    // Unmount hook1 — its listener should be removed
    hook1.unmount()

    // publishScroll should NOT throw and should still notify hook2
    act(() => {
      publishScroll(0.99)
    })

    expect(hook2.result.current).toBe(0.99)
  })

  it('multiple unmounts do not break remaining listeners', () => {
    const hook1 = renderHook(() => useScrollOffset())
    const hook2 = renderHook(() => useScrollOffset())
    const hook3 = renderHook(() => useScrollOffset())

    hook1.unmount()
    hook3.unmount()

    act(() => {
      publishScroll(0.55)
    })

    expect(hook2.result.current).toBe(0.55)
  })
})