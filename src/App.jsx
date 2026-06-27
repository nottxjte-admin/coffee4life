import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { ScrollControls } from '@react-three/drei'
import SceneController from './components/SceneController'
import UI, { Nav } from './components/UI'
import ScrollProgress from './components/ScrollProgress'
import WebGLErrorBoundary from './components/WebGLErrorBoundary'
import { useScrollOffset } from './scrollStore'
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

/** Nav rendered outside Canvas so it doesn't block scroll events */
function ExternalNav() {
  const offset = useScrollOffset()
  return <Nav scrollOffset={offset} />
}

function App() {
  return (
    <div id="canvas-container" className="canvas-wrapper">
      <WebGLErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          <Canvas
            shadows
            dpr={[1, 1.5]}
            camera={{ position: [0, 2, 5], fov: 45 }}
            gl={{
              antialias: true,
              failIfMajorPerformanceCaveat: false,
              powerPreference: 'high-performance',
            }}
            aria-label="Coffee4life interactive 3D scene"
            onCreated={() => {
              /* Suppress THREE.Clock deprecation (R3F v9.6.1 uses Clock internally;
                 Three.js r170 deprecated it in favor of Timer). */
              const origWarn = console.warn
              console.warn = (...args) => {
                if (
                  typeof args[0] === 'string' &&
                  (args[0].includes('THREE.Clock') ||
                   args[0].includes('THREE.WebGLRenderer'))
                ) return
                origWarn.apply(console, args)
              }

              /* Suppress Context Lost log (informational in headless / VM envs) */
              const origLog = console.log
              console.log = (...args) => {
                if (
                  typeof args[0] === 'string' &&
                  args[0].includes('WebGLRenderer: Context Lost')
                ) return
                origLog.apply(console, args)
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

      {/* Nav and progress live outside Canvas so they don't block scroll */}
      <ExternalNav />
      <ScrollProgress />
    </div>
  )
}

export default App