import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import * as THREE from 'three'
import { CoffeeCup, CoffeeBean, Plant, Particles } from './Models'

export default function SceneController() {
  const scroll = useScroll()
  
  // Refs for our groups to animate
  const sceneGroup = useRef()
  const cupGroup = useRef()
  const beansGroup = useRef()
  const plantGroup = useRef()
  
  // Arrays for beans
  const beansArr = Array.from({ length: 20 })

  useFrame((state, delta) => {
    // Scroll offset ranges from 0 to 1
    const r3 = scroll.range(2 / 5, 1 / 5) // Process to Experience
    
    // Overall progress
    const progress = scroll.offset

    // 1. Camera Animation
    // Move camera in an arc around the scene as we scroll
    const angle = progress * Math.PI * 1.5
    const radius = 5 - progress * 2 // Dolly in slightly
    
    // Smooth camera movement using state.camera
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, Math.sin(angle) * radius, 0.05)
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, Math.cos(angle) * radius, 0.05)
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, 2 + Math.sin(progress * Math.PI) * 2, 0.05)
    state.camera.lookAt(0, 0.5, 0)

    // 2. Object Animations
    
    // Cup: starts center, moves left during origin, explodes during process
    if (cupGroup.current) {
      // Float up slightly when in Experience
      cupGroup.current.position.y = THREE.MathUtils.lerp(0, 0.5, r3)
      
      // Exploded view logic: split saucer and cup
      const explodeAmount = scroll.curve(2/5, 1/5) * 1.5
      cupGroup.current.children[0].position.y = 0.5 + explodeAmount // Cup body
      cupGroup.current.children[1].position.y = 0.5 + explodeAmount // Handle
      cupGroup.current.children[2].position.y = 0.9 + explodeAmount // Coffee
      cupGroup.current.children[3].position.y = -explodeAmount * 0.5 // Saucer
    }

    // Beans: cluster at start, scatter/float during origin and process
    if (beansGroup.current) {
      const scatterAmount = scroll.curve(1/5, 3/5) * 4
      
      beansGroup.current.children.forEach((bean, i) => {
        // Individual bean movement
        const angleBean = (i / beansArr.length) * Math.PI * 2
        const dist = 0.5 + scatterAmount * (1 + (i % 3) * 0.5)
        
        const targetX = Math.cos(angleBean) * dist
        const targetZ = Math.sin(angleBean) * dist
        const targetY = (scatterAmount > 0) ? Math.sin(state.clock.elapsedTime + i) * 0.5 + scatterAmount : 0
        
        bean.position.x = THREE.MathUtils.lerp(bean.position.x, targetX, 0.05)
        bean.position.z = THREE.MathUtils.lerp(bean.position.z, targetZ, 0.05)
        bean.position.y = THREE.MathUtils.lerp(bean.position.y, targetY, 0.05)
        
        bean.rotation.x += delta * (0.2 + scatterAmount)
        bean.rotation.y += delta * (0.3 + scatterAmount)
      })
    }

    // Plant: scale up during the Experience phase
    if (plantGroup.current) {
      const plantScale = 0.1 + r3 * 0.9 // grows from 0.1 to 1.0
      plantGroup.current.scale.set(plantScale, plantScale, plantScale)
      plantGroup.current.position.set(-2, 0, -2)
    }
    
    // Scene overall rotation for a turntable feel
    if (sceneGroup.current) {
      sceneGroup.current.rotation.y = progress * Math.PI * 0.5
    }
  })

  return (
    <group ref={sceneGroup}>
      {/* Lighting tailored for the coffee vibe */}
      <ambientLight intensity={0.4} color="#fff1e6" />
      <directionalLight 
        position={[5, 10, 5]} 
        intensity={1.2} 
        color="#ffe8d6"
        castShadow 
        shadow-mapSize={[1024, 1024]}
      />
      <spotLight 
        position={[-5, 5, -5]} 
        intensity={0.8} 
        color="#e29578" 
        penumbra={1}
      />
      <pointLight position={[0, 2, 0]} intensity={0.5} color="#d4a373" />

      {/* Main composition */}
      <group position={[0, -0.5, 0]}>
        <group ref={cupGroup}>
          <CoffeeCup />
        </group>

        <group ref={beansGroup}>
          {beansArr.map((_, i) => (
            <CoffeeBean key={i} />
          ))}
        </group>

        <group ref={plantGroup} scale={0.1}>
          <Plant />
        </group>
        
        {/* Soft floating particles for ambiance */}
        <Particles count={150} />
      </group>
      
      {/* Subtle floor for shadows and grounding */}
      <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#faf0e6" roughness={1} />
      </mesh>
    </group>
  )
}
