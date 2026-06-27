import { Suspense, useState, useCallback, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { ScrollControls } from '@react-three/drei'
import SceneController from './components/SceneController'
import UI from './components/UI'
import ScrollProgress from './components/ScrollProgress'
import FallbackUI from './components/FallbackUI'
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
  const [webglError, setWebglError] = useState(false)
  const canvasContainerRef = useRef(null)

  // Check WebGL context validity immediately after Canvas creation.
  // The webglcontextcreationerror event fires BEFORE onCreated,
  // so instead of listening for the event, we inspect the renderer's
  // context directly.
  const handleCanvasCreated = useCallback((state) => {
    try {
      const gl = state.gl
      if (!gl) {
        setWebglError(true)
        return
      }

      // Try to get the WebGL context — if context creation failed,
      // this will return null or the context will be in a lost state.
      const context = gl.getContext()
      if (!context || context.isContextLost()) {
        setWebglError(true)
      }
    } catch {
      setWebglError(true)
    }
  }, [])

  // If a WebGL error has occurred, show fallback
  if (webglError) {
    return <FallbackUI />
  }

  return (
    <div id="canvas-container" className="canvas-wrapper" ref={canvasContainerRef}>
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
          onCreated={handleCanvasCreated}
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

      {/* Scroll progress UI lives outside Canvas so it's on top of everything */}
      <ScrollProgress />
    </div>
  )
}

export default App