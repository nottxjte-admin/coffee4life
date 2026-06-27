import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { ScrollControls } from '@react-three/drei'
import SceneController from './components/SceneController'
import UI from './components/UI'
import ScrollProgress from './components/ScrollProgress'
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

function App() {
  return (
    <div id="canvas-container" className="canvas-wrapper">
      {/* Error Boundary catches WebGL failures and shows graceful fallback */}
      <WebGLErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          <Canvas
            shadows
            dpr={[1, 1.5]}
            camera={{ position: [0, 2, 5], fov: 45 }}
            gl={{
              antialias: true,
              // Don't abort when no discrete GPU is available — common in
              // headless browsers, VMs, and integrated-GPU laptops.
              failIfMajorPerformanceCaveat: false,
              // Prefer WebGL2 but allow graceful fallback to WebGL1
              powerPreference: 'high-performance',
            }}
            aria-label="Coffee4life interactive 3D scene"
            // In React 19, onError is called when Canvas initialization fails
            // (replaces the old onCreated error callback pattern)
            onCreated={() => {
              // Suppress known deprecation: R3F v9.6.1 uses THREE.Clock internally,
              // which Three.js r184 deprecated in favor of THREE.Timer.
              // This intercept avoids a noisy console.warn that we can't fix without
              // upgrading @react-three/fiber (risk of breaking API changes).
              const originalWarn = console.warn
              console.warn = (...args) => {
                if (
                  typeof args[0] === 'string' &&
                  args[0].includes('THREE.Clock')
                ) {
                  return
                }
                originalWarn.apply(console, args)
              }

              // Suppress the Context Lost log, which fires in headless/VM
              // environments. This is expected behavior when no GPU is present.
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
              {/* ScrollControls: pages=5 matches the 5 HTML sections in UI.jsx */}
              <ScrollControls pages={5} damping={0.25}>
                <SceneController />
                <UI />
              </ScrollControls>
            </Suspense>
          </Canvas>
        </Suspense>
      </WebGLErrorBoundary>

      {/* Scroll progress UI lives outside Canvas so it's on top of everything */}
      <ScrollProgress />
    </div>
  )
}

export default App