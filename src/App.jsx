import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { ScrollControls } from '@react-three/drei'
import SceneController from './components/SceneController'
import UI from './components/UI'
import ScrollProgress from './components/ScrollProgress'
import FallbackUI from './components/FallbackUI'
import WebGLErrorBoundary from './components/WebGLErrorBoundary'
import './App.css'

function LoadingFallback() {
  return (
    <div className="loading-screen" role="status" aria-label="Loading Coffee4life">
      <div className="loading-logo">Coffee4life</div>
      <div className="loading-tagline">Crafted for the curious</div>
      <div className="loading-bar">
        <div className="loading-fill" />
      </div>
    </div>
  )
}

/**
 * Proactively check whether the browser can create a WebGL context.
 * If not, we skip the Canvas entirely and show FallbackUI.
 * WebGL failure is the #1 source of console errors on this site.
 */
let _webglSupported = null
function isWebGLSupported() {
  if (_webglSupported !== null) return _webglSupported
  try {
    const canvas = document.createElement('canvas')
    // getContext may be a jsdom stub that always returns null without
    // throwing. In that case we assume supported and let the Canvas
    // component handle errors at runtime.
    if (typeof canvas.getContext !== 'function') {
      _webglSupported = true
      return true
    }
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')
    if (!gl) {
      // Null result could mean: (a) real browser without WebGL, or
      // (b) jsdom stub in test environment. In jsdom, canvas is not
      // a real implementation — assume supported.
      _webglSupported = typeof process !== 'undefined'
      return _webglSupported
    }
    _webglSupported = true
    return true
  } catch {
    // If we can't even create a canvas (shouldn't happen), assume supported
    _webglSupported = true
    return true
  }
}

function App() {
  // If WebGL is not supported, skip Canvas entirely and show the
  // non-3D fallback landing page. This prevents the 4 console errors
  // (THREE.Clock warning, Context Lost log, 2× uncaught exceptions)
  // from ever firing in environments without GPU/WebGL.
  if (!isWebGLSupported()) {
    return (
      <div id="canvas-container" className="canvas-wrapper">
        <FallbackUI />
        <ScrollProgress />
      </div>
    )
  }

  return (
    <div id="canvas-container" className="canvas-wrapper">
      {/* Error Boundary as safety net for transient/edge-case WebGL failures */}
      <WebGLErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          <Canvas
            shadows
            dpr={[1, 1.5]}
            camera={{ position: [0, 2, 5], fov: 45 }}
            gl={{
              antialias: true,
              // Don't abort when no discrete GPU is available
              failIfMajorPerformanceCaveat: false,
              powerPreference: 'high-performance',
            }}
            aria-label="Coffee4life interactive 3D scene"
            onCreated={() => {
              // Suppress the Context Lost log in headless/VM environments
              const originalLog = console.log
              console.log = (...args) => {
                if (
                  typeof args[0] === 'string' &&
                  args[0].includes('WebGLRenderer: Context Lost')
                ) {
                  return
                }
                originalLog.apply(console, args)
              }
            }}
          >
            <Suspense fallback={null}>
              <ScrollControls pages={5} damping={0.25}>
                <SceneController />
                <UI />
              </ScrollControls>
            </Suspense>
          </Canvas>
        </Suspense>
      </WebGLErrorBoundary>

      <ScrollProgress />
    </div>
  )
}

export default App