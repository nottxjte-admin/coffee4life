/**
 * scrollStore — tiny event-emitter bridge between the R3F ScrollControls
 * (inside Canvas) and plain React components (outside Canvas).
 *
 * Usage inside Canvas:
 *   import { publishScroll } from '../scrollStore'
 *   useFrame(() => publishScroll(scroll.offset))
 *
 * Usage outside Canvas:
 *   import { useScrollOffset } from '../scrollStore'
 *   const offset = useScrollOffset()  // 0 → 1
 */

import { useState, useEffect } from 'react'

let _listeners = []
let _lastOffset = 0

export function publishScroll(offset) {
  _lastOffset = offset
  for (let i = 0; i < _listeners.length; i++) {
    _listeners[i](offset)
  }
}

export function useScrollOffset() {
  const [offset, setOffset] = useState(_lastOffset)

  useEffect(() => {
    _listeners.push(setOffset)
    return () => {
      _listeners = _listeners.filter((l) => l !== setOffset)
    }
  }, [])

  return offset
}
