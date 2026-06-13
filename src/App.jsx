import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { ScrollControls } from '@react-three/drei'
import SceneController from './components/SceneController'
import UI from './components/UI'
import './App.css'

function App() {
  return (
    <div id="canvas-container" style={{ width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0, background: '#faf0e6' }}>
      <Canvas shadows camera={{ position: [0, 2, 5], fov: 45 }}>
        <Suspense fallback={null}>
          {/* ScrollControls sets up a scrollable HTML overlay and provides useScroll context */}
          {/* pages=5 matches our 5 HTML sections */}
          <ScrollControls pages={5} damping={0.25}>
            <SceneController />
            <UI />
          </ScrollControls>
        </Suspense>
      </Canvas>
    </div>
  )
}

export default App
