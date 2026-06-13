import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { ScrollControls, Scroll } from '@react-three/drei'
import SceneController from './components/SceneController'
import './App.css'

function HTMLContent() {
  return (
    <Scroll html style={{ width: '100vw', color: '#4a3018' }}>
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', padding: '0 10vw' }}>
        <div>
          <h1 style={{ fontSize: '4rem', margin: 0, color: '#3b2818' }}>Coffee4life</h1>
          <p style={{ fontSize: '1.5rem', margin: '1rem 0' }}>Savor the perfect blend.</p>
          <p style={{ opacity: 0.6 }}>Scroll down to explore</p>
        </div>
      </div>
      
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 10vw' }}>
        <div style={{ textAlign: 'right', maxWidth: '400px' }}>
          <h2 style={{ fontSize: '3rem', margin: 0 }}>The Origin</h2>
          <p style={{ fontSize: '1.2rem', lineHeight: 1.6 }}>Sourced from the finest high-altitude farms. Every bean is handpicked for exceptional quality and character.</p>
        </div>
      </div>
      
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', padding: '0 10vw' }}>
        <div style={{ maxWidth: '400px' }}>
          <h2 style={{ fontSize: '3rem', margin: 0 }}>The Process</h2>
          <p style={{ fontSize: '1.2rem', lineHeight: 1.6 }}>An artisanal approach. Precision roasting unlocks the complex aromas and deep flavors hidden within.</p>
        </div>
      </div>
      
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 10vw' }}>
        <div style={{ textAlign: 'right', maxWidth: '400px' }}>
          <h2 style={{ fontSize: '3rem', margin: 0 }}>The Experience</h2>
          <p style={{ fontSize: '1.2rem', lineHeight: 1.6 }}>More than just a drink. A moment of tranquility, accompanied by the warmth and aroma that fills the room.</p>
        </div>
      </div>
      
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 10vw' }}>
        <div>
          <h2 style={{ fontSize: '4rem', margin: 0 }}>Taste the Magic</h2>
          <p style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Ready for your daily ritual?</p>
          <button style={{ 
            background: '#3b2818', 
            color: 'white', 
            border: 'none', 
            padding: '1rem 2.5rem', 
            fontSize: '1.2rem', 
            borderRadius: '30px',
            cursor: 'pointer',
            transition: 'background 0.3s'
          }}>
            Shop Now
          </button>
        </div>
      </div>
    </Scroll>
  )
}

function App() {
  return (
    <div id="canvas-container" style={{ width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0, background: '#faf0e6' }}>
      <Canvas shadows camera={{ position: [0, 2, 5], fov: 45 }}>
        <Suspense fallback={null}>
          {/* ScrollControls sets up a scrollable HTML overlay and provides useScroll context */}
          {/* pages=5 matches our 5 HTML sections */}
          <ScrollControls pages={5} damping={0.25}>
            <SceneController />
            <HTMLContent />
          </ScrollControls>
        </Suspense>
      </Canvas>
    </div>
  )
}

export default App
