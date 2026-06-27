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

  // Listen for webglcontextcreationerror on the canvas element.
  // This catches WebGL failures at the DOM level before they become
  // uncaught exceptions that crash the React tree.
  const handleCanvasCreated = useCallback((state) => {
    const canvas = state.gl.domElement
    if (!canvas) return

    const onContextError = () => {
      setWebglError(true)
    }

    canvas.addEventListener('webglcontextcreationerror', onContextError, { once: true })
    canvas.addEventListener('webglcontextlost', onContextError, { once: true })

    // Store cleanup ref
    canvas._webglErrorHandler = onContextError
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