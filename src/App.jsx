import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ScrollControls, Scroll, useScroll } from '@react-three/drei'
import './App.css'

// A component that changes based on scroll progress
function AnimationController() {
  const meshRef = useRef()
  const scroll = useScroll()
  
  useFrame(() => {
    // scroll.offset is overall scroll progress (0 to 1)
    const progress = scroll.offset
    
    // Example state changes based on scroll
    // 1. Rotate the box continuously based on overall progress
    meshRef.current.rotation.x = progress * Math.PI * 4
    meshRef.current.rotation.y = progress * Math.PI * 4
    
    // 2. Trigger animations using range
    // range(from, distance, margin) returns a 0-1 value when scroll is within range
    // Let's animate scale when scrolling from 0.2 to 0.4
    const scaleFactor = 1 + scroll.range(0.2, 0.2) * 2
    meshRef.current.scale.set(scaleFactor, scaleFactor, scaleFactor)
    
    // 3. Move across screen using curve (0-1-0) when scrolling from 0.4 to 0.6
    const xPos = scroll.curve(0.4, 0.2) * 5 - 2.5
    meshRef.current.position.x = xPos

    // 4. Color change based on visibility or threshold
    if (progress > 0.8) {
      meshRef.current.material.color.set('hotpink')
    } else if (progress > 0.5) {
      meshRef.current.material.color.set('lightblue')
    } else {
      meshRef.current.material.color.set('orange')
    }
  })
  
  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  )
}

function HTMLContent() {
  return (
    <Scroll html style={{ width: '100vw', color: 'white' }}>
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', padding: '0 10vw' }}>
        <h1>1. Scroll Down to Start</h1>
      </div>
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 10vw' }}>
        <h1>2. Expanding Range (0.2 - 0.4)</h1>
      </div>
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', padding: '0 10vw' }}>
        <h1>3. Curve Motion (0.4 - 0.6)</h1>
      </div>
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 10vw' }}>
        <h1>4. Color Change (&gt; 0.5 & &gt; 0.8)</h1>
      </div>
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', padding: '0 10vw' }}>
        <h1>5. End of Scroll</h1>
      </div>
    </Scroll>
  )
}

function App() {
  return (
    <div id="canvas-container" style={{ width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0 }}>
      <Canvas>
        <ambientLight intensity={Math.PI / 2} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
        
        {/* ScrollControls sets up a scrollable HTML overlay and provides useScroll context */}
        {/* pages=5 means the scrollable height is 5 times the viewport height */}
        <ScrollControls pages={5} damping={0.1}>
          <AnimationController />
          <HTMLContent />
        </ScrollControls>
      </Canvas>
    </div>
  )
}

export default App
