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
    const offset = scroll.offset

    // Ranges
    // r1: Hero to Origin (0 to 0.25)
    const rHeroOrigin = scroll.range(0, 0.25)
    // r2: Origin to Process (0.25 to 0.5)
    const rOriginProcess = scroll.range(0.25, 0.25)
    // r3: Process to Experience (0.5 to 0.75)
    const rProcessExperience = scroll.range(0.5, 0.25)
    // r4: Experience to End (0.75 to 1.0)
    const rExperienceEnd = scroll.range(0.75, 0.25)
    
    // Curves (parabolic peaks)
    const cOrigin = scroll.curve(0.125, 0.25) // Peaks at Origin
    const cProcess = scroll.curve(0.375, 0.25) // Peaks at Process
    const cExperience = scroll.curve(0.625, 0.25) // Peaks at Experience

    // 1. Camera Animation
    // Arc the camera around based on total offset
    const angle = offset * Math.PI * 2
    // Dolly out at Origin, dolly in at End
    const radius = 5 + cOrigin * 2 - rExperienceEnd * 1.5
    const camY = 2 + cProcess * 2 - rExperienceEnd * 0.5
    
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, Math.sin(angle) * radius, 0.05)
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, Math.cos(angle) * radius, 0.05)
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, camY, 0.05)
    state.camera.lookAt(0, 0.5, 0)

    // 2. Object Animations
    
    if (cupGroup.current) {
      // Cup floats up towards the end
      const targetY = rProcessExperience * 0.5 + rExperienceEnd * 0.2
      cupGroup.current.position.y = THREE.MathUtils.lerp(cupGroup.current.position.y, targetY, 0.05)
      
      // Exploded view during the "Process" phase
      const explodeAmount = cProcess * 2.0
      
      // We assume Models.jsx exports CoffeeCup with 4 children meshes 
      // (body, handle, coffee, saucer) if not, this still applies to its children
      if (cupGroup.current.children.length > 0 && cupGroup.current.children[0].children.length >= 4) {
        const parts = cupGroup.current.children[0].children
        // Smoothly animate explosion
        parts[0].position.y = THREE.MathUtils.lerp(parts[0].position.y, 0.5 + explodeAmount * 0.8, 0.1) // Body
        parts[1].position.y = THREE.MathUtils.lerp(parts[1].position.y, 0.5 + explodeAmount * 0.8, 0.1) // Handle
        parts[2].position.y = THREE.MathUtils.lerp(parts[2].position.y, 0.9 + explodeAmount * 1.2, 0.1) // Coffee
        parts[3].position.y = THREE.MathUtils.lerp(parts[3].position.y, 0.0 - explodeAmount * 0.5, 0.1) // Saucer
      }
    }

    if (beansGroup.current) {
      // Beans scatter heavily during Origin, stay slightly scattered after
      const scatterAmount = rHeroOrigin * 3 + cOrigin * 2 + rOriginProcess * 3 - rExperienceEnd * 2
      
      beansGroup.current.children.forEach((bean, i) => {
        const angleBean = (i / beansArr.length) * Math.PI * 2
        // Base distance
        const dist = 0.3 + scatterAmount * (0.5 + (i % 3) * 0.3)
        
        const targetX = Math.cos(angleBean) * dist
        const targetZ = Math.sin(angleBean) * dist
        // Floating effect
        const floatY = (scatterAmount > 0) ? Math.sin(state.clock.elapsedTime * 2 + i) * 0.2 * scatterAmount : 0
        const targetY = floatY + scatterAmount * 0.2
        
        bean.position.x = THREE.MathUtils.lerp(bean.position.x, targetX, 0.05)
        bean.position.z = THREE.MathUtils.lerp(bean.position.z, targetZ, 0.05)
        bean.position.y = THREE.MathUtils.lerp(bean.position.y, targetY, 0.05)
        
        bean.rotation.x += delta * (0.1 + scatterAmount * 0.5)
        bean.rotation.y += delta * (0.2 + scatterAmount * 0.5)
      })
    }

    if (plantGroup.current) {
      // Plant grows mostly during Process and Experience
      const plantScale = 0.1 + rOriginProcess * 0.4 + rProcessExperience * 0.5 
      plantGroup.current.scale.setScalar(THREE.MathUtils.lerp(plantGroup.current.scale.x, plantScale, 0.05))
      
      // Move slightly into view
      const targetX = -2 - cExperience * 1
      const targetZ = -2 - cExperience * 1
      plantGroup.current.position.set(targetX, 0, targetZ)
    }
    
    // Overall turntable scene
    if (sceneGroup.current) {
      // Add a slight tilt and rotate based on scroll
      sceneGroup.current.rotation.y = offset * Math.PI * 0.25
    }
  })

  return (
    <group ref={sceneGroup}>
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

      <group position={[0, -0.5, 0]}>
        <group ref={cupGroup}>
          <CoffeeCup />
        </group>

        <group ref={beansGroup}>
          {beansArr.map((_, i) => (
            <CoffeeBean key={i} />
          ))}
        </group>

        <group ref={plantGroup} scale={0.1} position={[-2, 0, -2]}>
          <Plant />
        </group>
        
        <Particles count={150} />
      </group>
      
      <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#faf0e6" roughness={1} />
      </mesh>
    </group>
  )
}
