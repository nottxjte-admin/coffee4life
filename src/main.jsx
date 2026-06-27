import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

/*
 * Suppress known deprecation warnings at the module level before any
 * component mounts. This catches the R3F store initialization which
 * creates `new THREE.Clock()` before Canvas.onCreated fires.
 *
 * Error 1 fix: THREE.Clock is deprecated in Three.js r184, replaced by
 * THREE.Timer. R3F v9.6.1 uses Clock internally — we can't fix that
 * without a breaking R3F upgrade, so we suppress the noise.
 */
const originalWarn = console.warn
console.warn = (...args) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('THREE.Clock') ||
      args[0].includes('THREE.WebGLRenderer'))
  ) {
    return
  }
  originalWarn.apply(console, args)
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)