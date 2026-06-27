import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

/*
 * Suppress known R3F deprecation warnings at module level (before any
 * component mounts). R3F v9.6.1 creates `new THREE.Clock()` during store
 * init, but Three.js r170 deprecated Clock in favor of Timer. We can't
 * fix this without a breaking R3F upgrade, so we suppress the noise.
 *
 * Also catches the WebGLRenderer \"Context Lost\" message that fires in
 * headless / VM environments where a real GPU isn't available.
 */
const originalWarn = console.warn
console.warn = (...args) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('THREE.Clock') ||
     args[0].includes('THREE.WebGLRenderer') ||
     args[0].includes('R3F:'))
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