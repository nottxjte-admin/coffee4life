import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { ScrollControls } from '@react-three/drei'
import SceneController from './components/SceneController'
import UI from './components/UI'
import ScrollProgress from './components/ScrollProgress'
import './App.css'

// Minimal loading screen shown while Three.js assets initialise
function LoadingFallback() {
  return (
    <div className="loading-screen" role="status" aria-label="Loading 3D scene">
      <div className="loading-logo">Coffee4life</div>
      <div className="loading-bar">
        <div className="loading-fill" />
      </div>
    </div>
  )
}

function App() {
  return (
    <div id="canvas-container" className="canvas-wrapper">
      {/* LoadingFallback is rendered outside Canvas so it's visible immediately */}
      <Suspense fallback={<LoadingFallback />}>
        <Canvas
          shadows
          dpr={[1, 1.5]}
          camera={{ position: [0, 2, 5], fov: 45 }}
          gl={{ antialias: true }}
          aria-label="Coffee4life interactive 3D scene"
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
